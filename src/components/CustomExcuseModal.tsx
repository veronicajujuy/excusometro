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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Personalizar Ruleta
            </h2>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Slot Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              ¿Qué parte querés sumar?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'character', label: 'Personaje', emoji: '🦹' },
                { type: 'situation', label: 'Situación', emoji: '⚔️' },
                { type: 'ending', label: 'Desenlace', emoji: '🏃' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => {
                    playClickSound();
                    setTargetType(item.type as 'character' | 'situation' | 'ending');
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all border ${
                    targetType === item.type
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Texto del disparate:
            </label>
            <textarea
              required
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                targetType === 'character'
                  ? 'Ej: Un pingüino con chaleco y patines...'
                  : targetType === 'situation'
                  ? 'Ej: me desafió a cantar en el subte...'
                  : 'Ej: y tuve que fingir demencia hasta llegar...'
              }
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Emoji Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Emoji:
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
              {quickEmojis.map((e) => (
                <button
                  type="button"
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all ${
                    emoji === e
                      ? 'bg-white dark:bg-slate-700 shadow-xs scale-110'
                      : 'hover:bg-white/60 dark:hover:bg-slate-700/60'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!text.trim() || addedSuccess}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              addedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Agregado con éxito!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Agregar a la ruleta</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
