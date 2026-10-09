import React, { useState } from 'react';
import { DETECTIVE_QUESTIONS } from '../data/curriculumData';
import { ChangeType } from '../types';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Award,
  HelpCircle,
  PlusCircle
} from 'lucide-react';

export const ChangeDetectiveQuiz: React.FC<{onSubmitActivity?:(activity:string,response:unknown)=>Promise<void>}> = ({onSubmitActivity}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [history, setHistory] = useState<{ [qIndex: number]: number }>({});

  // Custom situation creator
  const [customText, setCustomText] = useState('');
  const [customAnalysis, setCustomAnalysis] = useState<{
    text: string;
    result: string;
    explanation: string;
  } | null>(null);

  const currentQ = DETECTIVE_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    if (selectedOptionIndex !== null) return; // already answered
    setSelectedOptionIndex(index);
    setHistory((prev) => ({ ...prev, [currentQuestionIndex]: index }));

    const option = currentQ.options[index];
    if (option.isCorrectOrValid) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < DETECTIVE_QUESTIONS.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
    } else { setCompleted(true); void onSubmitActivity?.('Detective de Cambios',{puntaje:score,total:DETECTIVE_QUESTIONS.length,respuestas:Object.entries(history).map(([i,selected])=>({pregunta:DETECTIVE_QUESTIONS[Number(i)].situation,respuesta:DETECTIVE_QUESTIONS[Number(i)].options[selected].label}))}); }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setScore(0);
    setCompleted(false);
    setHistory({});
  };

  const handleAnalyzeCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const lower = customText.toLowerCase();
    let typeResult = 'Puede involucrar más de uno (¡Combinado!)';
    let explanation =
      'Esta situación involucra aspectos que tocan el cuerpo o la mente y a su vez cómo te relacionás con tus pares.';

    const isPhysical =
      lower.includes('cuerpo') ||
      lower.includes('crec') ||
      lower.includes('voz') ||
      lower.includes('vello') ||
      lower.includes('piel') ||
      lower.includes('grano') ||
      lower.includes('transpir') ||
      lower.includes('olor') ||
      lower.includes('alto') ||
      lower.includes('baja') ||
      lower.includes('pecho') ||
      lower.includes('mamas') ||
      lower.includes('menstruac');

    const isEmotional =
      lower.includes('siento') ||
      lower.includes('enojo') ||
      lower.includes('vergüenza') ||
      lower.includes('miedo') ||
      lower.includes('ánimo') ||
      lower.includes('llorar') ||
      lower.includes('triste') ||
      lower.includes('insegur') ||
      lower.includes('privacidad') ||
      lower.includes('feliz') ||
      lower.includes('solo') ||
      lower.includes('sola');

    const isRelational =
      lower.includes('amig') ||
      lower.includes('grupo') ||
      lower.includes('compañer') ||
      lower.includes('pele') ||
      lower.includes('discut') ||
      lower.includes('límite') ||
      lower.includes('mamá') ||
      lower.includes('papá') ||
      lower.includes('familia') ||
      lower.includes('burl');

    const count = (isPhysical ? 1 : 0) + (isEmotional ? 1 : 0) + (isRelational ? 1 : 0);

    if (count > 1) {
      typeResult = 'D. Involucra más de uno (Interrelación)';
      explanation =
        '¡Gran análisis! Notamos elementos corporales, emocionales y de convivencia. En la vida real, los tres planos suelen influirse mutuamente.';
    } else if (isPhysical) {
      typeResult = 'A. Cambio Físico';
      explanation =
        'El foco principal está en una transformación observable del organismo o del cuerpo biológico.';
    } else if (isEmotional) {
      typeResult = 'B. Cambio Emocional';
      explanation =
        'El foco central refiere a lo que la persona siente por dentro, sus estados de ánimo o su necesidad de intimidad.';
    } else if (isRelational) {
      typeResult = 'C. Cambio Vincular';
      explanation =
        'El foco está en los lazos con amigos, compañeros o familia, la convivencia escolar y los límites.';
    }

    setCustomAnalysis({
      text: customText.trim(),
      result: typeResult,
      explanation,
    });
    setCustomText('');
  };

  return (
    <div className="space-y-6">
      {/* Quiz Banner */}
      <div className="rounded-3xl bg-linear-to-r from-purple-600 to-indigo-600 text-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-200 mb-1">
          <Search className="w-4 h-4" />
          <span>Actividad Interactiva • Clasificador de Cambios</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-['Fredoka']">
          El Detective de Cambios
        </h2>
        <p className="text-xs sm:text-sm text-purple-100 mt-1 max-w-2xl leading-relaxed">
          En 6.º grado aprendemos a distinguir tres tipos de cambios: <strong>Físicos</strong> (el cuerpo), <strong>Emocionales</strong> (lo que sentimos) y <strong>Vinculares</strong> (nuestras relaciones). ¡Analizá cada caso como un verdadero detective!
        </p>
      </div>

      {/* Guide reminder pill */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-amber-950 font-medium">
          <span className="font-bold block text-amber-800">1. Cambios Físicos</span>
          Modificaciones en el cuerpo: estatura, vello, piel, voz, desarrollo corporal.
        </div>
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3 text-rose-950 font-medium">
          <span className="font-bold block text-rose-800">2. Cambios Emocionales</span>
          Lo que sentimos: intensidad del ánimo, vergüenza, alegría, necesidad de privacidad.
        </div>
        <div className="rounded-2xl bg-sky-50 border border-sky-200 p-3 text-sky-950 font-medium">
          <span className="font-bold block text-sky-800">3. Cambios Vinculares</span>
          Relaciones con los demás: nuevas amistades, grupos, desacuerdos, límites.
        </div>
      </div>

      {!completed ? (
        /* Main Detective Card */
        <div className="rounded-3xl bg-white border border-purple-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Progress header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold">
                Expediente {currentQuestionIndex + 1} de {DETECTIVE_QUESTIONS.length}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Personaje: {currentQ.character}
              </span>
            </div>
            <div className="text-xs font-bold text-purple-700">
              Aciertos reflexivos: {score}
            </div>
          </div>

          {/* Situation Box */}
          <div className="rounded-2xl bg-purple-50/70 border border-purple-200 p-5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800">
              📋 Caso para investigar:
            </span>
            <p className="text-base sm:text-lg font-bold text-slate-900 font-['Fredoka'] leading-relaxed">
              "{currentQ.situation}"
            </p>
          </div>

          {/* Question Prompt */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <span>¿Qué tipo de cambio aparece principalmente?</span>
            </h4>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOptionIndex === idx;
                const hasSelected = selectedOptionIndex !== null;

                let btnStyle = 'bg-white border-slate-200 hover:border-purple-300 text-slate-800';
                if (hasSelected) {
                  if (isSelected) {
                    btnStyle = opt.isCorrectOrValid
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-200'
                      : 'bg-amber-50 border-amber-300 text-amber-950 ring-2 ring-amber-200';
                  } else if (opt.isCorrectOrValid) {
                    btnStyle = 'bg-emerald-50/60 border-emerald-200 text-emerald-900';
                  } else {
                    btnStyle = 'opacity-40 border-slate-200';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={hasSelected}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 rounded-2xl text-left border text-xs font-bold transition-all ${btnStyle}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{opt.label}</span>
                      {hasSelected && isSelected && (
                        <span>{opt.isCorrectOrValid ? '✅' : '💡'}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Explanation */}
          {selectedOptionIndex !== null && (
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-3">
              <div className="flex items-start gap-2.5">
                {currentQ.options[selectedOptionIndex].isCorrectOrValid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 text-xs">
                  <h5 className="font-bold text-slate-900 text-sm">
                    {currentQ.options[selectedOptionIndex].isCorrectOrValid
                      ? '¡Muy buen razonamiento!'
                      : 'Aporte para profundizar:'}
                  </h5>
                  <p className="text-slate-700 leading-relaxed">
                    {currentQ.options[selectedOptionIndex].explanation}
                  </p>
                  <p className="text-purple-900 font-semibold pt-1">
                    🔍 Reflexión clave: {currentQ.takeaway}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
                >
                  <span>
                    {currentQuestionIndex + 1 < DETECTIVE_QUESTIONS.length
                      ? 'Siguiente Expediente'
                      : 'Ver Resultados Finales'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Completed Screen */
        <div className="rounded-3xl bg-white border border-purple-200 p-8 text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto text-3xl">
            🏆
          </div>
          <h3 className="text-2xl font-bold font-['Fredoka'] text-slate-900">
            ¡Felicitaciones, Investigador/a de ESI!
          </h3>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Completaste todos los expedientes del Detective de Cambios con un total de{' '}
            <strong className="text-purple-700 font-bold">{score} razonamientos certeros</strong>.
            Ahora tenés herramientas para distinguir lo físico, lo emocional y lo vincular en tu vida cotidiana.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-100 text-amber-950 font-bold text-xs">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Insignia Obtenida: Pensamiento Crítico y Empatía 6.º Grado</span>
          </div>

          <div className="pt-2">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Volver a Investigar los Casos</span>
            </button>
          </div>
        </div>
      )}

      {/* Custom Situation Analyzer Tool */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold font-['Fredoka'] text-slate-900">
          <PlusCircle className="w-5 h-5 text-purple-600" />
          <span>¿Querés probar una situación inventada por vos?</span>
        </div>
        <p className="text-xs text-slate-500">
          Escribí una frase o situación que te haya pasado a vos o a tus amigos y el Detective te ayudará a clasificar qué tipo de cambio predomina.
        </p>

        <form onSubmit={handleAnalyzeCustom} className="space-y-3">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Ej: Ayer me enojé porque mi amigo no me quiso pasar la pelota y después me dio vergüenza..."
            className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-hidden focus:ring-2 focus:ring-purple-400"
          />
          <button
            type="submit"
            disabled={!customText.trim()}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-xs"
          >
            Analizar Tipo de Cambio
          </button>
        </form>

        {customAnalysis && (
          <div className="rounded-2xl bg-purple-50 border border-purple-200 p-4 text-xs space-y-2">
            <div className="font-bold text-purple-900">
              Caso: "{customAnalysis.text}"
            </div>
            <div className="text-sm font-bold font-['Fredoka'] text-purple-950">
              Diagnóstico: {customAnalysis.result}
            </div>
            <p className="text-slate-700 leading-relaxed">
              {customAnalysis.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
