import React from 'react';
import {
  Compass,
  BookOpen,
  HelpCircle,
  ShieldAlert,
  Search,
  Lock,
  Unlock,
  GraduationCap,
  Sparkles,
  Users,
  Maximize2,
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  reproductionUnlocked: boolean;
  onOpenTeacherModal: () => void;
  fontSize: 'normal' | 'large';
  setFontSize: (size: 'normal' | 'large') => void;
  onOpenProjector: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  reproductionUnlocked,
  onOpenTeacherModal,
  fontSize,
  setFontSize,
  onOpenProjector,
}) => {
  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: Compass, color: 'text-amber-700' },
    { id: 'niveles', label: '5 Niveles de Crecer', icon: BookOpen, color: 'text-emerald-700' },
    { id: 'situaciones', label: 'Situaciones del Aula', icon: Users, color: 'text-sky-700' },
    { id: 'detective', label: 'Detective de Cambios', icon: Search, color: 'text-purple-700' },
    { id: 'buzon', label: 'Buzón de Preguntas', icon: HelpCircle, color: 'text-rose-700' },
    {
      id: 'expediente2',
      label: 'Expediente 2: El Interior',
      icon: reproductionUnlocked ? Unlock : Lock,
      color: reproductionUnlocked ? 'text-indigo-700' : 'text-slate-500',
      badge: reproductionUnlocked ? 'Habilitado' : 'Bloqueado',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      {/* Top Banner with App Identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('inicio')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-amber-500 via-rose-400 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-amber-200 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold font-['Fredoka'] tracking-wide text-slate-900 group-hover:text-amber-800 transition-colors flex items-center gap-2">
                Crecer, Cambiar y Aprender
              </h1>
              <p className="text-xs font-medium text-slate-500">
                Educación Sexual Integral (ESI) • 6.º Grado de Primaria
              </p>
            </div>
          </button>
        </div>

        {/* Action badges: text size, projector, teacher mode */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Font size toggle */}
          <div className="inline-flex rounded-xl bg-slate-100 p-0.5 text-xs font-medium border border-slate-200">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                fontSize === 'normal'
                  ? 'bg-white shadow-xs text-slate-800 font-semibold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Tamaño de texto estándar"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                fontSize === 'large'
                  ? 'bg-white shadow-xs text-amber-900 font-bold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Texto ampliado (ideal para pizarrón o lectura fácil)"
            >
              A+
            </button>
          </div>

          {/* Quick projector button */}
          <button
            onClick={onOpenProjector}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100/80 hover:bg-amber-200 text-amber-900 text-xs font-semibold transition-colors border border-amber-300/60 shadow-xs"
            title="Abrir modo proyector para debatir en el aula"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Proyector Aula</span>
          </button>

          {/* Teacher Mode Button */}
          <button
            onClick={onOpenTeacherModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm shadow-indigo-200 hover:shadow-indigo-300"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Modo Docente</span>
            {reproductionUnlocked && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Expediente 2 activo" />
            )}
          </button>
        </div>
      </div>

      {/* Main navigation tabs */}
      <nav className="border-t border-slate-100 bg-amber-50/40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto py-1.5 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`relative shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm shadow-amber-900/5 ring-1 ring-amber-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-bold ${
                      item.badge === 'Habilitado'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
