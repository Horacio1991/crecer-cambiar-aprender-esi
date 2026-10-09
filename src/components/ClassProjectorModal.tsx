import React, { useState } from 'react';
import { EverydaySituation } from '../types';
import { Maximize2, Minimize2, MessageSquare, Lightbulb, Users, Check } from 'lucide-react';

interface ClassProjectorModalProps {
  situation: EverydaySituation | null;
  onClose: () => void;
}

export const ClassProjectorModal: React.FC<ClassProjectorModalProps> = ({
  situation,
  onClose,
}) => {
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [revealedConclusion, setRevealedConclusion] = useState(false);

  if (!situation) return null;

  const currentQ = situation.guidingQuestions[activeQuestionIdx];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col p-6 sm:p-10 overflow-y-auto">
      {/* Top Controls */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs uppercase tracking-wider">
            Modo Proyector de Aula • 6.º Grado
          </span>
          <span className="text-slate-400 text-xs hidden sm:inline">
            {situation.tag}
          </span>
        </div>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
        >
          <Minimize2 className="w-4 h-4" />
          <span>Salir de Modo Proyector</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto w-full space-y-8 my-auto">
        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Fredoka'] text-amber-400">
            {situation.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-medium">
            📍 Contexto: {situation.context}
          </p>
        </div>

        {/* Narrative Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-slate-200 text-lg sm:text-xl lg:text-2xl leading-relaxed font-medium">
          "{situation.story}"
        </div>

        {/* Debate Question Navigation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider font-bold">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Pregunta para debate grupal ({activeQuestionIdx + 1} de {situation.guidingQuestions.length})</span>
            </span>
            <div className="flex gap-2">
              {situation.guidingQuestions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveQuestionIdx(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    activeQuestionIdx === i
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-amber-500/10 border-2 border-amber-400/40 text-amber-200 text-xl sm:text-2xl lg:text-3xl font-bold font-['Fredoka'] leading-relaxed">
            {currentQ.question}
          </div>
          <p className="text-sm text-slate-400 italic">
            💡 Pista para el debate: {currentQ.hint}
          </p>
        </div>

        {/* Conclusion Toggle */}
        <div className="pt-4">
          {!revealedConclusion ? (
            <button
              onClick={() => setRevealedConclusion(true)}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base transition-colors inline-flex items-center gap-2"
            >
              <Lightbulb className="w-5 h-5" />
              <span>Mostrar Conclusión y Aprendizaje del Aula</span>
            </button>
          ) : (
            <div className="p-6 rounded-3xl bg-emerald-500/15 border-2 border-emerald-400/50 text-emerald-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                Acuerdo de Convivencia ESI:
              </span>
              <p className="text-lg sm:text-xl font-bold font-['Fredoka'] leading-relaxed">
                {situation.keyTakeaway}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
