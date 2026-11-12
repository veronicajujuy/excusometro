import React, { useState } from 'react';
import { Sparkles, Dices, Flame } from 'lucide-react';

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

  const handlePointerDown = () => {
    if (!disabled && !isSpinning) {
      setIsPressed(true);
    }
  };

  const handlePointerUp = () => {
    setIsPressed(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center my-4 group select-none">
      {/* Decorative cartoon sparkle badges floating around */}
      <div className="absolute -top-3 -left-4 sm:left-4 z-10 pointer-events-none transform -rotate-12 animate-pulse">
        <span className="bg-yellow-300 text-black border-2 border-black font-arcade text-[10px] sm:text-xs px-2 py-0.5 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 font-bold">
          <Flame className="w-3 h-3 text-orange-600 fill-orange-500" />
          100% ABSURDO
        </span>
      </div>

      <div className="absolute -bottom-2 -right-3 sm:right-6 z-10 pointer-events-none transform rotate-6">
        <span className="bg-pink-400 text-white border-2 border-black font-arcade text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 font-bold">
          <Sparkles className="w-3 h-3 text-yellow-200 fill-yellow-200" />
          ¡APRETÁ ACÁ!
        </span>
      </div>

      {/* Button Wrapper with 3D Depth Floor */}
      <div className="relative inline-block w-full max-w-md sm:max-w-lg">
        {/* Physical 3D button back block */}
        <div className="absolute inset-0 rounded-3xl bg-black transform translate-y-3 translate-x-1" />

        {/* The Giant Clickable Button */}
        <button
          type="button"
          onClick={onClick}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          disabled={disabled || isSpinning}
          aria-label="Generar excusa absurda para llegar tarde"
          className={`relative w-full py-5 px-6 sm:py-6 sm:px-8 rounded-3xl border-4 border-black text-slate-950 font-black tracking-wide uppercase transition-all duration-100 ease-out cursor-pointer overflow-hidden ${
            isSpinning
              ? 'bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 translate-y-2 shadow-none cursor-wait'
              : isPressed
              ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-rose-400 translate-y-2.5 shadow-none'
              : 'bg-gradient-to-r from-yellow-300 via-amber-300 to-pink-400 hover:from-yellow-200 hover:to-pink-300 shadow-[0_8px_0_0_#000] -translate-y-0.5 hover:-translate-y-1 active:translate-y-2.5 active:shadow-none'
          }`}
        >
          {/* Subtle striped gloss overlay */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #000 0, #000 10px, transparent 10px, transparent 20px)',
            }}
          />

          {/* Button Content */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-1 text-center">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <Dices
                className={`w-7 h-7 sm:w-9 sm:h-9 text-black ${
                  isSpinning ? 'animate-spin' : 'group-hover:rotate-45 transition-transform duration-300'
                }`}
              />
              <span className="font-arcade text-xl sm:text-2xl md:text-3xl tracking-wider text-black drop-shadow-[1px_1px_0px_#fff]">
                {isSpinning ? '¡GENERANDO LOCURA...!' : '¡GENERAR EXCUSA!'}
              </span>
              <Sparkles
                className={`w-6 h-6 sm:w-8 sm:h-8 text-black fill-yellow-200 ${
                  isSpinning ? 'animate-bounce' : 'group-hover:scale-125 transition-transform'
                }`}
              />
            </div>

            <p className="text-xs sm:text-sm font-extrabold tracking-normal text-black/85 lowercase first-letter:uppercase">
              {isSpinning
                ? '🎰 Calibrando multiverso y conspiraciones...'
                : 'Mezclar personaje + situación insólita + desenlace'}
            </p>
          </div>
        </button>
      </div>

      {/* Keyboard Shortcut Help */}
      <div className="mt-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span className="hidden sm:inline">
          Tip: Podés presionar la tecla{' '}
          <kbd className="px-1.5 py-0.5 text-[11px] font-mono bg-white dark:bg-slate-800 border-2 border-black rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            Espacio
          </kbd>{' '}
          o{' '}
          <kbd className="px-1.5 py-0.5 text-[11px] font-mono bg-white dark:bg-slate-800 border-2 border-black rounded-md shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            Enter
          </kbd>{' '}
          en cualquier momento.
        </span>
      </div>
    </div>
  );
};
