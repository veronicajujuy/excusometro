import React from 'react';
import { Volume2, VolumeX, History, Star, PlusCircle, Moon, Sun, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface HeaderProps {
  historyCount: number;
  favoritesCount: number;
  onOpenHistory: () => void;
  onOpenFavorites: () => void;
  onOpenCustom: () => void;
  onQuickSpin: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  favoritesCount,
  onOpenHistory,
  onOpenFavorites,
  onOpenCustom,
  onQuickSpin,
  isMuted,
  onToggleMute,
  isDark,
  onToggleDark,
}) => {
  return (
    <header className="w-full border-b-4 border-black dark:border-slate-800 bg-[#FFE600] dark:bg-slate-900 px-4 sm:px-8 py-3.5 transition-colors sticky top-0 z-40 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand title, one line wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-pink-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-xl select-none">
            ⏰
          </div>
          <span className="font-arcade text-lg sm:text-2xl text-black dark:text-yellow-300 tracking-wider whitespace-nowrap uppercase">
            Excusatrón
          </span>
        </div>

        {/* Zone 2: Navigation controls & tools */}
        <nav className="flex items-center gap-1.5 sm:gap-3 text-xs sm:text-sm font-extrabold whitespace-nowrap overflow-x-auto py-1">
          {/* History Button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenHistory();
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl border-2 border-black bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-yellow-100 dark:hover:bg-slate-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            title="Ver historial de excusas generadas"
          >
            <History className="w-4 h-4 text-black dark:text-slate-300" />
            <span className="hidden sm:inline">Historial</span>
            {historyCount > 0 && (
              <span className="bg-black text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {historyCount}
              </span>
            )}
          </button>

          {/* Favorites Button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenFavorites();
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl border-2 border-black bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-yellow-100 dark:hover:bg-slate-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            title="Ver excusas favoritas"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="hidden sm:inline">Favoritas</span>
            {favoritesCount > 0 && (
              <span className="bg-amber-400 text-black text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Custom Creator Button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenCustom();
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl border-2 border-black bg-pink-400 dark:bg-pink-900/60 text-white hover:bg-pink-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            title="Agregar tu propia excusa personalizada"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Sumar Tu Disparate</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 sm:p-2 rounded-xl border-2 border-black bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer shrink-0"
            title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
            aria-label="Alternar sonido"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-black dark:text-white" />
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDark}
            className="p-1.5 sm:p-2 rounded-xl border-2 border-black bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer shrink-0"
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label="Alternar modo oscuro"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-yellow-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-800" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="shrink-0 hidden md:block">
          <button
            onClick={() => {
              playClickSound();
              onQuickSpin();
            }}
            className="px-4 py-2 text-xs font-arcade uppercase text-white bg-black hover:bg-slate-900 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Giro Rápido</span>
          </button>
        </div>
      </div>
    </header>
  );
};
