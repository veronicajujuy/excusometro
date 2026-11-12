import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  CHARACTERS,
  SITUATIONS,
  ENDINGS,
  RECIPIENTS,
  ExcuseComponent,
  RecipientPreset,
  GeneratedExcuse,
  calculateAbsurdity,
} from './data/excusesData';
import { SlotCard } from './components/SlotCard';
import { BigSpinButton } from './components/BigSpinButton';
import { ExcuseDisplay } from './components/ExcuseDisplay';
import { Header } from './components/Header';
import { HistoryModal } from './components/HistoryModal';
import { CustomExcuseModal } from './components/CustomExcuseModal';
import {
  playClickSound,
  playSpinTick,
  playSlamSound,
  playFanfare,
  setMuted,
} from './utils/audio';

export default function App() {
  const [characterPool, setCharacterPool] = useState<ExcuseComponent[]>(CHARACTERS);
  const [situationPool, setSituationPool] = useState<ExcuseComponent[]>(SITUATIONS);
  const [endingPool, setEndingPool] = useState<ExcuseComponent[]>(ENDINGS);

  const [character, setCharacter] = useState<ExcuseComponent>(CHARACTERS[0]);
  const [situation, setSituation] = useState<ExcuseComponent>(SITUATIONS[0]);
  const [ending, setEnding] = useState<ExcuseComponent>(ENDINGS[0]);

  const [displayChar, setDisplayChar] = useState<ExcuseComponent>(CHARACTERS[0]);
  const [displaySit, setDisplaySit] = useState<ExcuseComponent>(SITUATIONS[0]);
  const [displayEnd, setDisplayEnd] = useState<ExcuseComponent>(ENDINGS[0]);

  const [locked, setLocked] = useState({
    character: false,
    situation: false,
    ending: false,
  });

  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningSlots, setSpinningSlots] = useState({
    character: false,
    situation: false,
    ending: false,
  });

  const [recipient, setRecipient] = useState<RecipientPreset>(RECIPIENTS[0]);
  const [currentExcuse, setCurrentExcuse] = useState<GeneratedExcuse | null>(null);

  const [history, setHistory] = useState<GeneratedExcuse[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const spinIntervalRef = useRef<{
    char?: NodeJS.Timeout;
    sit?: NodeJS.Timeout;
    end?: NodeJS.Timeout;
    tick?: NodeJS.Timeout;
  }>({});

  useEffect(() => {
    const savedTheme = localStorage.getItem('excuses_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(shouldDark);
    if (shouldDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const savedMute = localStorage.getItem('excuses_muted');
    if (savedMute !== null) {
      const muted = savedMute === 'true';
      setIsAudioMuted(muted);
      setMuted(muted);
    }

    try {
      const savedHistory = localStorage.getItem('excuses_history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch {
      // ignore
    }

    const initialChar = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    const initialSit = SITUATIONS[Math.floor(Math.random() * SITUATIONS.length)];
    const initialEnd = ENDINGS[Math.floor(Math.random() * ENDINGS.length)];

    setCharacter(initialChar);
    setSituation(initialSit);
    setEnding(initialEnd);
    setDisplayChar(initialChar);
    setDisplaySit(initialSit);
    setDisplayEnd(initialEnd);

    const initialMetrics = calculateAbsurdity(initialChar, initialSit, initialEnd);
    const initialExcuseObj: GeneratedExcuse = {
      id: `excuse_${Date.now()}`,
      timestamp: Date.now(),
      character: initialChar,
      situation: initialSit,
      ending: initialEnd,
      recipient: RECIPIENTS[0],
      fullText: `${RECIPIENTS[0].prefix}${initialChar.text} ${initialSit.text}, ${initialEnd.text}.${RECIPIENTS[0].suffix}`,
      absurdityScore: initialMetrics.absurdity,
      credibilityScore: initialMetrics.credibility,
      verdict: initialMetrics.verdict,
      isFavorite: false,
    };
    setCurrentExcuse(initialExcuseObj);
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      try {
        localStorage.setItem('excuses_history', JSON.stringify(history.slice(0, 50)));
      } catch {
        // quota
      }
    }
  }, [history]);

  const toggleDark = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('excuses_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('excuses_theme', 'light');
    }
    playClickSound();
  };

  const toggleMute = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    setMuted(nextMuted);
    localStorage.setItem('excuses_muted', String(nextMuted));
    if (!nextMuted) {
      playClickSound();
    }
  };

  const toggleLock = (slot: 'character' | 'situation' | 'ending') => {
    playClickSound();
    setLocked((prev) => ({ ...prev, [slot]: !prev[slot] }));
  };

  const spinExcuses = useCallback(() => {
    if (isSpinning) return;

    playClickSound();
    setIsSpinning(true);
    setSpinningSlots({
      character: !locked.character,
      situation: !locked.situation,
      ending: !locked.ending,
    });

    const nextChar = locked.character
      ? character
      : characterPool[Math.floor(Math.random() * characterPool.length)];
    const nextSit = locked.situation
      ? situation
      : situationPool[Math.floor(Math.random() * situationPool.length)];
    const nextEnd = locked.ending
      ? ending
      : endingPool[Math.floor(Math.random() * endingPool.length)];

    const tickInterval = setInterval(() => {
      playSpinTick();
    }, 90);
    spinIntervalRef.current.tick = tickInterval;

    if (!locked.character) {
      spinIntervalRef.current.char = setInterval(() => {
        setDisplayChar(characterPool[Math.floor(Math.random() * characterPool.length)]);
      }, 75);
    }

    if (!locked.situation) {
      spinIntervalRef.current.sit = setInterval(() => {
        setDisplaySit(situationPool[Math.floor(Math.random() * situationPool.length)]);
      }, 75);
    }

    if (!locked.ending) {
      spinIntervalRef.current.end = setInterval(() => {
        setDisplayEnd(endingPool[Math.floor(Math.random() * endingPool.length)]);
      }, 75);
    }

    setTimeout(() => {
      if (!locked.character) {
        clearInterval(spinIntervalRef.current.char);
        setCharacter(nextChar);
        setDisplayChar(nextChar);
        playSlamSound(0);
        setSpinningSlots((prev) => ({ ...prev, character: false }));
      }
    }, 400);

    setTimeout(() => {
      if (!locked.situation) {
        clearInterval(spinIntervalRef.current.sit);
        setSituation(nextSit);
        setDisplaySit(nextSit);
        playSlamSound(1);
        setSpinningSlots((prev) => ({ ...prev, situation: false }));
      }
    }, 750);

    setTimeout(() => {
      if (!locked.ending) {
        clearInterval(spinIntervalRef.current.end);
        setEnding(nextEnd);
        setDisplayEnd(nextEnd);
        playSlamSound(2);
        setSpinningSlots((prev) => ({ ...prev, ending: false }));
      }

      clearInterval(spinIntervalRef.current.tick);
      setIsSpinning(false);
      playFanfare();

      confetti({
        particleCount: 40,
        spread: 55,
        origin: { y: 0.65 },
        colors: ['#F59E0B', '#F43F5E', '#14B8A6'],
      });

      const metrics = calculateAbsurdity(nextChar, nextSit, nextEnd);
      const newExcuse: GeneratedExcuse = {
        id: `excuse_${Date.now()}`,
        timestamp: Date.now(),
        character: nextChar,
        situation: nextSit,
        ending: nextEnd,
        recipient,
        fullText: `${recipient.prefix}${nextChar.text} ${nextSit.text}, ${nextEnd.text}.${recipient.suffix}`,
        absurdityScore: metrics.absurdity,
        credibilityScore: metrics.credibility,
        verdict: metrics.verdict,
        isFavorite: false,
      };

      setCurrentExcuse(newExcuse);
      setHistory((prev) => [newExcuse, ...prev.slice(0, 49)]);
    }, 1100);
  }, [
    isSpinning,
    locked,
    character,
    situation,
    ending,
    characterPool,
    situationPool,
    endingPool,
    recipient,
  ]);

  const handleSingleReroll = (slot: 'character' | 'situation' | 'ending') => {
    if (isSpinning) return;
    playClickSound();

    let newChar = character;
    let newSit = situation;
    let newEnd = ending;

    if (slot === 'character') {
      const filtered = characterPool.filter((c) => c.id !== character.id);
      newChar = filtered[Math.floor(Math.random() * filtered.length)] || character;
      setCharacter(newChar);
      setDisplayChar(newChar);
      playSlamSound(0);
    } else if (slot === 'situation') {
      const filtered = situationPool.filter((s) => s.id !== situation.id);
      newSit = filtered[Math.floor(Math.random() * filtered.length)] || situation;
      setSituation(newSit);
      setDisplaySit(newSit);
      playSlamSound(1);
    } else {
      const filtered = endingPool.filter((e) => e.id !== ending.id);
      newEnd = filtered[Math.floor(Math.random() * filtered.length)] || ending;
      setEnding(newEnd);
      setDisplayEnd(newEnd);
      playSlamSound(2);
    }

    const metrics = calculateAbsurdity(newChar, newSit, newEnd);
    const updatedExcuse: GeneratedExcuse = {
      id: `excuse_${Date.now()}`,
      timestamp: Date.now(),
      character: newChar,
      situation: newSit,
      ending: newEnd,
      recipient,
      fullText: `${recipient.prefix}${newChar.text} ${newSit.text}, ${newEnd.text}.${recipient.suffix}`,
      absurdityScore: metrics.absurdity,
      credibilityScore: metrics.credibility,
      verdict: metrics.verdict,
      isFavorite: false,
    };
    setCurrentExcuse(updatedExcuse);
    setHistory((prev) => [updatedExcuse, ...prev.slice(0, 49)]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        isHistoryOpen ||
        isCustomOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        spinExcuses();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spinExcuses, isHistoryOpen, isCustomOpen]);

  const handleToggleFavorite = (id: string) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
    if (currentExcuse && currentExcuse.id === id) {
      setCurrentExcuse({ ...currentExcuse, isFavorite: !currentExcuse.isFavorite });
    }
  };

  const handleSelectFromHistory = (item: GeneratedExcuse) => {
    setCharacter(item.character);
    setSituation(item.situation);
    setEnding(item.ending);
    setDisplayChar(item.character);
    setDisplaySit(item.situation);
    setDisplayEnd(item.ending);
    setRecipient(item.recipient);
    setCurrentExcuse(item);
    playSlamSound(1);
  };

  const handleAddCustomItem = (
    type: 'character' | 'situation' | 'ending',
    item: ExcuseComponent
  ) => {
    if (type === 'character') {
      setCharacterPool((prev) => [item, ...prev]);
      setCharacter(item);
      setDisplayChar(item);
    } else if (type === 'situation') {
      setSituationPool((prev) => [item, ...prev]);
      setSituation(item);
      setDisplaySit(item);
    } else {
      setEndingPool((prev) => [item, ...prev]);
      setEnding(item);
      setDisplayEnd(item);
    }

    setTimeout(() => {
      confetti({ particleCount: 30, spread: 45, origin: { y: 0.6 } });
    }, 100);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('excuses_history');
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenCustom={() => setIsCustomOpen(true)}
        isMuted={isAudioMuted}
        onToggleMute={toggleMute}
        isDark={isDark}
        onToggleDark={toggleDark}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center">
        {/* Minimal Hero */}
        <div className="text-center max-w-xl mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            Generador de Excusas
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Combiná al azar un personaje, una situación y un final absurdo para llegar tarde.
          </p>
        </div>

        {/* 3 Slot Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-4">
          <SlotCard
            index={0}
            label="01. Personaje"
            sublabel="¿Quién fue?"
            accentColor="yellow"
            item={character}
            displayItem={displayChar}
            isSpinning={spinningSlots.character}
            isLocked={locked.character}
            onToggleLock={() => toggleLock('character')}
            onSingleReroll={() => handleSingleReroll('character')}
          />

          <SlotCard
            index={1}
            label="02. Situación"
            sublabel="¿Qué pasó?"
            accentColor="pink"
            item={situation}
            displayItem={displaySit}
            isSpinning={spinningSlots.situation}
            isLocked={locked.situation}
            onToggleLock={() => toggleLock('situation')}
            onSingleReroll={() => handleSingleReroll('situation')}
          />

          <SlotCard
            index={2}
            label="03. Desenlace"
            sublabel="¿Por qué la demora?"
            accentColor="cyan"
            item={ending}
            displayItem={displayEnd}
            isSpinning={spinningSlots.ending}
            isLocked={locked.ending}
            onToggleLock={() => toggleLock('ending')}
            onSingleReroll={() => handleSingleReroll('ending')}
          />
        </div>

        {/* Big tactile spin button */}
        <BigSpinButton onClick={spinExcuses} isSpinning={isSpinning} />

        {/* Current Excuse Display */}
        {currentExcuse && (
          <ExcuseDisplay
            excuse={currentExcuse}
            selectedRecipient={recipient}
            onSelectRecipient={(r) => {
              setRecipient(r);
              setCurrentExcuse((prev) =>
                prev
                  ? {
                      ...prev,
                      recipient: r,
                      fullText: `${r.prefix}${prev.character.text} ${prev.situation.text}, ${prev.ending.text}.${r.suffix}`,
                    }
                  : null
              );
            }}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={
              history.find((h) => h.id === currentExcuse.id)?.isFavorite || false
            }
          />
        )}
      </main>

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectExcuse={handleSelectFromHistory}
        onToggleFavorite={handleToggleFavorite}
        onClearHistory={handleClearHistory}
      />

      <CustomExcuseModal
        isOpen={isCustomOpen}
        onClose={() => setIsCustomOpen(false)}
        onAddCustomItem={handleAddCustomItem}
      />

      <footer className="w-full border-t border-slate-200/70 dark:border-slate-800/70 py-4 text-center text-xs text-slate-400">
        <p>Excusatrón · Combinaciones aleatorias para salir de cualquier apuro</p>
      </footer>
    </div>
  );
}
