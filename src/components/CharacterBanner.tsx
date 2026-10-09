import React, { useState } from 'react';
import { CORE_MESSAGE, CHARACTERS } from '../data/curriculumData';
import { Heart, Sparkles, MessageCircle, Info, Shuffle } from 'lucide-react';

interface CharacterBannerProps {
  onExploreLevels?: () => void;
  onExploreDetective?: () => void;
}

export const CharacterBanner: React.FC<CharacterBannerProps> = ({
  onExploreLevels,
  onExploreDetective,
}) => {
  const [sofiaQuoteIndex, setSofiaQuoteIndex] = useState(0);
  const [mateoQuoteIndex, setMateoQuoteIndex] = useState(0);

  const cycleSofiaQuote = () => {
    setSofiaQuoteIndex((prev) => (prev + 1) % CHARACTERS.sofia.sampleQuotes.length);
  };

  const cycleMateoQuote = () => {
    setMateoQuoteIndex((prev) => (prev + 1) % CHARACTERS.mateo.sampleQuotes.length);
  };

  return (
    <div className="space-y-6">
      {/* Central Core Idea Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-amber-400 via-orange-300 to-rose-300 p-6 sm:p-8 shadow-md text-amber-950">
        <div className="absolute top-2 right-3 opacity-20 pointer-events-none">
          <Sparkles className="w-36 h-36" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-xs text-xs font-bold text-amber-900 mb-3 shadow-xs">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Idea Central de la Investigación</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold font-['Fredoka'] leading-relaxed text-slate-900 tracking-wide">
            {CORE_MESSAGE}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-amber-950/80">
            <span className="bg-white/60 px-3 py-1 rounded-lg">🌱 Ritmos diversos</span>
            <span className="bg-white/60 px-3 py-1 rounded-lg">🤝 Escucha y límites</span>
            <span className="bg-white/60 px-3 py-1 rounded-lg">🧠 Emociones válidas</span>
            <span className="bg-white/60 px-3 py-1 rounded-lg">🛡️ Cuidado y respeto</span>
          </div>
        </div>
      </div>

      {/* Meet Sofía and Mateo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Sofía Card */}
        <div className="rounded-3xl bg-white border border-emerald-100 p-6 shadow-sm hover:shadow-md transition-shadow relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-3xl shadow-inner">
                👧
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-['Fredoka'] text-emerald-950">
                    {CHARACTERS.sofia.name}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {CHARACTERS.sofia.age} • 6.º Grado
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {CHARACTERS.sofia.traits}
                </p>
              </div>
            </div>
            <button
              onClick={cycleSofiaQuote}
              className="p-1.5 rounded-xl text-emerald-700 hover:bg-emerald-50 transition-colors"
              title="Ver otra reflexión de Sofía"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>

          <p className="mt-3.5 text-xs text-slate-600 leading-relaxed">
            {CHARACTERS.sofia.description}
          </p>

          {/* Interactive Speech Bubble */}
          <div className="mt-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 p-3.5 relative text-xs text-emerald-950 font-medium leading-relaxed">
            <div className="flex items-start gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="italic">{CHARACTERS.sofia.sampleQuotes[sofiaQuoteIndex]}</p>
                <p className="text-[10px] text-emerald-700/80 mt-1 font-semibold">
                  Toca la flechita para leer otra vivencia de Sofía
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mateo Card */}
        <div className="rounded-3xl bg-white border border-sky-100 p-6 shadow-sm hover:shadow-md transition-shadow relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 border-2 border-sky-300 flex items-center justify-center text-3xl shadow-inner">
                👦
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-['Fredoka'] text-sky-950">
                    {CHARACTERS.mateo.name}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    {CHARACTERS.mateo.age} • 6.º Grado
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {CHARACTERS.mateo.traits}
                </p>
              </div>
            </div>
            <button
              onClick={cycleMateoQuote}
              className="p-1.5 rounded-xl text-sky-700 hover:bg-sky-50 transition-colors"
              title="Ver otra reflexión de Mateo"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>

          <p className="mt-3.5 text-xs text-slate-600 leading-relaxed">
            {CHARACTERS.mateo.description}
          </p>

          {/* Interactive Speech Bubble */}
          <div className="mt-4 rounded-2xl bg-sky-50/80 border border-sky-200/70 p-3.5 relative text-xs text-sky-950 font-medium leading-relaxed">
            <div className="flex items-start gap-2">
              <MessageCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <p className="italic">{CHARACTERS.mateo.sampleQuotes[mateoQuoteIndex]}</p>
                <p className="text-[10px] text-sky-700/80 mt-1 font-semibold">
                  Toca la flechita para leer otra vivencia de Mateo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role of characters reminder badge */}
      <div className="rounded-2xl bg-amber-100/60 border border-amber-200 p-4 text-xs text-amber-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">¿Quiénes son Sofía y Mateo?</span> No son profesores ni tienen todas las respuestas. Son compañeros de 6.º grado como vos que comparten anécdotas, hacen preguntas y nos recuerdan que cada persona vive la pubertad de una manera distinta. <strong>¡Vos sos quien investiga y saca sus propias conclusiones!</strong>
        </div>
      </div>

      {/* Action shortcuts */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        {onExploreLevels && (
          <button
            onClick={onExploreLevels}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
          >
            <span>Explorar los 5 Niveles de Crecer</span>
            <span>→</span>
          </button>
        )}
        {onExploreDetective && (
          <button
            onClick={onExploreDetective}
            className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
          >
            <span>Jugar al Detective de Cambios</span>
            <span>🕵️</span>
          </button>
        )}
      </div>
    </div>
  );
};
