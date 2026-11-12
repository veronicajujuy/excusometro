import React from 'react';
import { Lock, Unlock, RotateCw } from 'lucide-react';
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

  const accentPills = {
    yellow: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50',
    pink: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50',
    cyan: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-900/50',
  }[accentColor];

  return (
    <div
      className={`relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 min-h-[200px] sm:min-h-[220px] ${
        isLocked
          ? 'border-amber-400 dark:border-amber-500 shadow-sm ring-2 ring-amber-400/20'
          : 'border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Top Bar inside Card */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${accentPills}`}>
            {label}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
            {sublabel}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Individual Reroll */}
          <button
            onClick={onSingleReroll}
            disabled={isSpinning || isLocked}
            title={`Sortear solo ${label}`}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Lock / Freeze */}
          <button
            onClick={onToggleLock}
            disabled={isSpinning}
            title={isLocked ? 'Desbloquear slot' : 'Fijar este elemento'}
            className={`px-2 py-0.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              isLocked
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            <span className="text-[11px]">{isLocked ? 'Fijado' : 'Fijar'}</span>
          </button>
        </div>
      </div>

      {/* Reel Slot Display */}
      <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
        <div
          className={`transition-all duration-150 transform ${
            isSpinning
              ? 'scale-95 opacity-60 blur-[1px]'
              : 'scale-100 opacity-100 blur-0'
          }`}
        >
          {/* Expressive Emoji */}
          <div className="text-4xl sm:text-5xl mb-2 select-none">
            {current ? current.emoji : '❓'}
          </div>

          {/* Card Text */}
          <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug tracking-tight px-2 font-display">
            {current ? current.text : '...'}
          </p>
        </div>
      </div>

      {/* Bottom Category Note */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>{current?.tag || 'General'}</span>
        <span className="text-slate-300 dark:text-slate-600">·</span>
        <span className="text-slate-400">
          Nivel {current?.intensity || 3}/5
        </span>
      </div>
    </div>
  );
};
