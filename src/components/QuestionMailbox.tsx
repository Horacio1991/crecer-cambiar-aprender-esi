import React, { useState } from 'react';
import { StudentQuery } from '../types';
import {
  HelpCircle,
  Send,
  Loader2,
  Sparkles,
  Lock,
  MessageCircle,
  ShieldCheck,
  Tag,
  Lightbulb,
  Clock,
  History
} from 'lucide-react';

interface QuestionMailboxProps {
  reproductionUnlocked: boolean;
  onQueryAnswered?: (query: StudentQuery) => void;
  recentQueries: StudentQuery[];
  onSubmitAnonymous?: (question:string,category:string,answer:string)=>Promise<void>;
  accessToken?: string;
}

export const QuestionMailbox: React.FC<QuestionMailboxProps> = ({
  reproductionUnlocked,
  onQueryAnswered,
  recentQueries, onSubmitAnonymous, accessToken,
}) => {
  const [questionText, setQuestionText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<StudentQuery | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleQuestions = [
    { text: '¿Por qué algunas personas pegan el estirón antes que otras?', label: 'Ritmos de crecimiento' },
    { text: '¿Es normal que a veces me sienta súper enojado por cosas sin importancia?', label: 'Emociones intensas' },
    { text: '¿Qué son exactamente las hormonas y qué hacen en el cuerpo?', label: 'Mensajeras hormonales' },
    { text: '¿Cómo hago para decirle a un amigo que no me gusta una broma sin pelear?', label: 'Poner límites con respeto' },
    { text: '¿Cómo ocurre la fecundación entre un óvulo y un espermatozoide?', label: 'Biología reproductiva' },
  ];

  const handleSubmit = async (qText: string) => {
    if (!qText.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ask-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
        body: JSON.stringify({
          question: qText.trim(),
          reproductionUnlocked,
        }),
      });

      if (!res.ok) {
        throw new Error('No se pudo procesar la pregunta.');
      }

      const data = await res.json();
      const newQuery: StudentQuery = {
        id: 'q-' + Date.now(),
        timestamp: Date.now(),
        question: qText.trim(),
        category: data.category || 'A. Pubertad',
        answer: data.answer,
        companionQuote: data.companionQuote,
        reflectionQuestion: data.reflectionQuestion,
        reproductionBlocked: data.reproductionBlocked,
      };

      setCurrentResponse(newQuery); await onSubmitAnonymous?.(newQuery.question,newQuery.category,newQuery.answer);
      if (onQueryAnswered) {
        onQueryAnswered(newQuery);
      }
      setQuestionText('');
    } catch (err: any) {
      console.error(err);
      setErrorMsg('No pudimos enviar la consulta. Por favor, intentá nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mailbox Header */}
      <div className="rounded-3xl bg-linear-to-r from-rose-500 via-pink-500 to-amber-500 text-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-100 mb-1">
          <HelpCircle className="w-4 h-4" />
          <span>Buzón de Dudas e Investigaciones • Anónimo y Seguro</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-['Fredoka']">
          El Buzón de Preguntas
        </h2>
        <p className="text-xs sm:text-sm text-rose-50 mt-1 max-w-2xl leading-relaxed">
          Tener dudas durante la pubertad es lo más natural del mundo. Escribí tu pregunta libremente: nuestro equipo de investigación pedagógica te responderá con calidez, rigor científico y cuidado.
        </p>
      </div>

      {/* Safety and privacy banner */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200/90 p-4 text-xs text-amber-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Espacio Seguro y Confidencial:</strong> No pedimos nombres ni datos personales. No emitimos diagnósticos médicos individuales. Si algo te duele, te preocupa profundamente o vivís una situación incómoda, siempre es importante hablar con un adulto de confianza o profesional de salud.
        </div>
      </div>

      {/* Main input card */}
      <div className="rounded-3xl bg-white border border-rose-200 p-6 sm:p-8 shadow-sm space-y-5">
        <h3 className="text-base font-bold font-['Fredoka'] text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-500" />
          <span>Escribí tu pregunta o elegí una sugerida</span>
        </h3>

        {/* Suggestion pills */}
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuestionText(sq.text);
                handleSubmit(sq.text);
              }}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 border border-slate-200 text-slate-700 font-semibold transition-all"
            >
              💬 {sq.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(questionText);
          }}
          className="space-y-3"
        >
          <div className="relative">
            <textarea
              maxLength={1200}
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="¿Qué te gustaría preguntar sobre crecer, los cambios en el cuerpo, las emociones o las amistades?..."
              className="w-full text-xs sm:text-sm rounded-2xl border border-slate-300 p-4 focus:outline-hidden focus:ring-2 focus:ring-rose-400 bg-white leading-relaxed resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Estado de Expediente 2: {reproductionUnlocked ? '🔓 Desbloqueado' : '🔒 Bloqueado por docente'}
            </span>
            <button
              type="submit"
              disabled={isLoading || !questionText.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm transition-all shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Investigando...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Enviar Pregunta</span>
                </>
              )}
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            {errorMsg}
          </div>
        )}

        {/* Current Answer Box */}
        {currentResponse && (
          <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-6 space-y-4 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold text-slate-600">
                  Categoría Clasificada:
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900">
                  {currentResponse.category}
                </span>
              </div>
              {currentResponse.reproductionBlocked && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  <Lock className="w-3 h-3" />
                  Bloqueo Pedagógico Etapa 1
                </span>
              )}
            </div>

            {/* Student's original query */}
            <div className="text-xs font-medium text-slate-500 italic">
              Pregunta realizada: "{currentResponse.question}"
            </div>

            {/* Answer */}
            <div className="rounded-xl bg-white border border-slate-200 p-4 text-xs sm:text-sm leading-relaxed text-slate-800 font-medium space-y-2">
              <p>{currentResponse.answer}</p>
            </div>

            {/* Companion quote */}
            {currentResponse.companionQuote && (
              <div className="rounded-xl bg-emerald-50/80 border border-emerald-200 p-3.5 text-xs text-emerald-950 font-medium flex items-start gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[10px] uppercase tracking-wider block text-emerald-800 mb-0.5">
                    Compañeros de 6.º Grado:
                  </span>
                  <p className="italic">{currentResponse.companionQuote}</p>
                </div>
              </div>
            )}

            {/* Reflection question */}
            {currentResponse.reflectionQuestion && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-950 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-amber-900 mb-0.5">
                    Para pensar juntos:
                  </span>
                  <p>{currentResponse.reflectionQuestion}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Queries Log in this session */}
      {recentQueries.length > 0 && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <History className="w-4 h-4 text-rose-500" />
            <span>Consultas recientes en tu cuaderno ({recentQueries.length})</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
            {recentQueries.slice(0, 8).map((q) => (
              <div key={q.id} className="py-2.5 text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-rose-800">{q.category}</span>
                  <span>{new Date(q.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="font-bold text-slate-800">"{q.question}"</p>
                <p className="text-slate-600 text-[11px] line-clamp-2">{q.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
