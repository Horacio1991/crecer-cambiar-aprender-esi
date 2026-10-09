import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ExpedienteDosSectionProps {
  reproductionUnlocked: boolean;
  onOpenTeacherModal: () => void;
  codeToken: string; data: any; onUnlocked: (token: string) => void;
}

export const ExpedienteDosSection: React.FC<ExpedienteDosSectionProps> = ({
  reproductionUnlocked,
  onOpenTeacherModal, data, onUnlocked,
}) => {
  const [expandedSection,setExpandedSection]=useState<number|null>(0); const [accessCode,setAccessCode]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  const unlock=async(e:React.FormEvent)=>{e.preventDefault();setLoading(true);setError('');try{const r=await fetch('/api/unlock-expediente2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:accessCode.trim()})});if(!r.ok)throw Error();const d=await r.json();onUnlocked(d.token);setAccessCode('')}catch{setError('El código no es válido o no se pudo comprobar. Consultá a tu docente.')}finally{setLoading(false)}};

  if (!reproductionUnlocked) {
    return (
      <div className="space-y-6">
        {/* Locked Screen */}
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 text-center space-y-6 shadow-md relative overflow-hidden">
          <div className="w-20 h-20 rounded-3xl bg-slate-800/80 border-2 border-slate-700 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-10 h-10" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <span>Etapa 2: Bloqueada por Criterio Pedagógico</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Fredoka'] text-white">
              Expediente 2: ¿Qué ocurre dentro del cuerpo?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed pt-2">
              Esta sección aborda en profundidad la anatomía de los sistemas reproductores, óvulos, espermatozoides, fecundación y desarrollo de una nueva vida.
            </p>
          </div>

          {/* Official pedagogic explanation from the prompt */}
          <div className="max-w-lg mx-auto rounded-2xl bg-slate-800/90 border border-slate-700 p-5 text-xs text-amber-200/90 leading-relaxed font-medium text-left">
            <p className="italic">
              “Esa es una pregunta muy interesante y forma parte de la próxima etapa de nuestra investigación. Primero vamos a comprender mejor los cambios que ocurren durante la pubertad, las emociones y los vínculos. Cuando tu docente habilite el siguiente expediente, podremos investigar qué ocurre dentro del cuerpo.”
            </p>
          </div>

          <form onSubmit={unlock} className="mx-auto flex max-w-md gap-2"><input aria-label="Código del Expediente 2" autoComplete="off" maxLength={64} value={accessCode} onChange={e=>setAccessCode(e.target.value)} placeholder="Código entregado por la docente" className="min-w-0 flex-1 rounded-xl border border-slate-500 bg-slate-800 px-3 py-2 text-sm text-white"/><button disabled={loading||!accessCode.trim()} className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-bold disabled:opacity-50">{loading?'…':'Ingresar'}</button></form>{error&&<p role="alert" className="text-sm text-rose-200">{error}</p>}
        </div>

        {/* Why this stage lock exists */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 text-xs text-amber-950 space-y-2">
          <h4 className="font-bold text-sm flex items-center gap-2 text-amber-900">
            <Info className="w-4 h-4 text-amber-700" />
            <span>Fundamentación Curricular de ESI para 6.º Grado</span>
          </h4>
          <p className="leading-relaxed">
            La Educación Sexual Integral no reduce la sexualidad únicamente a la reproducción biológica. Por diseño pedagógico, la primera etapa se enfoca en comprender que crecer implica transformaciones corporales, emocionales y vinculares cotidianas. La dimensión reproductiva se abre una vez afianzados los conceptos de respeto, consentimiento, privacidad y diversidad corporal.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Unlocked Header Banner */}
      <div className="rounded-3xl bg-linear-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white p-6 sm:p-8 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1">
          <Unlock className="w-4 h-4" />
          <span>Expediente 2 • Habilitado por el Docente</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-['Fredoka']">
          {data?.title}
        </h2>
        <p className="text-sm font-semibold text-purple-200">
          {data?.subtitle}
        </p>
        <p className="text-xs text-slate-200 max-w-2xl leading-relaxed pt-1">
          {data?.statusDescription}
        </p>
      </div>

      {/* Scientific Respect Note */}
      <div className="rounded-2xl bg-indigo-50 border border-indigo-200 p-4 text-xs text-indigo-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Enfoque Científico Escolar:</strong> Los siguientes contenidos utilizan nomenclatura anatómica y biológica rigurosa y respetuosa, adecuada para el diseño curricular de 6.º grado de primaria.
        </div>
      </div>

      {/* 6 Modular Sections Accordion / Cards */}
      <div className="space-y-3.5">
        {(data?.sections||[]).map((sec:any,idx:number)=>{
          const isExpanded = expandedSection === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs transition-all hover:border-indigo-300"
            >
              <button
                onClick={() => setExpandedSection(isExpanded ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 focus:outline-hidden"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center justify-center shrink-0">
                    0{sec.number}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-['Fredoka']">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-1">
                      {sec.description}
                    </p>
                  </div>
                </div>
                <div className="text-slate-400">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/50">
                  <div className="rounded-xl bg-white p-4 border border-slate-200">
                    <p className="font-medium">{sec.description}</p>
                  </div>
                  <div className="rounded-xl bg-indigo-50/70 border border-indigo-200/80 p-4 text-indigo-950 text-xs space-y-1">
                    <span className="font-bold text-[11px] uppercase tracking-wider block text-indigo-800">
                      Profundización conceptual:
                    </span>
                    <p>{sec.detail}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Diagram Summary */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Glosario Conceptual de 6.º Grado</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Gametos</span>
            Células reproductoras que aportan el material hereditario (óvulos y espermatozoides).
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Fecundación</span>
            Unión de un óvulo y un espermatozoide que da inicio a un cigoto.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Gestación (Embarazo)</span>
            Proceso de aproximadamente nueve meses donde el embrión y feto se desarrollan en el útero.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Ciclo Menstrual</span>
            Proceso periódico coordinado por hormonas que prepara al útero cada mes.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Semen</span>
            Líquido que contiene espermatozoides y secreciones nutritivas de las glándulas masculinas.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Proyecto y Cuidado</span>
            La reproducción humana requiere madurez afectiva, consentimiento, autonomía y cuidado.
          </div>
        </div>
      </div>
    </div>
  );
};
