/**
 * Audio synthesizers using the browser's Web Audio API.
 * Works completely offline, zero external asset dependencies, zero latency.
 */

let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setMuted(muted: boolean) {
  isMuted = muted;
}

export function getIsMuted(): boolean {
  return isMuted;
}

/**
 * Snappy tactile pop click sound
 */
export function playClickSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.1);
}

/**
 * Rapid ticker for reel roll
 */
export function playSpinTick() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(540 + Math.random() * 80, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.045);
}

/**
 * Slam sound when a reel stops (pitch depends on slot index 0, 1, 2)
 */
export function playSlamSound(slotIndex: number = 0) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const baseFreq = [260, 340, 440][slotIndex] || 320;

  // Thud oscillator
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(baseFreq * 1.5, now);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, now + 0.15);

  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.18);
}

/**
 * Victorious arcade fanfare when excuse is generated
 */
export function playFanfare() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5 chord
  const now = ctx.currentTime;

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + i * 0.07);

    gain.gain.setValueAtTime(0, now);
    gain.gain.setValueAtTime(0.25, now + i * 0.07);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + i * 0.07);
    osc.stop(now + i * 0.07 + 0.38);
  });
}

/**
 * Cartoon boing / comic spring sound
 */
export function playBoing() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(680, now + 0.18);
  osc.frequency.exponentialRampToValueAtTime(320, now + 0.35);

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.4);
}

/**
 * Web Speech API text-to-speech dramatic narration in Spanish
 */
export function speakExcuse(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  window.speechSynthesis.cancel(); // Stop any previous speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = 1.05; // Slightly animated energetic pace
  utterance.pitch = 1.1; // Expressive cartoonish pitch

  // Try to find a Spanish voice if available
  const voices = window.speechSynthesis.getVoices();
  const esVoice = voices.find(v => v.lang.startsWith('es') || v.lang.includes('ES'));
  if (esVoice) {
    utterance.voice = esVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
