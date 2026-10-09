import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
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
app.post('/api/teacher/expediente2-code',async(req,res)=>{try{const token=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');if(!supabaseAdmin||!supabaseAuth)return res.status(503).json({error:'Configuración incompleta.'});const {data,error}=await supabaseAuth.auth.getUser(token);if(error||data.user?.app_metadata?.role!=='docente')return res.status(403).json({error:'Acceso docente requerido.'});const enabled=req.body?.enabled!==false;const code=typeof req.body?.code==='string'?req.body.code.trim():'';if(enabled&&(code.length<8||code.length>32||!/^[A-Z0-9-]+$/i.test(code)))return res.status(400).json({error:'Código no válido.'});const {error:dbError}=await supabaseAdmin.from('app_settings').upsert({key:'expediente2_code_hash',value:enabled?codeHash(code):''},{onConflict:'key'});if(dbError)return res.status(500).json({error:'No se pudo actualizar el acceso.'});return res.json({enabled});}catch{return res.status(500).json({error:'No se pudo actualizar el acceso.'})}});
app.post('/api/unlock-expediente2',async(req,res)=>{const code=typeof req.body?.code==='string'?req.body.code.trim():'';const key=req.ip||'unknown',now=Date.now(),state=tries.get(key);if(state&&now-state.t<600000&&state.n>=10)return res.status(429).json({error:'Intenta más tarde.'});if(!state||now-state.t>=600000)tries.set(key,{n:1,t:now});else state.n++;if(!grantSecret)return res.status(503).json({error:'Acceso no configurado.'});if(code.length>64)return res.status(401).json({error:'Código no válido.'});let expected='';if(supabaseAdmin){const {data}=await supabaseAdmin.from('app_settings').select('value').eq('key','expediente2_code_hash').maybeSingle();expected=typeof data?.value==='string'?data.value:'';}else if(process.env.EXPEDIENTE2_CODE){expected=codeHash(process.env.EXPEDIENTE2_CODE.trim());}else{return res.status(503).json({error:'Acceso no configurado.'})}const actual=codeHash(code);const a=Buffer.from(actual),b=Buffer.from(expected||'0'.repeat(64));if(!expected||a.length!==b.length||!crypto.timingSafeEqual(a,b))return res.status(401).json({error:'Código no válido.'});tries.delete(key);return res.json({token:makeGrant()})});
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
  const safetyKeywords = ['abuso', 'violencia', 'golpe', 'tocar sin permiso', 'obligar', 'acoso', 'miedo en casa', 'secreto malo'];
  if (safetyKeywords.some((kw) => qLower.includes(kw))) {
    return {
      category: 'H. Tema que requiere intervención adulta',
      categoryKey: 'safety',
      answer: 'Tu seguridad y tus derechos son lo más importante. Nadie tiene derecho a hacerte daño, hacerte sentir incómodo/a ni guardar secretos que te hagan sentir mal. Por favor, hablalo de inmediato con una persona adulta de confianza (en tu familia, tu escuela, docentes o directivos) o comunicate con las líneas de ayuda para niñas, niños y adolescentes.',
      companion: 'Sofía y Mateo recuerdan: siempre tenés derecho a decir NO y a pedir ayuda.'
    };
  }

  // Personal anxiety / diagnostic question
  if (
    qLower.includes('es normal que a mí') ||
    qLower.includes('es normal que me pase') ||
    qLower.includes('tengo un problema') ||
    qLower.includes('por qué a mí no') ||
    qLower.includes('me duele') ||
    qLower.includes('estoy enfermo')
  ) {
    return {
      category: 'E. Cuidado y respeto',
      categoryKey: 'personal',
      answer: 'Los cambios de la pubertad pueden aparecer en diferentes momentos y de distintas maneras. Cada cuerpo tiene su propio ritmo y no hay un único modelo "correcto". Si algo te genera dolor, molestia o preocupación persistente, es muy importante que lo converses con una persona adulta de confianza de tu familia o con un profesional de la salud.',
      companion: 'Sofía dice: "A mí también me pasaba dudar si lo mío era normal. ¡Cada persona va a su propio tiempo!"'
    };
  }

  // Reproduction keywords
  const reproKeywords = ['fecundación', 'óvulo', 'espermatozoide', 'embarazo', 'útero', 'trompas de falopio', 'relación sexual', 'sexo', 'genitales internos', 'bebé', 'engendrar', 'fecundar', 'parto', 'óvulos'];
  const hasRepro = reproKeywords.some((kw) => qLower.includes(kw));

  if (hasRepro) {
    if (!reproductionUnlocked) {
      return {
        category: 'F. Reproducción bloqueada',
        categoryKey: 'reproduction_locked',
        answer: 'Esa es una pregunta muy interesante y forma parte de la próxima etapa de nuestra investigación. Primero vamos a comprender mejor los cambios que ocurren durante la pubertad, las emociones y los vínculos. Cuando tu docente habilite el siguiente expediente, podremos investigar qué ocurre dentro del cuerpo.',
        companion: 'Mateo dice: "¡Genial pregunta! Está reservada para el Expediente 2 cuando la o el profe abra esa parte."'
      };
    } else {
      return {
        category: 'G. Reproducción habilitada',
        categoryKey: 'reproduction_unlocked',
        answer: 'En el Expediente 2 investigamos cómo los sistemas reproductores femenino y masculino maduran durante la pubertad gracias a las hormonas. Los ovarios y los testículos producen células especializadas (óvulos y espermatozoides). En la reproducción humana, cuando se unen en la fecundación, dan origen al desarrollo de una nueva vida.',
        companion: 'Sofía y Mateo: "La reproducción es un proceso biológico que estudiamos con respeto y lenguaje científico."'
      };
    }
  }

  // Hormonal changes
  if (qLower.includes('hormona') || qLower.includes('sustancia') || qLower.includes('testosterona') || qLower.includes('estrógeno')) {
    return {
      category: 'B. Cambio físico',
      categoryKey: 'hormonal',
      answer: 'Las hormonas son sustancias químicas naturales que funcionan como mensajeras dentro del organismo. Durante la pubertad, determinadas glándulas envían señales a diferentes órganos para activar el crecimiento, los cambios en la voz, en la piel y la maduración biológica.',
      companion: 'Mateo dice: "¡Son como cartas con instrucciones que viajan por la sangre para que el cuerpo empiece a transformarse!"'
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
    qLower.includes('acné') ||
    qLower.includes('olor') ||
    qLower.includes('transpir') ||
    qLower.includes('menstruac') ||
    qLower.includes('regla') ||
    qLower.includes('eyaculac') ||
    qLower.includes('polución')
  ) {
    return {
      category: 'B. Cambio físico',
      categoryKey: 'physical',
      answer: 'Los cambios físicos son modificaciones observables en el cuerpo durante la pubertad: el estirón de estatura, la aparición de vello en diferentes zonas, cambios en la piel y el sudor, variaciones en el tono de voz, desarrollo de las mamas o cambios en los genitales (como la menstruación o las primeras eyaculaciones). No todas las personas viven estos cambios al mismo tiempo ni en el mismo orden.',
      companion: 'Sofía dice: "Cada cuerpo tiene su propio calendario biológico; no hay que apurarse ni compararse."'
    };
  }

  // Emotional changes
  if (
    qLower.includes('emoci') ||
    qLower.includes('enojo') ||
    qLower.includes('llorar') ||
    qLower.includes('triste') ||
    qLower.includes('ánimo') ||
    qLower.includes('humor') ||
    qLower.includes('vergüenza') ||
    qLower.includes('insegur') ||
    qLower.includes('autoestima') ||
    qLower.includes('privacidad') ||
    qLower.includes('solo') ||
    qLower.includes('sola')
  ) {
    return {
      category: 'C. Cambio emocional',
      categoryKey: 'emotional',
      answer: 'Durante la pubertad es muy habitual sentir emociones más intensas o experimentar cambios rápidos de estado de ánimo. También surge una mayor necesidad de privacidad y momentos a solas para pensar. Esto no significa que una persona sea irracional; es parte natural de descubrir quiénes somos y cómo nos sentimos.',
      companion: 'Mateo dice: "A veces siento que algo pequeño me molesta más de lo común. Aprender a respirar y poner palabras ayuda mucho."'
    };
  }

  // Relational changes
  if (
    qLower.includes('amig') ||
    qLower.includes('grupo') ||
    qLower.includes('discut') ||
    qLower.includes('pelea') ||
    qLower.includes('límite') ||
    qLower.includes('exclui') ||
    qLower.includes('familia') ||
    qLower.includes('papás') ||
    qLower.includes('mamá') ||
    qLower.includes('disculpa') ||
    qLower.includes('pertenecer')
  ) {
    return {
      category: 'D. Cambio vincular',
      categoryKey: 'relational',
      answer: 'Los cambios vinculares tienen que ver con cómo nos relacionamos con los demás: con amigos, compañeros y la familia. En 6.º grado los grupos de amigos cobran mucho valor, y pueden surgir desacuerdos. Lo importante es aprender a expresar lo que sentimos con respeto, escuchar al otro, poner límites claros y buscar soluciones mediante el diálogo.',
      companion: 'Sofía dice: "Tener desacuerdos es normal; la clave es saber escuchar y nunca usar burlas ni maltratos."'
    };
  }

  // General puberty
  return {
    category: 'A. Pubertad',
    categoryKey: 'general_puberty',
    answer: 'La pubertad es una etapa de transición entre la niñez y la adolescencia en la que ocurren transformaciones físicas, hormonales, emocionales y en nuestras relaciones. Lo más enriquecedor es recordar que crecer no es una carrera: cada persona tiene su propio ritmo y todos los cuerpos son valiosos y merecen respeto.',
    companion: 'Sofía y Mateo: "¡Investigar juntos nos ayuda a derribar mitos y a tratarnos con empatía!"'
  };
}

// API endpoint for answering student questions
app.post('/api/ask-question', async (req, res) => {
  try {
    const { question } = req.body;
    const reproductionUnlocked = validGrant((req.headers.authorization || '').replace(/^Bearer\s+/i, ''));

    if (!question || typeof question !== 'string' || question.trim().length === 0 || question.length > 1200) {
      return res.status(400).json({ error: 'La pregunta no puede estar vacía.' });
    }

    const cleanQuestion = question.trim();

    // Check if reproduction lock applies explicitly first
    const reproWords = ['fecundación', 'óvulo', 'espermatozoide', 'embarazo', 'útero', 'trompas de falopio', 'relación sexual', 'sexo', 'genitales internos', 'fecundar', 'parto'];
    const isReproQuery = reproWords.some((w) => cleanQuestion.toLowerCase().includes(w));

    if (isReproQuery && !reproductionUnlocked) {
      return res.json({
        category: 'F. Reproducción bloqueada',
        answer: 'Esa es una pregunta muy interesante y forma parte de la próxima etapa de nuestra investigación. Primero vamos a comprender mejor los cambios que ocurren durante la pubertad, las emociones y los vínculos. Cuando tu docente habilite el siguiente expediente, podremos investigar qué ocurre dentro del cuerpo.',
        companionQuote: 'Mateo: "¡Gran duda! Esta pregunta pertenece al Expediente 2. Cuando el/la docente lo habilite, investigaremos qué ocurre dentro del cuerpo."',
        reproductionBlocked: true,
      });
    }

    // If Gemini is available, call it with strict pedagogical system instruction
    if (ai && process.env.GEMINI_API_KEY) {
      try {
        const systemInstruction = `
Sos el motor pedagógico de la aplicación escolar "Crecer, Cambiar y Aprender" para estudiantes de 6.º grado de Educación Primaria (11-12 años), bajo los lineamientos de la Educación Sexual Integral (ESI).
Personajes que acompañan la app: Sofía (11 años, sensible, reflexiva) y Mateo (12 años, curioso, sociable). Sofía y Mateo NO son profesores, son compañeros de 6.º grado que también están aprendiendo.

OBJETIVO:
Responder a las dudas de las y los estudiantes con:
- Lenguaje científico, claro, respetuoso, cálido y adecuado para 11 y 12 años.
- Cero infantilización, cero moralina, cero generar miedo o vergüenza.
- Diferenciar cambios FÍSICOS, EMOCIONALES y VINCULARES.
- Diversidad: Enfatizar que no todos los cuerpos crecen al mismo tiempo ni de la misma manera; no hay un "cuerpo normal" único. Evitar estereotipos ("los varones hacen...", "las mujeres sienten..."). Usar "algunas personas...", "en muchas personas...".
- Si preguntan "¿Es normal que me pase esto?" o dudan de su cuerpo: NO diagnosticar enfermedades ni tratamientos. Responder con calidez que los ritmos son variados y que si algo duele o preocupa, es fundamental hablar con una persona adulta de confianza o profesional de salud.
- SEGURIDAD ESTRICTA: No solicitar fotos, descripciones íntimas, ni datos personales. Si hay indicios de acoso, violencia o maltrato, indicar con calidez acudir inmediatamente a un adulto de confianza o docentes.
- ESTADO DEL BLOQUE DE REPRODUCCIÓN: ${reproductionUnlocked ? 'ETAPA 2 HABILITADA (Se puede explicar con lenguaje científico y respetuoso anatomía reproductiva, óvulo, espermatozoide, fecundación).' : 'ETAPA 2 BLOQUEADA (NO dar explicaciones biológicas de órganos internos, fecundación o embarazo).'}
Si el estudiante pregunta por reproducción biológica detallada y la etapa 2 está BLOQUEADA, DEBES responder textualmente o parafraseando la respuesta obligatoria:
"Esa es una pregunta muy interesante y forma parte de la próxima etapa de nuestra investigación. Primero vamos a comprender mejor los cambios que ocurren durante la pubertad, las emociones y los vínculos. Cuando tu docente habilite el siguiente expediente, podremos investigar qué ocurre dentro del cuerpo."

FORMATO DE RESPUESTA:
Debes responder en formato JSON estrictamente válido con los campos:
{
  "category": "Una de: A. Pubertad | B. Cambio físico | C. Cambio emocional | D. Cambio vincular | E. Cuidado y respeto | F. Reproducción bloqueada | G. Reproducción habilitada | H. Tema que requiere intervención adulta",
  "answer": "Respuesta clara, breve y pedagógica de 2 a 4 oraciones apta para 6.º grado.",
  "companionQuote": "Una frase breve de Sofía o Mateo (especificando quién la dice) reflexionando como compañera/o de 6.º grado.",
  "reflectionQuestion": "Una pregunta breve para invitar a la reflexión (ej: '¿Pensás que esto involucra emociones, vínculos o el cuerpo?')"
}
`;

        const geminiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: cleanQuestion,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        });

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
        console.warn('Gemini request failed, falling back to local expert classifier:', geminiError);
      }
    }

    // Fallback response using local expert classifier
    const fallback = classifyLocally(cleanQuestion, reproductionUnlocked);
    return res.json({
      category: fallback.category,
      answer: fallback.answer,
      companionQuote: fallback.companion,
      reflectionQuestion: '¿De qué manera creés que podemos cuidarnos y respetarnos mientras atravesamos estos cambios?',
      reproductionBlocked: fallback.categoryKey === 'reproduction_locked',
    });
  } catch (error) {
    console.error('Error handling question:', error);
    return res.status(500).json({ error: 'Ocurrió un error al procesar la pregunta.' });
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
