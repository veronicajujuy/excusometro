import React, { useState } from 'react';
import {
  Copy,
  Check,
  Volume2,
  VolumeX,
  Star,
  Send,
} from 'lucide-react';
import {
  GeneratedExcuse,
  RECIPIENTS,
  RecipientPreset,
  calculateAbsurdity,
} from '../data/excusesData';
import { speakExcuse, stopSpeaking, playClickSound, playBoing } from '../utils/audio';

interface ExcuseDisplayProps {
  excuse: GeneratedExcuse | null;
  selectedRecipient: RecipientPreset;
  onSelectRecipient: (recipient: RecipientPreset) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
}

export const ExcuseDisplay: React.FC<ExcuseDisplayProps> = ({
  excuse,
  selectedRecipient,
  onSelectRecipient,
  onToggleFavorite,
  isFavorite,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!excuse) return null;

  const currentExcuse = excuse;
  const metrics = calculateAbsurdity(
    currentExcuse.character,
    currentExcuse.situation,
    currentExcuse.ending
  );

  const formattedFullText = `${selectedRecipient.prefix}${currentExcuse.character.text} ${currentExcuse.situation.text}, ${currentExcuse.ending.text}.${selectedRecipient.suffix}`;

  const handleCopy = async () => {
    playClickSound();
    try {
      await navigator.clipboard.writeText(formattedFullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    playClickSound();
    const encoded = encodeURIComponent(`🚨 MI EXCUSA PARA LLEGAR TARDE:\n\n"${formattedFullText}"`);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      playClickSound();
      setIsSpeaking(true);
      const success = speakExcuse(
        formattedFullText,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
      if (!success) {
        setIsSpeaking(false);
      }
    }
  };

  const handleFavoriteClick = () => {
    playBoing();
    onToggleFavorite(currentExcuse.id);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-sm transition-all">
      {/* Recipient Segmented Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Destinatario:
        </span>

        {/* Clean Segmented Buttons */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          {RECIPIENTS.map((rec) => {
            const isActive = rec.id === selectedRecipient.id;
            return (
              <button
                key={rec.id}
                onClick={() => {
                  playClickSound();
                  onSelectRecipient(rec);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{rec.emoji}</span>
                <span>{rec.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* The Excuse Text */}
      <div className="py-2">
        <p className="text-xs text-slate-400 mb-2">Mensaje generado:</p>
        <blockquote className="text-lg sm:text-xl md:text-2xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
          <span className="text-slate-400 italic font-normal">"{selectedRecipient.prefix}</span>
          <span className="font-semibold text-slate-950 dark:text-white underline decoration-amber-300 dark:decoration-amber-500 underline-offset-4">
            {currentExcuse.character.text}
          </span>{' '}
          <span className="font-semibold text-slate-950 dark:text-white underline decoration-rose-300 dark:decoration-rose-500 underline-offset-4">
            {currentExcuse.situation.text}
          </span>
          {', '}
          <span className="font-semibold text-slate-950 dark:text-white underline decoration-teal-300 dark:decoration-teal-500 underline-offset-4">
            {currentExcuse.ending.text}
          </span>
          .<span className="text-slate-400 italic font-normal"> {selectedRecipient.suffix}"</span>
        </blockquote>
      </div>

      {/* Clean Metadata Line */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-rose-500">
            {metrics.absurdity}% absurdo
          </span>
          <span>·</span>
          <span>{metrics.risk}</span>
        </div>

        <button
          onClick={handleFavoriteClick}
          className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-amber-500 transition-colors cursor-pointer"
          title="Guardar en favoritas"
        >
          <Star
            className={`w-3.5 h-3.5 ${
              isFavorite ? 'fill-amber-400 text-amber-500' : ''
            }`}
          />
          <span>{isFavorite ? 'Guardada' : 'Guardar'}</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 mt-5">
        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copiada al portapapeles' : 'Copiar excusa'}</span>
        </button>

        <button
          onClick={handleWhatsAppShare}
          className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 bg-[#25D366] text-white hover:bg-[#20ba59] transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Enviar por WhatsApp</span>
        </button>

        <button
          onClick={handleToggleSpeech}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer ${
            isSpeaking ? 'text-rose-500 border-rose-300' : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>Detener</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>Escuchar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
