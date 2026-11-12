import React, { useState } from 'react';
import {
  Copy,
  Check,
  Share2,
  Volume2,
  VolumeX,
  Star,
  Quote,
  Flame,
  AlertTriangle,
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

  // Build the tailored full text based on the selected recipient preset
  const formattedFullText = `${selectedRecipient.prefix}${currentExcuse.character.text} ${currentExcuse.situation.text}, ${currentExcuse.ending.text}.${selectedRecipient.suffix}`;

  const handleCopy = async () => {
    playClickSound();
    try {
      await navigator.clipboard.writeText(formattedFullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleWhatsAppShare = () => {
    playClickSound();
    const encoded = encodeURIComponent(`🚨 MI EXCUSA PARA LLEGAR TARDE:\n\n"${formattedFullText}"\n\n(Generado con el Generador de Excusas Absurdas)`);
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
    <div className="w-full max-w-4xl mx-auto my-6 bg-white dark:bg-slate-900 border-4 border-black dark:border-slate-700 rounded-3xl p-5 sm:p-7 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] transition-all">
      {/* Recipient Selector Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black/10 dark:border-white/10 pb-4 mb-5">
        <div>
          <span className="text-xs uppercase font-extrabold text-slate-500 dark:text-slate-400 block tracking-wider">
            ¿A quién va dirigida la excusa?
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Adaptá el tono de formalidad automáticamente:
          </p>
        </div>

        {/* Interactive Segmented Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border-2 border-black">
          {RECIPIENTS.map((rec) => {
            const isActive = rec.id === selectedRecipient.id;
            return (
              <button
                key={rec.id}
                onClick={() => {
                  playClickSound();
                  onSelectRecipient(rec);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-yellow-300 dark:bg-yellow-400 text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-102'
                    : 'bg-transparent text-slate-700 dark:text-slate-300 border-transparent hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <span>{rec.emoji}</span>
                <span>{rec.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Excuse Quote Showcase */}
      <div className="relative my-4 p-5 sm:p-7 bg-[#FFFEEA] dark:bg-slate-950/60 rounded-2xl border-3 border-black dark:border-slate-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
        <Quote className="absolute top-3 left-3 w-8 h-8 text-black/10 dark:text-white/10 pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 italic">
            "{selectedRecipient.prefix}..."
          </p>

          <div className="text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-950 dark:text-white leading-relaxed font-display">
            <span className="bg-amber-200 dark:bg-amber-900/60 text-slate-950 dark:text-amber-200 px-2 py-0.5 rounded-lg border-2 border-black inline-block m-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {currentExcuse.character.emoji} {currentExcuse.character.text}
            </span>{' '}
            <span className="bg-pink-200 dark:bg-pink-900/60 text-slate-950 dark:text-pink-200 px-2 py-0.5 rounded-lg border-2 border-black inline-block m-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {currentExcuse.situation.emoji} {currentExcuse.situation.text}
            </span>
            ,{' '}
            <span className="bg-emerald-200 dark:bg-emerald-900/60 text-slate-950 dark:text-emerald-200 px-2 py-0.5 rounded-lg border-2 border-black inline-block m-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {currentExcuse.ending.emoji} {currentExcuse.ending.text}
            </span>
            .
          </div>

          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 italic pt-1">
            "...{selectedRecipient.suffix}"
          </p>
        </div>
      </div>

      {/* Absurdity & Risk Meter */}
      <div className="my-5 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border-2 border-black grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Metric 1: Absurdity Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              Nivel de Absurdo:
            </span>
            <span className="font-arcade text-amber-600 dark:text-amber-400 text-sm">
              {metrics.absurdity}%
            </span>
          </div>
          <div className="w-full h-3.5 bg-slate-200 dark:bg-slate-700 rounded-full border-2 border-black overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-rose-600 rounded-full transition-all duration-700"
              style={{ width: `${metrics.absurdity}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Credibility */}
        <div>
          <div className="flex justify-between items-center text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
            <span>Credibilidad esperada:</span>
            <span className="font-arcade text-blue-600 dark:text-blue-400 text-sm">
              {metrics.credibility}%
            </span>
          </div>
          <div className="w-full h-3.5 bg-slate-200 dark:bg-slate-700 rounded-full border-2 border-black overflow-hidden p-0.5">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.max(4, metrics.credibility * 4)}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Danger / Risk Verdict */}
        <div className="flex items-start gap-2 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100 block">
              {metrics.risk}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px] leading-tight block">
              {metrics.verdict}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t-2 border-black/10 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`px-4 py-2.5 rounded-xl border-2 border-black font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all ${
              copied
                ? 'bg-emerald-400 text-black shadow-none translate-y-0.5'
                : 'bg-white dark:bg-slate-800 text-black dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '¡Excusa Copiada!' : 'Copiar Texto'}</span>
          </button>

          {/* WhatsApp Share Button */}
          <button
            onClick={handleWhatsAppShare}
            className="px-4 py-2.5 rounded-xl border-2 border-black font-bold text-xs sm:text-sm flex items-center gap-2 bg-[#25D366] text-black hover:bg-[#20ba59] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Enviar por WhatsApp</span>
          </button>

          {/* Text-to-Speech Narrator Button */}
          <button
            onClick={handleToggleSpeech}
            className={`px-4 py-2.5 rounded-xl border-2 border-black font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all ${
              isSpeaking
                ? 'bg-rose-500 text-white animate-pulse shadow-none'
                : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-950 dark:text-indigo-200 hover:bg-indigo-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Detener Voz</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Escuchar en Voz Alta</span>
              </>
            )}
          </button>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          title={isFavorite ? 'Quitar de favoritos' : 'Guardar en mis excusas favoritas'}
          className={`p-2.5 rounded-xl border-2 border-black cursor-pointer transition-all flex items-center gap-1.5 text-xs font-bold ${
            isFavorite
              ? 'bg-amber-300 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none'
          }`}
        >
          <Star
            className={`w-4 h-4 ${
              isFavorite ? 'text-amber-600 fill-amber-500' : 'text-slate-400'
            }`}
          />
          <span className="hidden sm:inline">
            {isFavorite ? '¡Guardada!' : 'Favorita'}
          </span>
        </button>
      </div>
    </div>
  );
};
