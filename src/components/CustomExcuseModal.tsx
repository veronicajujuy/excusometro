import React, { useState } from 'react';
import { X, Plus, Sparkles, Check } from 'lucide-react';
import { ExcuseComponent } from '../data/excusesData';
import { playClickSound, playFanfare } from '../utils/audio';

interface CustomExcuseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomItem: (type: 'character' | 'situation' | 'ending', item: ExcuseComponent) => void;
}

export const CustomExcuseModal: React.FC<CustomExcuseModalProps> = ({
  isOpen,
  onClose,
  onAddCustomItem,
}) => {
  const [targetType, setTargetType] = useState<'character' | 'situation' | 'ending'>('character');
  const [text, setText] = useState('');
  const [emoji, setEmoji] = useState('🛸');
  const [tag, setTag] = useState('Personalizado');
  const [intensity, setIntensity] = useState(4);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen) return null;

  const quickEmojis = ['🛸', '🦝', '🦖', '🍕', '🧙‍♂️', '🤖', '🦄', '🧉', '🦙', '🥑', '👾', '🔥'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    playFanfare();
    const newItem: ExcuseComponent = {
      id: `custom_${Date.now()}`,
      text: text.trim(),
      emoji: emoji || '✨',
      tag: tag.trim() || 'Personalizado',
      intensity,
    };

    onAddCustomItem(targetType, newItem);
    setAddedSuccess(true);
    setText('');
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border-4 border-black rounded-3xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b-2 border-black bg-pink-300 dark:bg-pink-950/70">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-black dark:text-pink-300" />
            <h2 className="font-arcade text-lg sm:text-xl text-black dark:text-white uppercase tracking-wide">
              Sumar Tu Propio Disparate
            </h2>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-xl border-2 border-black bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5 text-black dark:text-white" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* Slot Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              ¿Qué tipo de elemento querés agregar?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'character', label: '1. Personaje', emoji: '🦹' },
                { type: 'situation', label: '2. Situación', emoji: '⚔️' },
                { type: 'ending', label: '3. Desenlace', emoji: '🏃' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => {
                    playClickSound();
                    setTargetType(item.type as 'character' | 'situation' | 'ending');
                  }}
                  className={`py-2 px-2 rounded-xl border-2 border-black font-bold text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    targetType === item.type
                      ? 'bg-yellow-300 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-102'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <span className="text-base">{item.emoji}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Texto del Disparate:
            </label>
            <textarea
              required
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                targetType === 'character'
                  ? 'Ej: Un pingüino con chaleco de fuerza y rollers...'
                  : targetType === 'situation'
                  ? 'Ej: me desafió a cantar karaoke en el vagón del subte...'
                  : 'Ej: y tuve que fingir demencia hasta llegar a la esquina...'
              }
              className="w-full p-3 rounded-xl border-2 border-black bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Emoji Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Elegí un Emoji Representativo:
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl border-2 border-black">
              {quickEmojis.map((e) => (
                <button
                  type="button"
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`w-9 h-9 rounded-lg border text-lg flex items-center justify-center transition-transform ${
                    emoji === e
                      ? 'bg-yellow-300 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-110'
                      : 'border-transparent hover:bg-white dark:hover:bg-slate-700'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Intensity Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span>Nivel de Absurdo:</span>
              <span className="font-arcade text-pink-600 dark:text-pink-400">
                {intensity} / 5
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!text.trim() || addedSuccess}
            className={`w-full py-3.5 px-4 rounded-2xl border-3 border-black font-arcade text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              addedSuccess
                ? 'bg-emerald-400 text-black shadow-none'
                : 'bg-yellow-300 hover:bg-yellow-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none'
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-5 h-5 text-black" />
                <span>¡Agregado al Tablero!</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 text-black" />
                <span>Incorporar a la Ruleta</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
