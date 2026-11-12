import React from 'react';
import { Volume2, VolumeX, History, Plus, Moon, Sun } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  onOpenCustom: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  onOpenHistory,
  onOpenCustom,
  isMuted,
  onToggleMute,
  isDark,
  onToggleDark,
}) => {
  return (
    <header className="w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-8 py-3 sticky top-0 z-40 transition-colors">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-400 dark:bg-amber-500 text-slate-950 flex items-center justify-center text-lg font-bold shadow-xs">
            ⏰
          </div>
          <div>
            <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
              Excusatrón
            </span>
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          {/* History Button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenHistory();
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Ver historial de excusas"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Historial</span>
            {historyCount > 0 && (
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                ({historyCount})
              </span>
            )}
          </button>

          {/* Custom creator button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenCustom();
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Crear tu propia excusa"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Personalizar</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

          {/* Audio toggle */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
            aria-label="Alternar sonido"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={onToggleDark}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isDark ? 'Modo claro' : 'Modo oscuro'}
            aria-label="Alternar modo oscuro"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
