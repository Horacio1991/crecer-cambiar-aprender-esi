import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { EXPEDIENTE_2_DATA } from './src/data/curriculumData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '16kb' }));
const grantSecret=process.env.EXPEDIENTE2_TOKEN_SECRET||'';
const supabaseUrl=process.env.SUPABASE_URL||process.env.VITE_SUPABASE_URL||'';
const supabaseAnon=process.env.VITE_SUPABASE_ANON_KEY||'';
const supabaseAdmin=supabaseUrl&&process.env.SUPABASE_SERVICE_ROLE_KEY?createClient(supabaseUrl,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}}):null;
const supabaseAuth=supabaseUrl&&supabaseAnon?createClient(supabaseUrl,supabaseAnon,{auth:{persistSession:false,autoRefreshToken:false}}):null;
const codeHash=(value:string)=>crypto.createHash('sha256').update(value).digest('hex');
function makeGrant(){const now=Math.floor(Date.now()/1000),payload=Buffer.from(JSON.stringify({scope:'expediente2',iat:now,exp:now+28800})).toString('base64url'),head=Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url'),input=`${head}.${payload}`;return `${input}.${crypto.createHmac('sha256',grantSecret).update(input).digest('base64url')}`}
function validGrant(token=''){try{if(!grantSecret)return false;const [h,p,s]=token.split('.'),input=`${h}.${p}`,sig=crypto.createHmac('sha256',grantSecret).update(input).digest(),candidate=Buffer.from(s,'base64url');if(sig.length!==candidate.length||!crypto.timingSafeEqual(sig,candidate))return false;const c=JSON.parse(Buffer.from(p,'base64url').toString());return c.scope==='expediente2'&&c.exp>Date.now()/1000}catch{return false}}
const tries=new Map<string,{n:number,t:number}>();
app.post('/api/teacher/expediente2-code',async(req,res)=>{try{const token=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');if(!supabaseAdmin||!supabaseAuth)return res.status(503).json({error:'ConfiguraciÃ³n incompleta.'});const {data,error}=await supabaseAuth.auth.getUser(token);if(error||data.user?.app_metadata?.role!=='docente')return res.status(403).json({error:'Acceso docente requerido.'});const enabled=req.body?.enabled!==false;const code=typeof req.body?.code==='string'?req.body.code.trim():'';if(enabled&&(code.length<8||code.length>32||!/^[A-Z0-9-]+$/i.test(code)))return res.status(400).json({error:'CÃ³digo no vÃ¡lido.'});const {error:dbError}=await supabaseAdmin.from('app_settings').upsert({key:'expediente2_code_hash',value:enabled?codeHash(code):''},{onConflict:'key'});if(dbError)return res.status(500).json({error:'No se pudo actualizar el acceso.'});return res.json({enabled});}catch{return res.status(500).json({error:'No se pudo actualizar el acceso.'})}});
app.post('/api/unlock-expediente2',async(req,res)=>{const code=typeof req.body?.code==='string'?req.body.code.trim():'';const key=req.ip||'unknown',now=Date.now(),state=tries.get(key);if(state&&now-state.t<600000&&state.n>=10)return res.status(429).json({error:'Intenta mÃ¡s tarde.'});if(!state||now-state.t>=600000)tries.set(key,{n:1,t:now});else state.n++;if(!grantSecret)return res.status(503).json({error:'Acceso no configurado.'});if(code.length>64)return res.status(401).json({error:'CÃ³digo no vÃ¡lido.'});let expected='';if(supabaseAdmin){const {data}=await supabaseAdmin.from('app_settings').select('value').eq('key','expediente2_code_hash').maybeSingle();expected=typeof data?.value==='string'?data.value:'';}else if(process.env.EXPEDIENTE2_CODE){expected=codeHash(process.env.EXPEDIENTE2_CODE.trim());}else{return res.status(503).json({error:'Acceso no configurado.'})}const actual=codeHash(code);const a=Buffer.from(actual),b=Buffer.from(expected||'0'.repeat(64));if(!expected||a.length!==b.length||!crypto.timingSafeEqual(a,b))return res.status(401).json({error:'CÃ³digo no vÃ¡lido.'});tries.delete(key);return res.json({token:makeGrant()})});
app.get('/api/expediente2',(req,res)=>{const token=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');if(!validGrant(token))return res.status(401).json({error:'Acceso requerido.'});res.json(EXPEDIENTE_2_DATA)});

// Initialize GoogleGenAI SDK on server side
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Error initializing GoogleGenAI:', err);
  }
}

// Fallback rule-based pedagogical classifier & responder for 6th grade ESI
function classifyLocally(question: string, reproductionUnlocked: boolean) {
  const qLower = question.toLowerCase();

  // Urgent / Safety check
  const safetyKeywords = ['abuso', 'violencia', 'golpe', 'tocar sin permiso', 'tocÃ³ sin permiso', 'toque sin permiso', 'obligar', 'obligÃ³', 'forzar', 'forzÃ³', 'acoso', 'amenaza', 'presiÃ³n', 'presionar', 'sin consentimiento', 'sin mi permiso', 'foto Ã­ntima', 'fotos Ã­ntimas', 'imagen Ã­ntima', 'miedo en casa', 'secreto malo'];
  if (safetyKeywords.some((kw) => qLower.includes(kw))) {
    return {
      category: 'H. Tema que requiere intervenciÃ³n adulta',
      categoryKey: 'safety',
      answer: 'Tu seguridad y tus derechos son lo mÃ¡s importante. Nadie tiene derecho a hacerte daÃ±o, hacerte sentir incÃ³modo/a ni guardar secretos que te hagan sentir mal. Por favor, hablalo de inmediato con una persona adulta de confianza (en tu familia, tu escuela, docentes o directivos) o comunicate con las lÃ­neas de ayuda para niÃ±as, niÃ±os y adolescentes.',
      companion: 'SofÃ­a y Mateo recuerdan: siempre tenÃ©s derecho a decir NO y a pedir ayuda.'
    };
  }

  // Personal anxiety / diagnostic question
  if (
    qLower.includes('es normal que a mÃ­') ||
    qLower.includes('es normal que me pase') ||
    qLower.includes('tengo un problema') ||
    qLower.includes('por quÃ© a mÃ­ no') ||
    qLower.includes('me duele') ||
    qLower.includes('estoy enfermo')
  ) {
    return {
      category: 'E. Cuidado y respeto',
      categoryKey: 'personal',
      answer: 'Los cambios de la pubertad pueden aparecer en diferentes momentos y de distintas maneras. Cada cuerpo tiene su propio ritmo y no hay un Ãºnico modelo "correcto". Si algo te genera dolor, molestia o preocupaciÃ³n persistente, es muy importante que lo converses con una persona adulta de confianza de tu familia o con un profesional de la salud.',
      companion: 'SofÃ­a dice: "A mÃ­ tambiÃ©n me pasaba dudar si lo mÃ­o era normal. Â¡Cada persona va a su propio tiempo!"'
    };
  }

  // Reproduction keywords
  const reproKeywords = ['fecundaciÃ³n', 'Ã³vulo', 'espermatozoide', 'embarazo', 'Ãºtero', 'trompas de falopio', 'relaciÃ³n sexual', 'sexo', 'genitales internos', 'bebÃ©', 'engendrar', 'fecundar', 'parto', 'Ã³vulos'];
  const hasRepro = reproKeywords.some((kw) => qLower.includes(kw));

  if (hasRepro) {
    if (!reproductionUnlocked) {
      return {
        category: 'F. ReproducciÃ³n bloqueada',
        categoryKey: 'reproduction_locked',
        answer: 'Esa es una pregunta muy interesante y forma parte de la prÃ³xima etapa de nuestra investigaciÃ³n. Primero vamos a comprender mejor los cambios que ocurren durante la pubertad, las emociones y los vÃ­nculos. Cuando tu docente habilite el siguiente expediente, podremos investigar quÃ© ocurre dentro del cuerpo.',
        companion: 'Mateo dice: "Â¡Genial pregunta! EstÃ¡ reservada para el Expediente 2 cuando la o el profe abra esa parte."'
      };
    } else {
      return {
        category: 'G. ReproducciÃ³n habilitada',
        categoryKey: 'reproduction_unlocked',
        answer: 'En el Expediente 2 investigamos cÃ³mo distintas estructuras de la anatomÃ­a reproductiva maduran durante la pubertad gracias a las hormonas. Los ovarios pueden producir Ã³vulos y los testÃ­culos espermatozoides. En la reproducciÃ³n humana, la fecundaciÃ³n ocurre cuando estas cÃ©lulas reproductoras se unen; describir estos Ã³rganos o procesos no determina la identidad de gÃ©nero de una persona.',
        companion: 'SofÃ­a y Mateo: "La reproducciÃ³n es un proceso biolÃ³gico que estudiamos con respeto y lenguaje cientÃ­fico."'
      };
    }
  }

  // Hormonal changes
  if (qLower.includes('hormona') || qLower.includes('sustancia') || qLower.includes('testosterona') || qLower.includes('estrÃ³geno')) {
    return {
      category: 'B. Cambio fÃ­sico',
      categoryKey: 'hormonal',
      answer: 'Las hormonas son sustancias quÃ­micas naturales que funcionan como mensajeras dentro del organismo. Durante la pubertad, determinadas glÃ¡ndulas envÃ­an seÃ±ales a diferentes Ã³rganos para activar el crecimiento, los cambios en la voz, en la piel y la maduraciÃ³n biolÃ³gica.',
      companion: 'Mateo dice: "Â¡Son como cartas con instrucciones que viajan por la sangre para que el cuerpo empiece a transformarse!"'
    };
  }

  // Physical changes
  if (
    qLower.includes('voz') ||
    qLower.includes('vello') ||
    qLower.includes('pelo') ||
    qLower.includes('altura') ||
    qLower.includes('crecer') ||
    qLower.includes('mamas') ||
    qLower.includes('pecho') ||
    qLower.includes('granos') ||
    qLower.includes('acnÃ©') ||
    qLower.includes('olor') ||
    qLower.includes('transpir') ||
    qLower.includes('menstruac') ||
    qLower.includes('regla') ||
    qLower.includes('eyaculac') ||
    qLower.includes('poluciÃ³n')
  ) {
    return {
      category: 'B. Cambio fÃ­sico',
      categoryKey: 'physical',
      answer: 'Los cambios fÃ­sicos son modificaciones observables en el cuerpo durante la pubertad: el estirÃ³n de estatura, la apariciÃ³n de vello en diferentes zonas, cambios en la piel y el sudor, variaciones en el tono de voz, desarrollo de las mamas o cambios en los genitales (como la menstruaciÃ³n o las primeras eyaculaciones). No todas las personas viven estos cambios al mismo tiempo ni en el mismo orden.',
      companion: 'SofÃ­a dice: "Cada cuerpo tiene su propio calendario biolÃ³gico; no hay que apurarse ni compararse."'
    };
  }

  // Emotional changes
  if (
    qLower.includes('emoci') ||
    qLower.includes('enojo') ||
    qLower.includes('llorar') ||
    qLower.includes('triste') ||
    qLower.includes('Ã¡nimo') ||
    qLower.includes('humor') ||
    qLower.includes('vergÃ¼enza') ||
    qLower.includes('insegur') ||
    qLower.includes('autoestima') ||
    qLower.includes('privacidad') ||
    qLower.includes('solo') ||
    qLower.includes('sola')
  ) {
    return {
      category: 'C. Cambio emocional',
      categoryKey: 'emotional',
      answer: 'Durante la pubertad es muy habitual sentir emociones mÃ¡s intensas o experimentar cambios rÃ¡pidos de estado de Ã¡nimo. TambiÃ©n surge una mayor necesidad de privacidad y momentos a solas para pensar. Esto no significa que una persona sea irracional; es parte natural de descubrir quiÃ©nes somos y cÃ³mo nos sentimos.',
      companion: 'Mateo dice: "A veces siento que algo pequeÃ±o me molesta mÃ¡s de lo comÃºn. Aprender a respirar y poner palabras ayuda mucho."'
    };
  }

  // Relational changes
  if (
    qLower.includes('amig') ||
    qLower.includes('grupo') ||
    qLower.includes('discut') ||
    qLower.includes('pelea') ||
    qLower.includes('lÃ­mite') ||
    qLower.includes('exclui') ||
    qLower.includes('familia') ||
    qLower.includes('papÃ¡s') ||
    qLower.includes('mamÃ¡') ||
    qLower.includes('disculpa') ||
    qLower.includes('pertenecer')
  ) {
    return {
      category: 'D. Cambio vincular',
      categoryKey: 'relational',
      answer: 'Los cambios vinculares tienen que ver con cÃ³mo nos relacionamos con los demÃ¡s: con amigos, compaÃ±eros y la familia. En 6.Âº grado los grupos de amigos cobran mucho valor, y pueden surgir desacuerdos. Lo importante es aprender a expresar lo que sentimos con respeto, escuchar al otro, poner lÃ­mites claros y buscar soluciones mediante el diÃ¡logo.',
      companion: 'SofÃ­a dice: "Tener desacuerdos es normal; la clave es saber escuchar y nunca usar burlas ni maltratos."'
    };
  }

  // General puberty
  return {
    category: 'A. Pubertad',
    categoryKey: 'general_puberty',
    answer: 'La pubertad es una etapa de transiciÃ³n entre la niÃ±ez y la adolescencia en la que ocurren transformaciones fÃ­sicas, hormonales, emocionales y en nuestras relaciones. Lo mÃ¡s enriquecedor es recordar que crecer no es una carrera: cada persona tiene su propio ritmo y todos los cuerpos son valiosos y merecen respeto.',
    companion: 'SofÃ­a y Mateo: "Â¡Investigar juntos nos ayuda a derribar mitos y a tratarnos con empatÃ­a!"'
  };
}

// API endpoint for answering student questions
app.post('/api/ask-question', async (req, res) => {
  try {
    const { question } = req.body;
    const reproductionUnlocked = validGrant((req.headers.authorization || '').replace(/^Bearer\s+/i, ''));

    if (!question || typeof question !== 'string' || question.trim().length === 0 || question.length > 1200) {
      return res.status(400).json({ error: 'La pregunta no puede estar vacÃ­a.' });
    }

    const cleanQuestion = question.trim();

    // Seguridad, lÃ­mites, consentimiento y vulneraciones tienen prioridad incluso con Expediente 2 bloqueado.
    const cleanLower = cleanQuestion.toLowerCase();
    const safetyPriorityWords = ['abuso','violencia','golpe','tocar sin permiso','tocÃ³ sin permiso','toque sin permiso','obligar','obligÃ³','forzar','forzÃ³','acoso','amenaza','presiÃ³n','presionar','sin consentimiento','sin mi permiso','foto Ã­ntima','fotos Ã­ntimas','imagen Ã­ntima','miedo en casa','secreto malo'];
    if (safetyPriorityWords.some((w) => cleanLower.includes(w))) {
      return res.json({
        category: 'H. Tema que requiere intervenciÃ³n adulta',
        answer: 'Tu seguridad, tus lÃ­mites y tus derechos son lo mÃ¡s importante. Nadie debe obligarte, presionarte, tocarte sin permiso, amenazarte ni pedirte imÃ¡genes Ã­ntimas. Si algo asÃ­ ocurriÃ³ o te preocupa, contÃ¡selo cuanto antes a una persona adulta de confianza de tu familia o de la escuela para que pueda acompaÃ±arte y ayudarte.',
        companionQuote: 'SofÃ­a y Mateo: "Pedir ayuda cuando algo nos incomoda o nos hace sentir en peligro es una forma de cuidarnos."',
        reflectionQuestion: 'Â¿QuÃ© persona adulta de confianza podrÃ­a ayudarte a estar acompaÃ±ado/a y seguro/a?',
        reproductionBlocked: false,
      });
    }

    // DespuÃ©s de seguridad se aplica el bloqueo pedagÃ³gico de reproducciÃ³n.
    const reproWords = ['fecundaciÃ³n', 'Ã³vulo', 'espermatozoide', 'embarazo', 'Ãºtero', 'trompas de falopio', 'relaciÃ³n sexual', 'sexo', 'genitales internos', 'fecundar', 'parto'];
    const isReproQuery = reproWords.some((w) => cleanQuestion.toLowerCase().includes(w));

    if (isReproQuery && !reproductionUnlocked) {
      return res.json({
        category: 'F. ReproducciÃ³n bloqueada',
        answer: 'Esa es una pregunta muy interesante y forma parte de la prÃ³xima etapa de nuestra investigaciÃ³n. Primero vamos a comprender mejor los cambios que ocurren durante la pubertad, las emociones y los vÃ­nculos. Cuando tu docente habilite el siguiente expediente, podremos investigar quÃ© ocurre dentro del cuerpo.',
        companionQuote: 'Mateo: "Â¡Gran duda! Esta pregunta pertenece al Expediente 2. Cuando el/la docente lo habilite, investigaremos quÃ© ocurre dentro del cuerpo."',
        reproductionBlocked: true,
      });
    }

    // If Gemini is available, call it with strict pedagogical system instruction
    if (ai && process.env.GEMINI_API_KEY) {
      try {
        const systemInstruction = `
Sos el motor pedagÃ³gico de la aplicaciÃ³n escolar "Crecer, Cambiar y Aprender" para estudiantes de 6.Âº grado de EducaciÃ³n Primaria (11-12 aÃ±os), bajo los lineamientos de la EducaciÃ³n Sexual Integral (ESI).
Personajes que acompaÃ±an la app: SofÃ­a (11 aÃ±os, sensible, reflexiva) y Mateo (12 aÃ±os, curioso, sociable). SofÃ­a y Mateo NO son profesores, son compaÃ±eros de 6.Âº grado que tambiÃ©n estÃ¡n aprendiendo.

OBJETIVO:
Responder a las dudas de las y los estudiantes con:
- Lenguaje cientÃ­fico, claro, respetuoso, cÃ¡lido y adecuado para 11 y 12 aÃ±os.
- Cero infantilizaciÃ³n, cero moralina, cero generar miedo o vergÃ¼enza.
- Diferenciar cambios FÃSICOS, EMOCIONALES y VINCULARES.
- Integrar transversalmente los 5 ejes de la ESI cuando sean pertinentes: CUIDAR EL CUERPO Y LA SALUD; VALORAR LA AFECTIVIDAD; RESPETAR LA DIVERSIDAD; RECONOCER LA PERSPECTIVA DE GÃ‰NERO Y PROMOVER LA EQUIDAD; EJERCER NUESTROS DERECHOS.
- No presentar emociones como buenas o malas ni imponer una Ãºnica interpretaciÃ³n emocional.
- Priorizar situaciones ficticias y preguntas abiertas. NUNCA pedir experiencias Ã­ntimas, prÃ¡cticas sexuales, detalles del cuerpo, imÃ¡genes ni informaciÃ³n privada.
- AnatomÃ­a e identidad de gÃ©nero son dimensiones diferentes. Usar expresiones anatÃ³micas precisas solo cuando sean cientÃ­ficamente relevantes y nunca como etiquetas de identidad.
- Diversidad: Enfatizar que no todos los cuerpos crecen al mismo tiempo ni de la misma manera; no hay un "cuerpo normal" Ãºnico. Evitar estereotipos ("los varones hacen...", "las mujeres sienten..."). Usar "algunas personas...", "en muchas personas...".
- Si preguntan "Â¿Es normal que me pase esto?" o dudan de su cuerpo: NO diagnosticar enfermedades ni tratamientos. Responder con calidez que los ritmos son variados y que si algo duele o preocupa, es fundamental hablar con una persona adulta de confianza o profesional de salud.
- SEGURIDAD ESTRICTA: No solicitar fotos, descripciones Ã­ntimas, ni datos personales. Si hay indicios de acoso, violencia o maltrato, indicar con calidez acudir inmediatamente a un adulto de confianza o docentes.
- ESTADO DEL BLOQUE DE REPRODUCCIÃ“N: ${reproductionUnlocked ? 'ETAPA 2 HABILITADA (Se puede explicar con lenguaje cientÃ­fico y respetuoso anatomÃ­a reproductiva, Ã³vulo, espermatozoide, fecundaciÃ³n).' : 'ETAPA 2 BLOQUEADA (NO dar explicaciones biolÃ³gicas de Ã³rganos internos, fecundaciÃ³n o embarazo).'}
Si el estudiante pregunta por reproducciÃ³n biolÃ³gica detallada y la etapa 2 estÃ¡ BLOQUEADA, DEBES responder textualmente o parafraseando la respuesta obligatoria:
"Esa es una pregunta muy interesante y forma parte de la prÃ³xima etapa de nuestra investigaciÃ³n. Primero vamos a comprender mejor los cambios que ocurren durante la pubertad, las emociones y los vÃ­nculos. Cuando tu docente habilite el siguiente expediente, podremos investigar quÃ© ocurre dentro del cuerpo."

FORMATO DE RESPUESTA:
Debes responder en formato JSON estrictamente vÃ¡lido con los campos:
{
  "category": "Una de: A. Pubertad | B. Cambio fÃ­sico | C. Cambio emocional | D. Cambio vincular | E. Cuidado y respeto | F. ReproducciÃ³n bloqueada | G. ReproducciÃ³n habilitada | H. Tema que requiere intervenciÃ³n adulta",
  "answer": "Respuesta clara, breve y pedagÃ³gica de 2 a 4 oraciones apta para 6.Âº grado.",
  "companionQuote": "Una frase breve de SofÃ­a o Mateo (especificando quiÃ©n la dice) reflexionando como compaÃ±era/o de 6.Âº grado.",
  "reflectionQuestion": "Una pregunta breve para invitar a la reflexiÃ³n (ej: 'Â¿PensÃ¡s que esto involucra emociones, vÃ­nculos o el cuerpo?')"
}
`;

        const askGemini = async (model: string, timeout: number, useLowThinking: boolean) => {
          const startedAt = Date.now();
          const geminiResponse = await ai.models.generateContent({
            model,
            contents: cleanQuestion,
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              ...(useLowThinking ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } } : {}),
              httpOptions: { timeout },
            },
          });
          console.info('[Gemini] ' + model + ' OK en ' + (Date.now() - startedAt) + ' ms');
          return geminiResponse;
        };

        let geminiResponse;
        try {
          geminiResponse = await askGemini('gemini-3.8-flash', 4500, true);
        } catch (primaryError) {
          console.warn('[Gemini] gemini-3.8-flash fallÃ³; probando gemini-3.5-flash-lite:', primaryError);
          geminiResponse = await askGemini('gemini-3.5-flash-lite', 10000, false);
        }

        const text = geminiResponse.text;
        if (text) {
          const parsed = JSON.parse(text);
          return res.json({
            category: parsed.category || 'A. Pubertad',
            answer: parsed.answer,
            companionQuote: parsed.companionQuote,
            reflectionQuestion: parsed.reflectionQuestion,
            reproductionBlocked: !reproductionUnlocked && isReproQuery,
          });
        }
      } catch (geminiError) {
        console.warn('[Gemini] Ambos modelos fallaron; usando fallback local:', geminiError);
      }
    }

    // Fallback response using local expert classifier
    const fallback = classifyLocally(cleanQuestion, reproductionUnlocked);
    return res.json({
      category: fallback.category,
      answer: fallback.answer,
      companionQuote: fallback.companion,
      reflectionQuestion: 'Â¿De quÃ© manera creÃ©s que podemos cuidarnos y respetarnos mientras atravesamos estos cambios?',
      reproductionBlocked: fallback.categoryKey === 'reproduction_locked',
    });
  } catch (error) {
    console.error('Error handling question:', error);
    return res.status(500).json({ error: 'OcurriÃ³ un error al procesar la pregunta.' });
  }
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

