import React from 'react';
import { Lock, Unlock, RefreshCw } from 'lucide-react';
import { ExcuseComponent } from '../data/excusesData';

interface SlotCardProps {
  index: number;
  label: string;
  sublabel: string;
  accentColor: 'yellow' | 'pink' | 'cyan';
  item: ExcuseComponent | null;
  displayItem: ExcuseComponent | null;
  isSpinning: boolean;
  isLocked: boolean;
  onToggleLock: () => void;
  onSingleReroll: () => void;
}

export const SlotCard: React.FC<SlotCardProps> = ({
  index,
  label,
  sublabel,
  accentColor,
  item,
  displayItem,
  isSpinning,
  isLocked,
  onToggleLock,
  onSingleReroll,
}) => {
  const current = displayItem || item;

  const colorStyles = {
    yellow: {
      bg: 'bg-amber-100 dark:bg-amber-950/40',
      border: 'border-black dark:border-amber-400',
      badge: 'bg-amber-400 text-black',
      tag: 'bg-amber-200 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200',
      glow: 'shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(251,191,36,0.9)]',
      hoverBorder: 'hover:border-amber-500',
      lockActive: 'bg-amber-400 text-black',
    },
    pink: {
      bg: 'bg-pink-100 dark:bg-pink-950/40',
      border: 'border-black dark:border-pink-400',
      badge: 'bg-pink-500 text-white',
      tag: 'bg-pink-200 text-pink-900 dark:bg-pink-900/60 dark:text-pink-200',
      glow: 'shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(244,114,182,0.9)]',
      hoverBorder: 'hover:border-pink-500',
      lockActive: 'bg-pink-500 text-white',
    },
    cyan: {
      bg: 'bg-emerald-100 dark:bg-emerald-950/40',
      border: 'border-black dark:border-emerald-400',
      badge: 'bg-emerald-400 text-black',
      tag: 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200',
      glow: 'shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(52,211,153,0.9)]',
      hoverBorder: 'hover:border-emerald-500',
      lockActive: 'bg-emerald-400 text-black',
    },
  }[accentColor];

  return (
    <div
      className={`relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border-4 ${colorStyles.border} ${colorStyles.bg} ${colorStyles.glow} transition-all duration-200 min-h-[220px] sm:min-h-[250px] ${
        isLocked ? 'ring-4 ring-black/40 dark:ring-white/40' : ''
      }`}
    >
      {/* Top Bar inside Card */}
      <div className="flex items-center justify-between gap-2 border-b-2 border-black/10 dark:border-white/10 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`font-arcade text-[11px] sm:text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${colorStyles.badge} border-2 border-black`}
          >
            {label}
          </span>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
            {sublabel}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Single Reroll Button */}
          <button
            onClick={onSingleReroll}
            disabled={isSpinning || isLocked}
            title={`Sortear solo ${label}`}
            className="p-1.5 rounded-lg border-2 border-black bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-90 transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Lock / Freeze Button */}
          <button
            onClick={onToggleLock}
            disabled={isSpinning}
            title={isLocked ? 'Desbloquear slot' : 'Bloquear slot para mantenerlo'}
            className={`p-1.5 rounded-lg border-2 border-black font-medium text-xs flex items-center gap-1 transition-all ${
              isLocked
                ? `${colorStyles.lockActive} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-105`
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span className="text-[10px] font-bold uppercase">
              {isLocked ? 'Fijo' : 'Fijar'}
            </span>
          </button>
        </div>
      </div>

      {/* Reel Center Slot Display */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-auto overflow-hidden py-2">
        <div
          className={`transition-all duration-150 transform ${
            isSpinning
              ? 'scale-95 opacity-70 blur-[1px] translate-y-1'
              : 'scale-100 opacity-100 blur-0 translate-y-0'
          }`}
        >
          {/* Giant Animated Emoji */}
          <div className="text-4xl sm:text-5xl mb-2 filter drop-shadow select-none animate-bounce" style={{ animationDuration: isSpinning ? '0.3s' : '2.5s' }}>
            {current ? current.emoji : '❓'}
          </div>

          {/* Main Content Text */}
          <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug tracking-tight px-1 font-display">
            {current ? current.text : 'Apretá el botón para sortear'}
          </p>
        </div>
      </div>

      {/* Bottom Metadata & Tag */}
      <div className="mt-3 pt-2 border-t-2 border-black/10 dark:border-white/10 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <span className={`px-2 py-0.5 rounded-md font-medium text-[11px] ${colorStyles.tag}`}>
          #{current ? current.tag : 'Aleatorio'}
        </span>

        {/* Absurdity Dots */}
        <div className="flex items-center gap-1" title="Nivel de delirio">
          <span className="text-[10px] uppercase font-bold text-slate-400">Locura:</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((level) => {
              const active = current && current.intensity >= level;
              return (
                <span
                  key={level}
                  className={`w-1.5 h-3 rounded-xs border border-black/50 ${
                    active ? 'bg-black dark:bg-yellow-400' : 'bg-black/10 dark:bg-white/10'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
