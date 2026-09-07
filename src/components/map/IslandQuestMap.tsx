import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CheckCircle2, Play, Lock, Star, Compass, Volume2, Shield } from 'lucide-react';
import { ISLAND_LOCATIONS, getHeroLocations } from '../../data/storyData';
import { LevelId, IslandLocation } from '../../types/story';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';

interface IslandQuestMapProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const IslandQuestMap: React.FC<IslandQuestMapProps> = ({ isModal = false, onClose }) => {
  const { currentLevelId, completedLevels, setCurrentLevel, hero, currentBatonHolder } = useStoryState();
  const { playTap, playAchievement, playTwistSpin, playFanfare } = useAudio();
  const [hoveredLoc, setHoveredLoc] = useState<IslandLocation | null>(null);
  const [easterEggActive, setEasterEggActive] = useState<string | null>(null);

  const heroLocations = getHeroLocations(hero?.id);

  const handleSelectLevel = (loc: IslandLocation) => {
    playTap();
    playAchievement();
    setCurrentLevel(loc.id);
    if (onClose) onClose();
  };

  const triggerEasterEgg = (type: string) => {
    playTwistSpin();
    setEasterEggActive(type);
    if (type === 'ufo') {
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.2 } });
      } catch {}
    }
    setTimeout(() => setEasterEggActive(null), 3000);
  };

  const activeLocation = heroLocations.find(l => l.id === currentLevelId) || heroLocations[0];

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300/80 bg-slate-900 ${
      isModal ? 'max-w-5xl mx-auto my-4' : 'min-h-[620px] h-[78vh]'
    }`}>
      
      {/* Background Illustrated Island Map Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-101"
        style={{ backgroundImage: "url('/assets/island_map.jpg')" }}
      >
        {/* Soft atmospheric overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/30" />
      </div>

      {/* Top Map HUD Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 bg-slate-900/85 backdrop-blur-xl px-5 py-3 rounded-2xl border-2 border-amber-300/60 shadow-lg text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-xl shadow-md">
            🗺️
          </div>
          <div>
            <span className="text-[10px] font-nunito font-black text-amber-400 uppercase tracking-widest block">
              Island Quest World Map
            </span>
            <h3 className="font-display font-black text-lg sm:text-xl text-white leading-tight">
              The Lost Isles of Wonder
            </h3>
          </div>
        </div>

        {/* Hero Marker & Storyteller */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-purple-900/70 px-3 py-1.5 rounded-xl border border-purple-400/50 text-xs font-nunito">
            <span>Hero: <strong>{hero?.name}</strong></span>
            {hero?.image && (
              <img src={hero.image} alt={hero.name} className="w-6 h-6 rounded-full object-cover border border-amber-300" />
            )}
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/30 border border-amber-400/60 text-amber-300 text-xs font-nunito font-bold">
            <span>🪄 Baton: {currentBatonHolder}</span>
          </div>

          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-nunito font-bold cursor-pointer transition-colors"
            >
              Close Map ✕
            </button>
          )}
        </div>
      </div>

      {/* Interactive Easter Eggs over Map Landmarks */}
      {/* UFO in the sky */}
      <button
        type="button"
        onClick={() => triggerEasterEgg('ufo')}
        className="absolute top-[8%] left-[45%] z-20 w-16 h-16 rounded-full flex items-center justify-center cursor-pointer hover:scale-125 transition-transform group"
        title="Tap the Alien UFO!"
      >
        <span className="text-3xl animate-bounce" style={{ animationDuration: '4s' }}>🛸</span>
        {easterEggActive === 'ufo' && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-16 bg-cyan-900/90 text-cyan-200 px-3 py-1 rounded-xl text-xs font-nunito font-bold border border-cyan-400 whitespace-nowrap shadow-xl"
          >
            👽 *Alien Beep*: "Story energy is off the charts!"
          </motion.div>
        )}
      </button>

      {/* Volcano Crater */}
      <button
        type="button"
        onClick={() => triggerEasterEgg('volcano')}
        className="absolute top-[18%] left-[48%] z-20 w-16 h-16 rounded-full flex items-center justify-center cursor-pointer hover:scale-125 transition-transform"
        title="Tap the Volcano Crater!"
      >
        <span className="text-3xl animate-pulse">🔥</span>
        {easterEggActive === 'volcano' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: -20 }}
            className="absolute -top-6 bg-red-950/90 text-amber-300 px-3 py-1 rounded-xl text-xs font-nunito font-black border border-red-500 whitespace-nowrap shadow-xl"
          >
            🌋 *RUMBLE*: Smoke billows from the magma core!
          </motion.div>
        )}
      </button>

      {/* Interactive Level Nodes Placed on the Island Map */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
        {heroLocations.map((loc) => {
          const isCurrent = currentLevelId === loc.id;
          const isDone = completedLevels.includes(loc.id);

          return (
            <div
              key={loc.id}
              style={{ left: `${loc.coords.x}%`, top: `${loc.coords.y}%` }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              onMouseEnter={() => setHoveredLoc(loc)}
              onMouseLeave={() => setHoveredLoc(null)}
            >
              {/* Pulsing Beacon Circle */}
              <motion.div
                animate={isCurrent ? { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute inset-0 rounded-full blur-md ${
                  isCurrent ? 'bg-amber-400' : isDone ? 'bg-emerald-400/60' : 'bg-purple-400/40'
                }`}
              />

              {/* Main Interactive Location Pin Button */}
              <motion.button
                type="button"
                onClick={() => handleSelectLevel(loc)}
                whileHover={{ scale: 1.18, y: -4 }}
                whileTap={{ scale: 0.94 }}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center shadow-2xl border-3 cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 border-white ring-4 ring-amber-400/50 scale-110'
                    : isDone
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-white'
                    : 'bg-gradient-to-br from-purple-700 to-indigo-900 border-purple-300'
                }`}
              >
                <span className="text-2xl sm:text-3xl">{loc.emoji}</span>

                {/* Status Indicator Badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[10px] font-display font-black text-amber-300 shadow-md">
                  {isDone ? '✓' : loc.levelNumber}
                </div>
              </motion.button>

              {/* Location Tagplate */}
              <div className={`mt-1.5 px-2.5 py-0.5 rounded-full backdrop-blur-md text-[11px] font-display font-black text-center whitespace-nowrap shadow-md border ${
                isCurrent
                  ? 'bg-amber-500 text-slate-950 border-white ring-2 ring-amber-400'
                  : 'bg-slate-950/80 text-white border-slate-700'
              }`}>
                {loc.name.split('&')[0]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Floating Quest Info Drawer */}
      <AnimatePresence>
        {hoveredLoc && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="absolute bottom-4 left-4 right-4 z-30 bg-slate-950/90 backdrop-blur-2xl p-4 sm:p-5 rounded-3xl border-2 border-amber-300/80 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl shrink-0">
                {hoveredLoc.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-nunito font-black text-[10px] uppercase">
                    Level {hoveredLoc.levelNumber}
                  </span>
                  <span className="text-xs font-nunito font-bold text-amber-300">{hoveredLoc.tagline}</span>
                </div>
                <h4 className="font-display font-black text-xl text-white mt-0.5">
                  {hoveredLoc.questTitle}
                </h4>
                <p className="font-nunito text-xs text-slate-300 line-clamp-1 mt-0.5">
                  {hoveredLoc.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSelectLevel(hoveredLoc)}
              className="btn-story-primary !bg-gradient-to-r !from-amber-400 !to-orange-500 text-xs !min-h-[42px] !py-2 shrink-0 shadow-lg"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Enter Level {hoveredLoc.levelNumber} Quest</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
