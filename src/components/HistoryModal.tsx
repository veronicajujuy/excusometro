import React, { useState } from 'react';
import { X, Star, Copy, Check, Clock, Trash2 } from 'lucide-react';
import { GeneratedExcuse } from '../data/excusesData';
import { playClickSound } from '../utils/audio';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: GeneratedExcuse[];
  onSelectExcuse: (excuse: GeneratedExcuse) => void;
  onToggleFavorite: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectExcuse,
  onToggleFavorite,
  onClearHistory,
}) => {
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const displayedList = filterFavorites
    ? history.filter((item) => item.isFavorite)
    : history;

  const handleCopy = async (item: GeneratedExcuse) => {
    playClickSound();
    try {
      await navigator.clipboard.writeText(item.fullText);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-xl max-h-[80vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 px-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h2 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Historial ({history.length})
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

        {/* Filter bar */}
        <div className="flex items-center justify-between p-3 px-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                playClickSound();
                setFilterFavorites(false);
              }}
              className={`px-2.5 py-1 font-semibold rounded-md transition-colors ${
                !filterFavorites
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              Todas ({history.length})
            </button>
            <button
              onClick={() => {
                playClickSound();
                setFilterFavorites(true);
              }}
              className={`px-2.5 py-1 font-semibold rounded-md transition-colors flex items-center gap-1 ${
                filterFavorites
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              Favoritas ({history.filter((h) => h.isFavorite).length})
            </button>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => {
                playClickSound();
                onClearHistory();
              }}
              className="text-slate-400 hover:text-rose-500 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Limpiar</span>
            </button>
          )}
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {displayedList.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <p className="text-2xl mb-1">🎲</p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {filterFavorites
                  ? 'No hay excusas guardadas como favoritas.'
                  : 'Aún no se generaron excusas.'}
              </p>
            </div>
          ) : (
            displayedList.map((item) => {
              const isCopied = copiedId === item.id;
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 transition-colors flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-slate-800 dark:text-slate-200 leading-snug">
                      "{item.character.emoji} {item.character.text}{' '}
                      {item.situation.emoji} {item.situation.text},{' '}
                      {item.ending.emoji} {item.ending.text}."
                    </p>

                    <button
                      onClick={() => onToggleFavorite(item.id)}
                      className="p-1 text-slate-400 hover:text-amber-500 transition-colors shrink-0 cursor-pointer"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          item.isFavorite
                            ? 'text-amber-500 fill-amber-400'
                            : ''
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                    <span className="text-[11px]">
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' · '}
                      <span className="text-amber-600 dark:text-amber-400 font-medium">
                        {item.absurdityScore}%
                      </span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(item)}
                        className="px-2 py-0.5 rounded text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? 'Copiada' : 'Copiar'}</span>
                      </button>

                      <button
                        onClick={() => {
                          onSelectExcuse(item);
                          onClose();
                        }}
                        className="px-2 py-0.5 rounded text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer"
                      >
                        Cargar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
