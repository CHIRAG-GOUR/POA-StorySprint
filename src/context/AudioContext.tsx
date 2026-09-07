import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface AudioContextType {
  isMuted: boolean;
  isAmbiencePlaying: boolean;
  toggleMute: () => void;
  toggleAmbience: () => void;
  playTap: () => void;
  playBatonPass: () => void;
  playTwistSpin: () => void;
  playAchievement: () => void;
  playFanfare: () => void;
  playVote: () => void;
  playLevelSelect: () => void;
  playCharacterSound: (heroId: string, customUrl?: string, startTime?: number, duration?: number) => void;
  stopCharacterSound: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isAmbiencePlaying, setIsAmbiencePlaying] = useState(false);
  const [isThemePlaying, setIsThemePlaying] = useState(false);
  const [currentThemeHeroId, setCurrentThemeHeroId] = useState<string | null>(null);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambienceTimerRef = useRef<number | null>(null);
  const currentThemeAudioRef = useRef<HTMLAudioElement | null>(null);
  const themeTimeoutRef = useRef<any>(null);
  const themeFadeIntervalRef = useRef<any>(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtxRef.current = new AudioCtxClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const playTap = () => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(340, ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch {
      // Ignore audio failure gracefully
    }
  };

  const playLevelSelect = () => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const freqs = [392, 523.25, 659.25]; // G4, C5, E5
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.28);
      });
    } catch {
      // Ignore
    }
  };

  const playBatonPass = () => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.35);
      });
    } catch {
      // Ignore audio failure gracefully
    }
  };

  const playTwistSpin = () => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(750, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch {
      // Ignore audio failure gracefully
    }
  };

  const playAchievement = () => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.4);
      });
    } catch {
      // Ignore
    }
  };

  const playFanfare = () => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const chords = [
        [523.25, 659.25, 783.99], // C
        [587.33, 739.99, 880.00], // D
        [659.25, 830.61, 987.77], // E
        [1046.50, 1318.51, 1567.98] // Grand C
      ];
      chords.forEach((chord, step) => {
        const time = ctx.currentTime + step * 0.2;
        chord.forEach(f => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, time);
          gain.gain.setValueAtTime(0.14, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + (step === 3 ? 1.2 : 0.22));
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(time);
          osc.stop(time + (step === 3 ? 1.2 : 0.22));
        });
      });
    } catch {
      // Ignore
    }
  };

  const playVote = () => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // Ignore
    }
  };

  const stopCharacterSound = () => {
    if (themeTimeoutRef.current) {
      clearTimeout(themeTimeoutRef.current);
      themeTimeoutRef.current = null;
    }
    if (themeFadeIntervalRef.current) {
      clearInterval(themeFadeIntervalRef.current);
      themeFadeIntervalRef.current = null;
    }
    if (currentThemeAudioRef.current) {
      currentThemeAudioRef.current.ontimeupdate = null;
      currentThemeAudioRef.current.onended = null;
      currentThemeAudioRef.current.pause();
      currentThemeAudioRef.current.currentTime = 0;
      currentThemeAudioRef.current.src = '';
      currentThemeAudioRef.current = null;
    }
  };

  const playCharacterSound = (heroId: string, customUrl?: string, startTime?: number) => {
    if (isMuted) return;
    stopCharacterSound();

    const trackMap: Record<string, { url: string; start: number }> = {
      'hero-naruto': { url: '/assets/audio/naruto_theme.mp3', start: 0 },
      'hero-goku': { url: '/assets/audio/goku_theme.mp3', start: 0 },
      'hero-po': { url: '/assets/audio/po_theme.mp3', start: 2 },
      'hero-ironman': { url: '/assets/audio/theme_ironman.wav', start: 0 }
    };

    const config = trackMap[heroId] || { url: `/assets/audio/${heroId.replace('hero-', '')}_theme.mp3`, start: 0 };
    const trackUrl = customUrl || config.url;
    const startSec = startTime !== undefined ? startTime : config.start;
    
    try {
      const audio = new Audio(trackUrl);
      audio.volume = 0.50;
      audio.loop = true;
      currentThemeAudioRef.current = audio;

      const setStartTimeAndPlay = () => {
        if (startSec > 0) {
          try {
            audio.currentTime = startSec;
          } catch (err) {
            console.warn('Set currentTime note:', err);
          }
        }
        audio.play().catch(err => {
          console.warn('Playback error note:', err);
        });
      };

      // Loop restart at startSec offset if track ends
      audio.onended = () => {
        try {
          audio.currentTime = startSec;
          audio.play().catch(() => {});
        } catch {}
      };

      if (audio.readyState >= 1) {
        setStartTimeAndPlay();
      } else {
        audio.addEventListener('loadedmetadata', setStartTimeAndPlay, { once: true });
        audio.load();
      }

    } catch (e) {
      console.warn('Hero sound play error:', e);
    }
  };

  const toggleAmbience = () => {
    setIsAmbiencePlaying(prev => !prev);
  };

  return (
    <AudioContext.Provider
      value={{
        isMuted,
        isAmbiencePlaying,
        toggleMute,
        toggleAmbience,
        playTap,
        playLevelSelect,
        playBatonPass,
        playTwistSpin,
        playAchievement,
        playFanfare,
        playVote,
        playCharacterSound,
        stopCharacterSound
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
