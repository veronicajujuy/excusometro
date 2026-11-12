import React, { useState } from 'react';
import { Sparkles, Dices } from 'lucide-react';

interface BigSpinButtonProps {
  onClick: () => void;
  isSpinning: boolean;
  disabled?: boolean;
}

export const BigSpinButton: React.FC<BigSpinButtonProps> = ({
  onClick,
  isSpinning,
  disabled = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className="relative flex flex-col items-center justify-center my-5 select-none w-full max-w-sm sm:max-w-md">
      {/* 3D Button Container */}
      <div className="relative w-full">
        {/* Shadow base */}
        <div className="absolute inset-0 rounded-2xl bg-slate-900/15 dark:bg-black/60 translate-y-2" />

        {/* Tactile Button */}
        <button
          type="button"
          onClick={onClick}
          onPointerDown={() => !disabled && !isSpinning && setIsPressed(true)}
          onPointerUp={() => setIsPressed(false)}
          onPointerLeave={() => setIsPressed(false)}
          disabled={disabled || isSpinning}
          aria-label="Generar excusa absurda para llegar tarde"
          className={`relative w-full py-4 px-6 sm:py-5 sm:px-8 rounded-2xl font-bold tracking-wide transition-all duration-150 ease-out cursor-pointer overflow-hidden ${
            isSpinning
              ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-white translate-y-2 shadow-none cursor-wait'
              : isPressed
              ? 'bg-gradient-to-r from-amber-400 to-rose-500 text-white translate-y-2 shadow-none'
              : 'bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 text-white shadow-[0_6px_0_0_#9f1239] hover:shadow-[0_8px_0_0_#9f1239] -translate-y-0.5 hover:-translate-y-1 active:translate-y-2 active:shadow-none'
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <Dices
              className={`w-6 h-6 sm:w-7 sm:h-7 text-white ${
                isSpinning ? 'animate-spin' : 'group-hover:rotate-45'
              }`}
            />
            <span className="font-display text-lg sm:text-2xl font-extrabold uppercase tracking-wide">
              {isSpinning ? 'Combinando...' : 'Generar Excusa'}
            </span>
            <Sparkles
              className={`w-5 h-5 text-amber-200 fill-amber-200 ${
                isSpinning ? 'animate-pulse' : ''
              }`}
            />
          </div>
        </button>
      </div>

      <span className="mt-2.5 text-xs text-slate-400 font-medium hidden sm:inline">
        Atajo: pulsa <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm">Espacio</kbd> para sortear
      </span>
    </div>
  );
};
