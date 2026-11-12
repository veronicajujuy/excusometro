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
import { Sparkles, Shuffle, ShieldAlert, Dice5 } from 'lucide-react';

export default function App() {
  // Pools of excuse components (can be expanded by user)
  const [characterPool, setCharacterPool] = useState<ExcuseComponent[]>(CHARACTERS);
  const [situationPool, setSituationPool] = useState<ExcuseComponent[]>(SITUATIONS);
  const [endingPool, setEndingPool] = useState<ExcuseComponent[]>(ENDINGS);

  // Active chosen elements
  const [character, setCharacter] = useState<ExcuseComponent>(CHARACTERS[0]);
  const [situation, setSituation] = useState<ExcuseComponent>(SITUATIONS[0]);
  const [ending, setEnding] = useState<ExcuseComponent>(ENDINGS[0]);

  // Display elements during the spinning reel phase
  const [displayChar, setDisplayChar] = useState<ExcuseComponent>(CHARACTERS[0]);
  const [displaySit, setDisplaySit] = useState<ExcuseComponent>(SITUATIONS[0]);
  const [displayEnd, setDisplayEnd] = useState<ExcuseComponent>(ENDINGS[0]);

  // Locks for slots
  const [locked, setLocked] = useState({
    character: false,
    situation: false,
    ending: false,
  });

  // Reel spinning states
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningSlots, setSpinningSlots] = useState({
    character: false,
    situation: false,
    ending: false,
  });

  // Current recipient style
  const [recipient, setRecipient] = useState<RecipientPreset>(RECIPIENTS[0]);

  // Current Generated Excuse Object
  const [currentExcuse, setCurrentExcuse] = useState<GeneratedExcuse | null>(null);

  // History & Favorites
  const [history, setHistory] = useState<GeneratedExcuse[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  // Audio & Theme preferences
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Reel intervals reference
  const spinIntervalRef = useRef<{
    char?: NodeJS.Timeout;
    sit?: NodeJS.Timeout;
    end?: NodeJS.Timeout;
    tick?: NodeJS.Timeout;
  }>({});

  // Initialize theme, audio, and initial state on mount
  useEffect(() => {
    // Check dark mode preference
    const savedTheme = localStorage.getItem('excuses_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(shouldDark);
    if (shouldDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Check mute preference
    const savedMute = localStorage.getItem('excuses_muted');
    if (savedMute !== null) {
      const muted = savedMute === 'true';
      setIsAudioMuted(muted);
      setMuted(muted);
    }

    // Load history from localStorage
    try {
      const savedHistory = localStorage.getItem('excuses_history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch {
      // Ignore
    }

    // Pick an initial random combination to greet the user
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

  // Save history on changes
  useEffect(() => {
    if (history.length > 0) {
      try {
        localStorage.setItem('excuses_history', JSON.stringify(history.slice(0, 50)));
      } catch {
        // storage quota
      }
    }
  }, [history]);

  // Dark mode toggle
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

  // Mute toggle
  const toggleMute = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    setMuted(nextMuted);
    localStorage.setItem('excuses_muted', String(nextMuted));
    if (!nextMuted) {
      playClickSound();
    }
  };

  // Lock toggling
  const toggleLock = (slot: 'character' | 'situation' | 'ending') => {
    playClickSound();
    setLocked((prev) => ({ ...prev, [slot]: !prev[slot] }));
  };

  // The Big Spin Function!
  const spinExcuses = useCallback(() => {
    if (isSpinning) return;

    playClickSound();
    setIsSpinning(true);
    setSpinningSlots({
      character: !locked.character,
      situation: !locked.situation,
      ending: !locked.ending,
    });

    // Pick final targets from pools
    const nextChar = locked.character
      ? character
      : characterPool[Math.floor(Math.random() * characterPool.length)];
    const nextSit = locked.situation
      ? situation
      : situationPool[Math.floor(Math.random() * situationPool.length)];
    const nextEnd = locked.ending
      ? ending
      : endingPool[Math.floor(Math.random() * endingPool.length)];

    // Sound ticks interval during spinning
    const tickInterval = setInterval(() => {
      playSpinTick();
    }, 85);
    spinIntervalRef.current.tick = tickInterval;

    // Rapid shuffle interval for Character reel
    if (!locked.character) {
      spinIntervalRef.current.char = setInterval(() => {
        setDisplayChar(characterPool[Math.floor(Math.random() * characterPool.length)]);
      }, 70);
    }

    // Rapid shuffle interval for Situation reel
    if (!locked.situation) {
      spinIntervalRef.current.sit = setInterval(() => {
        setDisplaySit(situationPool[Math.floor(Math.random() * situationPool.length)]);
      }, 70);
    }

    // Rapid shuffle interval for Ending reel
    if (!locked.ending) {
      spinIntervalRef.current.end = setInterval(() => {
        setDisplayEnd(endingPool[Math.floor(Math.random() * endingPool.length)]);
      }, 70);
    }

    // Reel 1: Character stops at ~450ms
    setTimeout(() => {
      if (!locked.character) {
        clearInterval(spinIntervalRef.current.char);
        setCharacter(nextChar);
        setDisplayChar(nextChar);
        playSlamSound(0);
        setSpinningSlots((prev) => ({ ...prev, character: false }));
      }
    }, 450);

    // Reel 2: Situation stops at ~850ms
    setTimeout(() => {
      if (!locked.situation) {
        clearInterval(spinIntervalRef.current.sit);
        setSituation(nextSit);
        setDisplaySit(nextSit);
        playSlamSound(1);
        setSpinningSlots((prev) => ({ ...prev, situation: false }));
      }
    }, 850);

    // Reel 3: Ending stops at ~1250ms -> Reveal Finale!
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

      // Play victory fanfare!
      playFanfare();

      // Fire celebratory confetti burst!
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#FDE047', '#EC4899', '#38BDF8', '#10B981', '#A855F7'],
      });

      // Calculate final metrics and register in history
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
    }, 1250);
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

  // Single slot reroll
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

  // Keyboard shortcut for Space and Enter to spin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in input or modal is open
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

  // Toggle favorite on an excuse
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

  // Load an excuse from history back into the board
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

  // Add custom component created by user
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

    // Update current excuse
    setTimeout(() => {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    }, 100);
  };

  // Clear session history
  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('excuses_history');
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF0] dark:bg-slate-950 text-slate-900 dark:text-slate-100 bg-comic-dots transition-colors duration-200">
      {/* Top Bar following 3-zone contract */}
      <Header
        historyCount={history.length}
        favoritesCount={history.filter((h) => h.isFavorite).length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenFavorites={() => {
          setIsHistoryOpen(true);
        }}
        onOpenCustom={() => setIsCustomOpen(true)}
        onQuickSpin={spinExcuses}
        isMuted={isAudioMuted}
        onToggleMute={toggleMute}
        isDark={isDark}
        onToggleDark={toggleDark}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center">
        {/* Hero Banner Header */}
        <div className="text-center max-w-3xl mb-6 sm:mb-8 select-none">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-300 dark:bg-yellow-400/20 text-black dark:text-yellow-300 rounded-full border-2 border-black font-arcade text-xs uppercase font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-3 transform -rotate-1">
            <Sparkles className="w-3.5 h-3.5 fill-black dark:fill-yellow-300" />
            <span>Fábrica Cuántica de Justificaciones Irrefutables</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-950 dark:text-white uppercase leading-none font-display">
            ¿Llegaste Tarde? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 underline decoration-yellow-400 decoration-wavy decoration-3">
              Generá tu Excusa Absurda
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Combiná al azar un personaje delirante, una situación caótica y un
            desenlace inolvidable. ¡Apretá el botón y salvá tu honor!
          </p>
        </div>

        {/* 3 Interactive Slot Reels in Neo-Brutalist Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <SlotCard
            index={0}
            label="1. Personaje"
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
            label="2. Situación"
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
            label="3. Desenlace"
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

        {/* THE GIANT BUTTON! Centerpiece with vibrant colors and rich press animation */}
        <BigSpinButton onClick={spinExcuses} isSpinning={isSpinning} />

        {/* Quick Shuffle Tools Below Button */}
        <div className="flex items-center gap-3 my-2 text-xs font-bold text-slate-600 dark:text-slate-400">
          <button
            onClick={() => {
              playClickSound();
              setLocked({ character: false, situation: false, ending: false });
            }}
            disabled={!locked.character && !locked.situation && !locked.ending}
            className="px-2.5 py-1 rounded-lg border border-black/30 hover:border-black bg-white dark:bg-slate-800 disabled:opacity-40 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Shuffle className="w-3 h-3" />
            <span>Desbloquear Todos los Slots</span>
          </button>
        </div>

        {/* Full Generated Excuse Showcase Card */}
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

      {/* Modals */}
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

      {/* Clean Footer */}
      <footer className="w-full border-t-2 border-black/10 dark:border-white/10 py-5 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Excusatrón 3000 · Más de 15.000 combinaciones absurdas para salvar el día
          </span>
          <span className="text-[11px]">
            No nos responsabilizamos por despidos o caras de incredulidad.
          </span>
        </div>
      </footer>
    </div>
  );
}
