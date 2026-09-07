import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Volume2,
  CheckCircle2,
  Radio,
  Zap,
  Wind,
  Flame,
  Cpu,
  Shield,
  Target,
  Crosshair,
  Activity
} from 'lucide-react';
import { HERO_DECISIONS_MAP } from '../../data/storyData';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';
import { Level4Tactical3DSimulation } from '../simulation/Level4Tactical3DSimulation';
import confetti from 'canvas-confetti';

export const Level4WaterfallStudio: React.FC = () => {
  const {
    votingLocked,
    setVotingLocked,
    castVote,
    addDecision,
    setCurrentLevel,
    currentBatonHolder,
    hero
  } = useStoryState();
  const { playTap, playAchievement, playVote, playBatonPass, playFanfare } = useAudio();

  const heroId = hero?.id || 'hero-naruto';

  // Hero-specific decision map
  const heroDecision = (hero && HERO_DECISIONS_MAP[hero.id]) || HERO_DECISIONS_MAP['hero-naruto'];

  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({
    A: heroDecision.options[0]?.votes || 12,
    B: heroDecision.options[1]?.votes || 8,
    C: heroDecision.options[2]?.votes || 5,
    D: heroDecision.options[3]?.votes || 3,
  });

  const [simulationCompleted, setSimulationCompleted] = useState(false);
  const [activeFoleySound, setActiveFoleySound] = useState<string | null>(null);

  const hasCelebratedRef = useRef(false);

  // Triggered when 3D simulation achieves resonance
  const handleSimulationSuccess = useCallback(() => {
    if (hasCelebratedRef.current) return;
    hasCelebratedRef.current = true;
    playFanfare();
    setSimulationCompleted(true);
    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch { }
  }, [playFanfare]);

  // -------------------------------------------------------------
  // Web Audio Synthesizer for Bespoke Hero Foley FX
  // -------------------------------------------------------------
  const triggerSoundSynthesis = (type: string) => {
    setActiveFoleySound(type);
    setTimeout(() => setActiveFoleySound(null), 1000);

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'rasengan' || type === 'chidori') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(type === 'chidori' ? 880 : 340, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(type === 'chidori' ? 1760 : 780, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'instant-transmission') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'kamehameha' || type === 'aura') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(320, ctx.currentTime + 0.6);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.7);
      } else if (type === 'gong' || type === 'skadoosh') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(type === 'skadoosh' ? 120 : 220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.8);
        gain.gain.setValueAtTime(0.6, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      } else if (type === 'repulsor' || type === 'arc-reactor') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'jarvis-ping') {
        [800, 1200].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.1);
          osc.stop(ctx.currentTime + i * 0.1 + 0.2);
        });
      }
    } catch { }
  };

  // Hero Foley Soundpad list
  const heroFoleyConfig: Record<string, { id: string; name: string; icon: any; color: string }[]> = {
    'hero-naruto': [
      { id: 'rasengan', name: 'Rasengan Vortex', icon: Wind, color: 'from-cyan-500 to-blue-600' },
      { id: 'chidori', name: 'Lightning Dragon', icon: Zap, color: 'from-amber-500 to-yellow-600' },
      { id: 'dragon-roar', name: 'Water Dragon Roar', icon: Activity, color: 'from-blue-600 to-indigo-600' },
    ],
    'hero-goku': [
      { id: 'instant-transmission', name: 'Instant Transmission', icon: Zap, color: 'from-blue-500 to-indigo-600' },
      { id: 'kamehameha', name: 'Kamehameha Surge', icon: Flame, color: 'from-amber-500 to-orange-600' },
      { id: 'aura', name: 'Super Saiyan Aura', icon: Target, color: 'from-yellow-400 to-amber-500' },
    ],
    'hero-po': [
      { id: 'gong', name: 'Golden Chi Bell', icon: Target, color: 'from-amber-500 to-yellow-600' },
      { id: 'skadoosh', name: 'Skadoosh Impact', icon: Shield, color: 'from-emerald-500 to-teal-600' },
      { id: 'flute', name: 'Lotus Flute Stream', icon: Wind, color: 'from-cyan-500 to-blue-600' },
    ],
    'hero-ironman': [
      { id: 'repulsor', name: 'Repulsor Blast', icon: Zap, color: 'from-red-500 to-orange-600' },
      { id: 'arc-reactor', name: 'Arc Reactor Pulse', icon: Cpu, color: 'from-cyan-500 to-blue-600' },
      { id: 'jarvis-ping', name: 'J.A.R.V.I.S. Audio Ping', icon: Crosshair, color: 'from-purple-500 to-indigo-600' },
    ],
  };

  const activeSoundpads = heroFoleyConfig[heroId] || heroFoleyConfig['hero-naruto'];

  // Handle Advance Level
  const handleAdvanceLevel = () => {
    playBatonPass();
    setCurrentLevel('level-5');
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-12">

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-xl p-6 rounded-3xl border-2 border-cyan-300 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <span className="px-3 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-nunito font-black text-xs uppercase tracking-widest">
              Level 4: Tactical Action & Voice Studio
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-900 leading-tight">
              {hero?.name ? `${hero.name}'s 3D Tactical Arc & Foley Studio` : '3D Tactical Arc & Foley Studio'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-cyan-50 px-4 py-2 rounded-2xl border border-cyan-200 text-xs font-nunito font-bold text-cyan-900">
          <span>Active Storyteller: <strong>{currentBatonHolder}</strong></span>
        </div>
      </div>

      {/* Active Hero Action Spotlight */}
      {hero && (
        <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border-2 border-cyan-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {hero.image ? (
              <img
                src={hero.image}
                alt={hero.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400 shadow-sm shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-display font-black text-xl">
                {hero.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-nunito font-black px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 uppercase tracking-wider">
                  {hero.storyArchetype}
                </span>
                <span className="text-xs font-nunito font-bold text-slate-500">
                  Signature Power: <strong className="text-cyan-700">{hero.signatureMove}</strong>
                </span>
              </div>
              <h4 className="font-display font-black text-lg text-slate-900 mt-0.5">
                {hero.name} engages the 3D Tactical Matrix
              </h4>
              <p className="text-xs font-nunito text-slate-600 line-clamp-1 italic">
                "{hero.teachingNote}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 bg-cyan-50 px-3.5 py-2 rounded-2xl border border-cyan-100">
            <span className="text-xs font-nunito font-bold text-cyan-900">
              Heroic Moral: <span className="text-cyan-700 font-extrabold">{hero.moral}</span>
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left 6 Columns: 🎮 Hero-Specific 3D Interactive Tactical Simulation */}
        <div className="lg:col-span-6">
          <Level4Tactical3DSimulation
            hero={hero}
            onSuccess={handleSimulationSuccess}
            externalTechnique={activeFoleySound}
          />
        </div>

        {/* Right 6 Columns: 🎙️ Foley Soundboard & Classroom Team Decision */}
        <div className="lg:col-span-6 space-y-6">

          {/* Foley Sound FX Board */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 border-2 border-cyan-200 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-600 animate-pulse" />
              <h3 className="font-display font-black text-xl text-slate-900">
                Classroom Foley Soundboard
              </h3>
            </div>
            <p className="font-nunito text-xs text-slate-600">
              Tap sound pads to trigger live audio drama for this scene during classroom storytelling:
            </p>

            <div className="grid grid-cols-3 gap-3">
              {activeSoundpads.map((sound) => {
                const SoundIcon = sound.icon;
                return (
                  <motion.button
                    key={sound.id}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => triggerSoundSynthesis(sound.id)}
                    className={`p-3 rounded-2xl text-white font-display font-black text-xs shadow-md bg-gradient-to-br ${sound.color} transition-all flex flex-col items-center justify-center gap-1.5 ${activeFoleySound === sound.id ? 'ring-4 ring-cyan-400 scale-105' : ''
                      }`}
                  >
                    <SoundIcon className="w-4 h-4" />
                    <span className="text-center">{sound.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Group Decision Vote */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 border-2 border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-black text-lg text-slate-900">
                Classroom Team Decision:
              </h4>
              <span className="text-xs font-nunito font-bold text-slate-500">
                {Object.values(voteCounts).reduce((a, b) => a + b, 0)} Votes Cast
              </span>
            </div>

            <p className="font-nunito text-xs text-slate-700 font-bold leading-relaxed">
              {heroDecision.question}
            </p>

            <div className="space-y-2">
              {heroDecision.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  disabled={votingLocked}
                  onClick={() => {
                    if (votingLocked) return;
                    playVote();
                    setVoteCounts(prev => ({ ...prev, [opt.id]: (prev[opt.id] || 0) + 1 }));
                  }}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs font-nunito font-bold transition-all text-left ${votingLocked
                      ? 'bg-slate-50 border-slate-200 text-slate-700'
                      : 'bg-slate-50 hover:bg-cyan-50 border-slate-300 hover:border-cyan-400 text-slate-800 cursor-pointer'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div>
                      <span>{opt.label}</span>
                      <span className="block text-[10px] text-cyan-700 font-extrabold">{opt.perk}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-800 text-[11px] font-black shrink-0">
                    {voteCounts[opt.id] || 0} votes
                  </span>
                </button>
              ))}
            </div>

            {!votingLocked ? (
              <button
                type="button"
                onClick={() => {
                  playAchievement();
                  const winningOpt = [...heroDecision.options].sort((a, b) => (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0))[0];
                  addDecision(heroDecision.question, {
                    id: winningOpt.id as 'A' | 'B' | 'C' | 'D',
                    text: winningOpt.label,
                    votes: voteCounts[winningOpt.id] || 0,
                    consequence: winningOpt.perk
                  });
                  setVotingLocked(true);
                  try {
                    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
                  } catch { }
                }}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-display font-black text-xs shadow-md cursor-pointer transition-all hover:scale-102"
              >
                Lock In Team Choice
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAdvanceLevel}
                className="w-full btn-story-primary !py-3.5 !text-sm shadow-xl flex items-center justify-center gap-2 font-display font-black !bg-gradient-to-r !from-cyan-500 !to-blue-600 text-white"
              >
                <span>Advance to Volcano Climax (Level 5)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
