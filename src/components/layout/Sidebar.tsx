import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlayCircle, CheckCircle2, Flame, Compass, MapPin } from 'lucide-react';
import { ISLAND_LOCATIONS, getHeroLocations } from '../../data/storyData';
import { LevelId } from '../../types/story';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentLevelId, completedLevels, setCurrentLevel, storyEnergy, toggleMapOverlay, hero } = useStoryState();
  const { playTap } = useAudio();
  const heroLocations = getHeroLocations(hero?.id);

  const handleSelectLevel = (levelId: LevelId) => {
    playTap();
    setCurrentLevel(levelId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs"
          />

          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl border-r-2 border-purple-200 shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-purple-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-display font-black text-xl shadow-sm">
                  🏝️
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-slate-900 leading-tight">
                    Island Quests
                  </h3>
                  <p className="font-nunito text-xs text-purple-600 font-bold">6 Island Levels</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Level Nodes List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              <button
                type="button"
                onClick={() => { onClose(); toggleMapOverlay(); }}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-display font-black text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer hover:scale-102 transition-transform mb-2"
              >
                <Compass className="w-4 h-4" />
                <span>Open 3D Island World Map 🗺️</span>
              </button>

              {heroLocations.map((loc) => {
                const isActive = currentLevelId === loc.id;
                const isDone = completedLevels.includes(loc.id);

                return (
                  <motion.button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelectLevel(loc.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md font-extrabold'
                        : isDone
                        ? 'bg-emerald-50 border-emerald-300 text-slate-800'
                        : 'bg-white border-slate-200 hover:border-purple-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className="text-2xl">{loc.emoji}</span>
                      <div className="truncate">
                        <span className={`text-[10px] font-nunito font-extrabold uppercase tracking-wider block ${
                          isActive ? 'text-purple-200' : 'text-slate-400'
                        }`}>
                          Level {loc.levelNumber}
                        </span>
                        <h4 className="font-display font-bold text-sm truncate">
                          {loc.name}
                        </h4>
                      </div>
                    </div>

                    <div className="shrink-0 pl-2">
                      {isActive ? (
                        <PlayCircle className="w-5 h-5 text-white" />
                      ) : isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <span className="text-xs text-slate-400">Enter</span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Bottom Story Energy */}
            <div className="p-4 border-t border-purple-100 bg-purple-50/80">
              <div className="flex items-center justify-between text-xs font-nunito font-bold text-purple-900 mb-1.5">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Story Island Energy</span>
                </span>
                <span>{storyEnergy}%</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 rounded-full"
                  animate={{ width: `${storyEnergy}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
