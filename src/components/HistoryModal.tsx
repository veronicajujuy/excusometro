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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-slate-900 border-4 border-black rounded-3xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b-2 border-black bg-amber-200 dark:bg-amber-950/70">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-black dark:text-amber-300" />
            <h2 className="font-arcade text-lg sm:text-xl text-black dark:text-white uppercase tracking-wide">
              Historial de Excusas ({history.length})
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

        {/* Filter bar */}
        <div className="flex items-center justify-between p-3 px-5 border-b-2 border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playClickSound();
                setFilterFavorites(false);
              }}
              className={`px-3 py-1 font-bold rounded-lg border-2 transition-all ${
                !filterFavorites
                  ? 'bg-black text-white border-black'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-black/30'
              }`}
            >
              Todas ({history.length})
            </button>
            <button
              onClick={() => {
                playClickSound();
                setFilterFavorites(true);
              }}
              className={`px-3 py-1 font-bold rounded-lg border-2 transition-all flex items-center gap-1 ${
                filterFavorites
                  ? 'bg-amber-300 text-black border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-black/30'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
              Favoritas ({history.filter((h) => h.isFavorite).length})
            </button>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => {
                playClickSound();
                onClearHistory();
              }}
              className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Borrar Todo
            </button>
          )}
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {displayedList.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-4xl mb-2">🎲</p>
              <p className="font-bold text-slate-600 dark:text-slate-300">
                {filterFavorites
                  ? 'No marcaste ninguna excusa como favorita todavía.'
                  : 'Aún no generaste ninguna excusa en esta sesión.'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Apretá el botón gigante para empezar a crear obras de arte.
              </p>
            </div>
          ) : (
            displayedList.map((item) => {
              const isCopied = copiedId === item.id;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border-2 border-black bg-white dark:bg-slate-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-50/50 dark:hover:bg-slate-750 transition-all flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      "{item.character.emoji} {item.character.text}{' '}
                      {item.situation.emoji} {item.situation.text},{' '}
                      {item.ending.emoji} {item.ending.text}."
                    </p>

                    <button
                      onClick={() => onToggleFavorite(item.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-amber-500 transition-colors shrink-0"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          item.isFavorite
                            ? 'text-amber-500 fill-amber-400'
                            : 'text-slate-400'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-2">
                    <span className="font-semibold text-[11px]">
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' · '}
                      <span className="text-amber-600 dark:text-amber-400 font-bold">
                        {item.absurdityScore}% Absurdo
                      </span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(item)}
                        className="px-2.5 py-1 rounded-md border border-black bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Copiada</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          onSelectExcuse(item);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-md border border-black bg-yellow-300 text-black font-bold text-[11px] hover:bg-yellow-400 cursor-pointer"
                      >
                        Cargar en Tablero
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
