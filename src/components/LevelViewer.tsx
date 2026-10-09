import React, { useState } from 'react';
import { LEVELS } from '../data/curriculumData';
import {
  Compass,
  Sparkles,
  Activity,
  HeartHandshake,
  Users,
  CheckCircle2,
  Lightbulb,
  HelpCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  Send
} from 'lucide-react';

interface LevelViewerProps {
  initialLevelId?: number;
  onSubmitActivity?: (activity: string, response: unknown) => Promise<void>;
}

export const LevelViewer: React.FC<LevelViewerProps> = ({ initialLevelId = 1, onSubmitActivity }) => {
  const [activeLevelId, setActiveLevelId] = useState(initialLevelId);
  const [reflectionInput, setReflectionInput] = useState('');
  const [savedReflections, setSavedReflections] = useState<{ [key: number]: string }>({});
  const [hormoneStep, setHormoneStep] = useState(0);

  const currentLevel = LEVELS.find((lvl) => lvl.id === activeLevelId) || LEVELS[0];

  const handleSaveReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionInput.trim()) return;
    setSavedReflections((prev) => ({
      ...prev,
      [activeLevelId]: reflectionInput.trim(),
    }));
    setReflectionInput('');
    await onSubmitActivity?.(`Nivel ${activeLevelId}: ${currentLevel.title}`, reflectionInput.trim());
  };

  const iconsMap: { [key: string]: React.ElementType } = {
    Compass,
    Sparkles,
    Activity,
    HeartHandshake,
    Users,
  };

  return (
    <div className="space-y-6">
      {/* Level Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {LEVELS.map((lvl) => {
          const Icon = iconsMap[lvl.iconName] || Compass;
          const isActive = lvl.id === activeLevelId;
          return (
            <button
              key={lvl.id}
              onClick={() => {
                setActiveLevelId(lvl.id);
                setHormoneStep(0);
              }}
              className={`shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  isActive ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider opacity-80">
                  Módulo 0{lvl.id}
                </div>
                <div>{lvl.title.replace(`Nivel ${lvl.id}: `, '')}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Level Content Card */}
      <div className="rounded-3xl bg-white border border-amber-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header of the level */}
        <div className="border-b border-slate-100 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <span>Nivel 0{currentLevel.id} de 05</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Fredoka'] text-slate-900">
            {currentLevel.title}
          </h2>
          <p className="text-sm font-semibold text-amber-800 mt-1">
            {currentLevel.subtitle}
          </p>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-3xl">
            {currentLevel.summary}
          </p>
        </div>

        {/* Level 3 Special: Interactive Hormone Messenger Simulator */}
        {currentLevel.id === 3 && (
          <div className="rounded-2xl bg-indigo-50/70 border border-indigo-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-950 font-bold font-['Fredoka'] text-base">
                <Activity className="w-5 h-5 text-indigo-600" />
                <span>Simulador: ¿Cómo viaja el mensaje hormonal en el cuerpo?</span>
              </div>
              <button
                onClick={() => setHormoneStep((prev) => (prev + 1) % 4)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Avanzar Paso ({hormoneStep + 1}/4)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div
                className={`p-3.5 rounded-xl border text-xs transition-all ${
                  hormoneStep === 0
                    ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-200'
                    : 'bg-white/60 border-slate-200 text-slate-500'
                }`}
              >
                <span className="font-bold text-indigo-900 block mb-1">1. El Cerebro da la señal</span>
                La glándula hipófisis (en la base del encéfalo) comienza a liberar pequeñas cantidades de hormonas estimulantes.
              </div>
              <div
                className={`p-3.5 rounded-xl border text-xs transition-all ${
                  hormoneStep === 1
                    ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-200'
                    : 'bg-white/60 border-slate-200 text-slate-500'
                }`}
              >
                <span className="font-bold text-indigo-900 block mb-1">2. Viaje por la sangre</span>
                Las hormonas viajan a través del torrente sanguíneo como mensajeras que buscan a sus órganos receptores.
              </div>
              <div
                className={`p-3.5 rounded-xl border text-xs transition-all ${
                  hormoneStep === 2
                    ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-200'
                    : 'bg-white/60 border-slate-200 text-slate-500'
                }`}
              >
                <span className="font-bold text-indigo-900 block mb-1">3. Activación de glándulas</span>
                Los ovarios producen estrógenos/progesterona; los testículos producen testosterona. Todos los cuerpos tienen ambas en proporciones variadas.
              </div>
              <div
                className={`p-3.5 rounded-xl border text-xs transition-all ${
                  hormoneStep === 3
                    ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-200'
                    : 'bg-white/60 border-slate-200 text-slate-500'
                }`}
              >
                <span className="font-bold text-indigo-900 block mb-1">4. Transformación gradual</span>
                Huesos, músculos, piel, glándulas de sudor y órganos sexuales maduran paso a paso a lo largo de varios años.
              </div>
            </div>
          </div>
        )}

        {/* Level 2 Special: Observable Physical Changes Cards */}
        {currentLevel.id === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs">
              <span className="font-bold text-amber-950 block mb-1">📏 El Estirón</span>
              Brazos y piernas crecen primero; los hombros o caderas se ensanchan según la persona.
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs">
              <span className="font-bold text-rose-950 block mb-1">🌿 Vello y Piel</span>
              Aparece vello en axilas y zona genital. Glándulas de sudor y sebo más activas (acné u olor característico).
            </div>
            <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 text-xs">
              <span className="font-bold text-sky-950 block mb-1">🗣️ Tono de Voz</span>
              Las cuerdas vocales crecen. Puede volverse más grave con pequeños quiebres pasajeros normales.
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs">
              <span className="font-bold text-emerald-950 block mb-1">🌸 Desarrollo Mamario</span>
              En cuerpos femeninos, crecen las mamas. Es muy común que una empiece antes o sea un poquito distinta.
            </div>
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs">
              <span className="font-bold text-indigo-950 block mb-1">💧 Menstruación</span>
              Madura el ciclo menstrual. Al principio los ciclos pueden ser irregulares; forma parte del proceso.
            </div>
            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs">
              <span className="font-bold text-purple-950 block mb-1">✨ Genitales y Eyaculación</span>
              Crecimiento testicular y peneano; pueden ocurrir primeras eyaculaciones o emisiones involuntarias durante el sueño.
            </div>
          </div>
        )}

        {/* Level 4 Special: Emotional Thermometer & Privacy Rule */}
        {currentLevel.id === 4 && (
          <div className="rounded-2xl bg-rose-50/70 border border-rose-200 p-4 space-y-3">
            <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
              ❤️ Recordatorio sobre las Emociones en la Pubertad
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-rose-100">
                <span className="font-bold text-rose-900 block mb-1">No sos irracional</span>
                Sentir enojo, tristeza o alegría con intensidad es normal; el cerebro está reorganizando sus circuitos.
              </div>
              <div className="bg-white p-3 rounded-xl border border-rose-100">
                <span className="font-bold text-rose-900 block mb-1">La Privacidad es sana</span>
                Querer cerrar la puerta de tu habitación o estar a solas un rato para pensar no significa estar enojado.
              </div>
              <div className="bg-white p-3 rounded-xl border border-rose-100">
                <span className="font-bold text-rose-900 block mb-1">Sin comparación</span>
                Mirar lo que hacen los demás en redes o en el aula solo te distrae de tus propios dones y tiempos.
              </div>
            </div>
          </div>
        )}

        {/* Level 5 Special: Disagreement vs Mistreatment Guide */}
        {currentLevel.id === 5 && (
          <div className="rounded-2xl bg-sky-50/70 border border-sky-200 p-4 space-y-3">
            <h4 className="text-xs font-bold text-sky-950 uppercase tracking-wider">
              🤝 Diferencia Clave para la Convivencia Escolar
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-sky-200">
                <span className="font-bold text-sky-900 block mb-1">Tener un Desacuerdo</span>
                • Pensar diferente sobre un juego o una idea.<br />
                • Se habla con ganas de ser escuchado, pero respetando al otro.<br />
                • Se busca un acuerdo o alternar turnos.
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-rose-200">
                <span className="font-bold text-rose-900 block mb-1">Maltrato o Burla (NO está bien)</span>
                • Insultar, humillar o reírse del cuerpo de otro.<br />
                • Obligar a alguien a hacer lo que no quiere para no dejarlo afuera.<br />
                • Se debe frenar y acudir a un docente o adulto de confianza.
              </div>
            </div>
          </div>
        )}

        {/* Key Concepts Cards */}
        <div className="space-y-4">
          <h3 className="text-base font-bold font-['Fredoka'] text-slate-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <span>Puntos Clave para Comprender</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentLevel.keyConcepts.map((concept, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 p-4.5 bg-slate-50/40 hover:bg-white hover:border-amber-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                    {concept.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {concept.description}
                  </p>
                </div>
                {concept.quote && (
                  <div
                    className={`mt-3.5 rounded-xl p-2.5 text-xs font-medium border ${
                      concept.sofiaOrMateo === 'sofia'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-sky-50 border-sky-200 text-sky-950'
                    }`}
                  >
                    <span className="font-bold block text-[10px] uppercase tracking-wider mb-0.5 opacity-80">
                      {concept.sofiaOrMateo === 'sofia' ? '👧 Sofía comparte:' : '👦 Mateo comparte:'}
                    </span>
                    <p className="italic">{concept.quote}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Diversity & Respect Guarantee Box */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200/80 p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 leading-relaxed">
            <span className="font-bold">Diversidad de Ritmos:</span> {currentLevel.diversityNote}
          </div>
        </div>

        {/* Interactive Reflection / Personal Notebook */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>Pregunta para Investigar y Pensar</span>
          </div>
          <p className="text-sm font-semibold text-slate-900">
            {currentLevel.reflectionPrompt}
          </p>

          <form onSubmit={handleSaveReflection} className="space-y-2.5">
            <textarea
              rows={2}
              value={reflectionInput}
              onChange={(e) => setReflectionInput(e.target.value)}
              placeholder="Escribí acá tu pensamiento o lo que conversaron en el aula..."
              className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-hidden focus:ring-2 focus:ring-amber-400 bg-white"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Tu respuesta se enviará a la docente.
              </span>
              <button
                type="submit"
                disabled={!reflectionInput.trim()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 text-xs font-bold transition-all shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Guardar Nota</span>
              </button>
            </div>
          </form>

          {savedReflections[activeLevelId] && (
            <div className="mt-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-950 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Tu apunte guardado: </span>
                <span>"{savedReflections[activeLevelId]}"</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
