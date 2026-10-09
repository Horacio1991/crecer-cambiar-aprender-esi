import React, { useState } from 'react';
import { EVERYDAY_SITUATIONS } from '../data/curriculumData';
import { EverydaySituation } from '../types';
import {
  Users,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Maximize2
} from 'lucide-react';

interface SituationsExplorerProps {
  onSelectForProjector?: (situation: EverydaySituation) => void;
  onSubmitActivity?: (activity: string, response: unknown) => Promise<void>;
}

export const SituationsExplorer: React.FC<SituationsExplorerProps> = ({
  onSelectForProjector,
  onSubmitActivity,
}) => {
  const [selectedSituationId, setSelectedSituationId] = useState(EVERYDAY_SITUATIONS[0].id);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIndex: number]: number }>({});
  const [showTakeaway, setShowTakeaway] = useState(false);

  const activeSituation =
    EVERYDAY_SITUATIONS.find((sit) => sit.id === selectedSituationId) || EVERYDAY_SITUATIONS[0];

  const handleSelectSituation = (id: string) => {
    setSelectedSituationId(id);
    setSelectedAnswers({});
    setShowTakeaway(false);
  };

  const handleSelectAnswer = (qIndex: number, aIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIndex]: aIndex,
    }));
    const q=activeSituation.guidingQuestions[qIndex]; void onSubmitActivity?.(`Situación: ${activeSituation.title}`,{pregunta:q.question,respuesta:q.possibleAnswers[aIndex].text});
  };

  return (
    <div className="space-y-6">
      {/* Introduction banner */}
      <div className="rounded-3xl bg-linear-to-r from-sky-500 to-indigo-500 text-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-100 mb-1">
          <Users className="w-4 h-4" />
          <span>Casos de la Vida Escolar • 6.º Grado</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-['Fredoka']">
          Situaciones Cotidianas para Reflexionar
        </h2>
        <p className="text-xs sm:text-sm text-sky-50 mt-1 max-w-2xl leading-relaxed">
          Sofía y Mateo atraviesan dilemas reales con amigos, el cuerpo y las emociones. Acompañalos a desarmar malentendidos, poner límites con respeto y cuidar la convivencia.
        </p>
      </div>

      {/* Situation Picker Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {EVERYDAY_SITUATIONS.map((sit, idx) => {
          const isCurrent = sit.id === selectedSituationId;
          return (
            <button
              key={sit.id}
              onClick={() => handleSelectSituation(sit.id)}
              className={`p-4 rounded-2xl text-left border transition-all ${
                isCurrent
                  ? 'bg-white border-sky-400 shadow-md ring-2 ring-sky-200'
                  : 'bg-white/70 border-slate-200 hover:bg-white hover:border-sky-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-bold">Caso 0{idx + 1}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-700">
                  {sit.tag}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                {sit.title}
              </h3>
              <div className="mt-2 text-xs font-medium text-sky-800 flex items-center gap-1">
                <span>{sit.protagonist === 'sofia' ? '👧 Sofía' : sit.protagonist === 'mateo' ? '👦 Mateo' : '🤝 En grupo'}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Situation Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Story header */}
        <div className="border-b border-slate-100 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-100 text-sky-900">
              {activeSituation.tag}
            </span>
            {onSelectForProjector && (
              <button
                onClick={() => onSelectForProjector(activeSituation)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                title="Proyectar esta situación a pantalla completa para debatir en el aula"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Proyectar en el Aula</span>
              </button>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-['Fredoka'] text-slate-900">
            {activeSituation.title}
          </h3>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            📍 Contexto: {activeSituation.context}
          </p>

          <div className="mt-4 rounded-2xl bg-amber-50/70 border border-amber-200 p-4 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            <p>{activeSituation.story}</p>
          </div>
        </div>

        {/* Guiding Questions */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-sky-600" />
            <span>Preguntas Guiadas de Investigación</span>
          </h4>

          {activeSituation.guidingQuestions.map((q, qIndex) => {
            const chosenAnswerIndex = selectedAnswers[qIndex];
            const hasChosen = chosenAnswerIndex !== undefined;

            return (
              <div
                key={qIndex}
                className="rounded-2xl border border-slate-200 p-5 bg-slate-50/40 space-y-3"
              >
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {qIndex + 1}
                  </span>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">
                      {q.question}
                    </h5>
                    <p className="text-xs text-slate-500 mt-0.5 italic">
                      💡 Pista: {q.hint}
                    </p>
                  </div>
                </div>

                {/* Possible answers */}
                <div className="space-y-2 pt-1 pl-8">
                  {q.possibleAnswers.map((ans, aIndex) => {
                    const isSelected = chosenAnswerIndex === aIndex;
                    return (
                      <div key={aIndex} className="space-y-2">
                        <button
                          onClick={() => handleSelectAnswer(qIndex, aIndex)}
                          className={`w-full text-left p-3 rounded-xl text-xs font-medium transition-all border ${
                            isSelected
                              ? ans.isConstructive
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-200'
                                : 'bg-rose-50 border-rose-300 text-rose-950 ring-2 ring-rose-200'
                              : 'bg-white border-slate-200 hover:border-sky-300 text-slate-700'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="font-bold shrink-0">
                              {String.fromCharCode(65 + aIndex)}.
                            </span>
                            <span>{ans.text}</span>
                          </div>
                        </button>

                        {/* Immediate pedagogical feedback */}
                        {isSelected && (
                          <div
                            className={`p-3 rounded-xl text-xs leading-relaxed flex items-start gap-2 ${
                              ans.isConstructive
                                ? 'bg-emerald-100/70 border border-emerald-200 text-emerald-950 font-medium'
                                : 'bg-amber-100/70 border border-amber-200 text-amber-950 font-medium'
                            }`}
                          >
                            {ans.isConstructive ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <p>{ans.reflection}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Key Takeaway / Conclusión pedagógica */}
        <div className="pt-2">
          {!showTakeaway ? (
            <button
              onClick={() => setShowTakeaway(true)}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Ver la Conclusión y Aprendizaje del Caso</span>
            </button>
          ) : (
            <div className="rounded-2xl bg-amber-100/80 border-2 border-amber-300 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Aprendizaje Central de Sofía y Mateo</span>
              </div>
              <p className="text-sm font-bold text-slate-900 leading-relaxed font-['Fredoka']">
                {activeSituation.keyTakeaway}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
