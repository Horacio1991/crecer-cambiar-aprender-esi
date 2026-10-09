import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CharacterBanner } from './components/CharacterBanner';
import { LevelViewer } from './components/LevelViewer';
import { SituationsExplorer } from './components/SituationsExplorer';
import { ChangeDetectiveQuiz } from './components/ChangeDetectiveQuiz';
import { QuestionMailbox } from './components/QuestionMailbox';
import { ExpedienteDosSection } from './components/ExpedienteDosSection';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ClassProjectorModal } from './components/ClassProjectorModal';
import { StudentQuery, EverydaySituation } from './types';
import { registerStudentIdentity, saveStudentActivity, saveAnonymousQuestion, StudentIdentity, isInstitutionalEmail, studentIdFromEmail } from './lib/supabase';
import { EVERYDAY_SITUATIONS, CORE_MESSAGE } from './data/curriculumData';
import {
  Sparkles,
  BookOpen,
  Search,
  Users,
  HelpCircle,
  Lock,
  Unlock,
  ShieldCheck,
  Heart,
  Compass,
  ArrowRight,
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('inicio');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [student,setStudent]=useState<StudentIdentity|null>(()=>{try{const saved=JSON.parse(localStorage.getItem('cca_student')||'null');if(saved?.email&&isInstitutionalEmail(saved.email))return saved;localStorage.removeItem('cca_student');return null}catch{return null}});
  const [studentForm,setStudentForm]=useState({email:''}); const [saveNotice,setSaveNotice]=useState('');
  const [exp2Token,setExp2Token]=useState(()=>sessionStorage.getItem('cca_exp2_token')||''); const [exp2Data,setExp2Data]=useState<any>(null);

  const reproductionUnlocked=Boolean(exp2Token&&exp2Data); const [studentQueries,setStudentQueries]=useState<StudentQuery[]>([]);

  // Modals state
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [projectorSituation, setProjectorSituation] = useState<EverydaySituation | null>(null);

  useEffect(()=>{if(!exp2Token){setExp2Data(null);return;}fetch('/api/expediente2',{headers:{Authorization:`Bearer ${exp2Token}`}}).then(async r=>{if(!r.ok)throw new Error();return r.json()}).then(setExp2Data).catch(()=>{sessionStorage.removeItem('cca_exp2_token');setExp2Token('');setExp2Data(null)})},[exp2Token]);
  const registerStudent=async(e:React.FormEvent)=>{e.preventDefault();const email=studentForm.email.trim().toLowerCase();if(!isInstitutionalEmail(email)){setSaveNotice('Usá tu correo institucional @grilli.edu.ar');return;}setSaveNotice('Preparando tu cuaderno…');try{const id=await studentIdFromEmail(email);const next:StudentIdentity={id,email};await registerStudentIdentity(next);localStorage.setItem('cca_student',JSON.stringify(next));setStudent(next);setSaveNotice('')}catch{setSaveNotice('No se pudo conectar con la aplicación. Avisale a tu docente.')}};
  const submitActivity=async(activity:string,response:unknown)=>{if(!student)return;setSaveNotice('Guardando respuesta…');try{await saveStudentActivity(student,activity,response);setSaveNotice('Respuesta enviada a la docente.')}catch(err){console.error(err);setSaveNotice('No se pudo enviar. Revisá la conexión e intentá nuevamente.')}};
  const submitAnonymous=async(question:string,category:string,answer:string)=>{try{await saveAnonymousQuestion(question,category,answer)}catch(err){console.error(err);setSaveNotice('No se pudo guardar la pregunta anónima.')}};

  const handleQueryAnswered = (newQuery: StudentQuery) => {
    setStudentQueries((prev) => [newQuery, ...prev]);
  };

  const handleClearQueries = () => {
    setStudentQueries([]);

  };

  const handleResetInvestigation = () => {

    setStudentQueries([]);


    setCurrentTab('inicio');
  };

  return (
    <div
      className={`min-h-screen bg-amber-50/30 text-slate-800 font-['Plus_Jakarta_Sans'] flex flex-col ${
        fontSize === 'large' ? 'text-base sm:text-lg' : 'text-sm'
      }`}
    >
      {/* Navigation Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        reproductionUnlocked={reproductionUnlocked}
        onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onOpenProjector={() => setProjectorSituation(EVERYDAY_SITUATIONS[0])}
      />

      {student&&<div className="mx-auto mt-3 flex w-full max-w-7xl items-center justify-between px-4 text-xs text-slate-600"><span>Alumno: <strong>{student.email}</strong>{saveNotice&&<span className="ml-3" role="status">{saveNotice}</span>}</span><button className="font-bold text-indigo-700 underline" onClick={()=>{localStorage.removeItem('cca_student');sessionStorage.removeItem('cca_exp2_token');setExp2Token('');setExp2Data(null);setStudentQueries([]);setStudent(null);setStudentForm({email:''})}}>Cambiar alumno</button></div>}
      {!student?<main className="flex-1 w-full max-w-xl mx-auto px-4 py-10"><form onSubmit={registerStudent} className="rounded-3xl border bg-white p-7 shadow space-y-4"><div className="text-4xl">🌱</div><h1 className="text-2xl font-bold">¿Quién va a investigar hoy?</h1><p className="text-sm text-slate-600">Ingresá con tu correo institucional para comenzar. No necesitás contraseña.</p><label className="block text-sm font-semibold">Correo institucional<input type="email" required maxLength={120} autoComplete="email" placeholder="nombre.apellido@grilli.edu.ar" value={studentForm.email} onChange={e=>setStudentForm({email:e.target.value})} className="mt-1 w-full rounded-xl border p-3"/></label>{saveNotice&&<p className="text-amber-800 text-xs">{saveNotice}</p>}<button className="w-full rounded-xl bg-indigo-700 p-3 font-bold text-white">Comenzar</button><button type="button" onClick={() => setIsTeacherModalOpen(true)} className="w-full rounded-xl border border-indigo-200 bg-white p-3 font-bold text-indigo-800 hover:bg-indigo-50">🔐 Acceso docente</button></form><TeacherDashboard isOpen={isTeacherModalOpen} onClose={() => setIsTeacherModalOpen(false)} reproductionUnlocked={reproductionUnlocked} onToggleReproduction={() => {}} studentQueries={studentQueries} onClearQueries={handleClearQueries} onLaunchProjector={(s) => { setIsTeacherModalOpen(false); setProjectorSituation(s); }} onResetInvestigation={handleResetInvestigation} /></main>:<>
      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* TAB 1: INICIO / CUADERNO DE INVESTIGACIÓN */}
        {currentTab === 'inicio' && (
          <div className="space-y-8">
            <CharacterBanner
              onExploreLevels={() => setCurrentTab('niveles')}
              onExploreDetective={() => setCurrentTab('detective')}
            />

            {/* Educational Core: Differentiation of the 3 Changes */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
                  Fundamento Pedagógico ESI
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-['Fredoka'] text-slate-900">
                  Diferenciar los Tres Tipos de Cambios
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  Crecer transforma nuestra vida en tres dimensiones interconectadas. Pueden relacionarse entre sí, pero <strong>no son lo mismo</strong>:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Físicos */}
                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow-xs">
                    01
                  </div>
                  <h4 className="text-base font-bold font-['Fredoka'] text-amber-950">
                    Cambios Físicos
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Son modificaciones observables en el cuerpo biológico: estirón de estatura, vello corporal, cambios en el tono de la voz, piel y glándulas sudoríparas, desarrollo de mamas, genitales, menstruación y primeras eyaculaciones.
                  </p>
                  <div className="text-[11px] font-semibold text-amber-800 pt-1">
                    🌱 Recordá: Cada cuerpo tiene su propio calendario.
                  </div>
                </div>

                {/* 2. Emocionales */}
                <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5 space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    02
                  </div>
                  <h4 className="text-base font-bold font-['Fredoka'] text-rose-950">
                    Cambios Emocionales
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Se relacionan con lo que sentimos en nuestro interior: emociones más intensas, cambios en el estado de ánimo, necesidad de privacidad y espacio propio, autoestima, dudas e inseguridades.
                  </p>
                  <div className="text-[11px] font-semibold text-rose-800 pt-1">
                    ❤️ Recordá: Sentir con intensidad no es ser irracional.
                  </div>
                </div>

                {/* 3. Vinculares */}
                <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-5 space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    03
                  </div>
                  <h4 className="text-base font-bold font-['Fredoka'] text-sky-950">
                    Cambios Vinculares
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Se relacionan con nuestras relaciones con amigos, compañeros y familia: deseo de pertenecer a grupos, desacuerdos cotidianos, aprender a poner límites y a decir "NO", pedir disculpas y resolver conflictos dialogando.
                  </p>
                  <div className="text-[11px] font-semibold text-sky-800 pt-1">
                    🤝 Recordá: El desacuerdo se conversa con respeto.
                  </div>
                </div>
              </div>
            </div>

            {/* Module Explorer Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => setCurrentTab('niveles')}
                className="p-5 rounded-3xl bg-white border border-slate-200 text-left hover:border-emerald-300 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold font-['Fredoka'] text-slate-900 mb-1">
                  Los 5 Niveles
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">
                  Del significado de crecer a las hormonas, el cuerpo y las amistades.
                </p>
                <div className="mt-3 text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <span>Abrir módulos</span>
                  <span>→</span>
                </div>
              </button>

              <button
                onClick={() => setCurrentTab('situaciones')}
                className="p-5 rounded-3xl bg-white border border-slate-200 text-left hover:border-sky-300 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold font-['Fredoka'] text-slate-900 mb-1">
                  Situaciones del Aula
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">
                  Casos de la vida real escolar de Sofía y Mateo con preguntas de reflexión.
                </p>
                <div className="mt-3 text-xs font-bold text-sky-700 flex items-center gap-1">
                  <span>Ver historias</span>
                  <span>→</span>
                </div>
              </button>

              <button
                onClick={() => setCurrentTab('detective')}
                className="p-5 rounded-3xl bg-white border border-slate-200 text-left hover:border-purple-300 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Search className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold font-['Fredoka'] text-slate-900 mb-1">
                  Detective de Cambios
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">
                  Actividad interactiva para clasificar hechos en Físicos, Emocionales o Vinculares.
                </p>
                <div className="mt-3 text-xs font-bold text-purple-700 flex items-center gap-1">
                  <span>Comenzar juego</span>
                  <span>→</span>
                </div>
              </button>

              <button
                onClick={() => setCurrentTab('buzon')}
                className="p-5 rounded-3xl bg-white border border-slate-200 text-left hover:border-rose-300 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold font-['Fredoka'] text-slate-900 mb-1">
                  Buzón de Dudas
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">
                  Hacé tus preguntas con seguridad y recibí orientación científica y cálida.
                </p>
                <div className="mt-3 text-xs font-bold text-rose-700 flex items-center gap-1">
                  <span>Hacer pregunta</span>
                  <span>→</span>
                </div>
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: LOS 5 NIVELES DE CRECER */}
        {currentTab === 'niveles' && <LevelViewer onSubmitActivity={submitActivity} />}

        {/* TAB 3: SITUACIONES DEL AULA */}
        {currentTab === 'situaciones' && (
          <SituationsExplorer
            onSelectForProjector={(sit) => setProjectorSituation(sit)}
            onSubmitActivity={submitActivity}
          />
        )}

        {/* TAB 4: DETECTIVE DE CAMBIOS */}
        {currentTab === 'detective' && <ChangeDetectiveQuiz onSubmitActivity={submitActivity} />}

        {/* TAB 5: BUZÓN DE PREGUNTAS */}
        {currentTab === 'buzon' && (
          <QuestionMailbox
            reproductionUnlocked={reproductionUnlocked}
            onQueryAnswered={handleQueryAnswered}
            recentQueries={studentQueries}
            onSubmitAnonymous={submitAnonymous}
            accessToken={exp2Token}
          />
        )}

        {/* TAB 6: EXPEDIENTE 2 */}
        {currentTab === 'expediente2' && (
          <ExpedienteDosSection
            reproductionUnlocked={reproductionUnlocked}
            onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
            codeToken={exp2Token} data={exp2Data}
            onUnlocked={(token) => { sessionStorage.setItem('cca_exp2_token',token); setExp2Token(token); }}
          />
        )}
      </main>

      {/* Classroom Projector Modal */}
      <ClassProjectorModal
        situation={projectorSituation}
        onClose={() => setProjectorSituation(null)}
      />

      {/* Teacher Dashboard Modal */}
      <TeacherDashboard
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        reproductionUnlocked={reproductionUnlocked}
        onToggleReproduction={() => {}}
        studentQueries={studentQueries}
        onClearQueries={handleClearQueries}
        onLaunchProjector={(sit) => {
          setIsTeacherModalOpen(false);
          setProjectorSituation(sit);
        }}
        onResetInvestigation={handleResetInvestigation}
      />

      {/* Simple Accessible Footer */}
      <footer className="border-t border-amber-200/60 bg-white/60 py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-bold text-slate-700">
              Crecer, Cambiar y Aprender — Educación Sexual Integral (ESI)
            </p>
            <p className="text-[11px] text-slate-400">
              Desarrollado para 6.º año de Nivel Primario (11-12 años) • Perspectiva de derechos, cuidado y respeto.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <button
              onClick={() => setIsTeacherModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Acceso Docente
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setProjectorSituation(EVERYDAY_SITUATIONS[0]);
              }}
              className="text-amber-800 hover:text-amber-950 font-semibold"
            >
              Modo Proyector
            </button>

          </div>
        </div>
      </footer>
      </>}
    </div>
  );
}
