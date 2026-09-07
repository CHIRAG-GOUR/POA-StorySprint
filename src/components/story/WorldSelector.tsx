import React from 'react';
import { motion } from 'framer-motion';
import { Check, Compass, MapPin } from 'lucide-react';
import { WORLDS } from '../../data/storyData';
import { WorldRealm } from '../../types/story';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';

export const WorldSelector: React.FC = () => {
  const { world, setWorld, currentBatonHolder } = useStoryState();
  const { playTap, playAchievement } = useAudio();

  const handleSelect = (selectedWorld: WorldRealm) => {
    playTap();
    playAchievement();
    setWorld(selectedWorld);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-display font-black text-3xl md:text-4xl text-gray-900 leading-tight">
            Choose Your World 🌍
          </h2>
          <p className="font-nunito font-semibold text-slate-600 text-base md:text-lg">
            Where will your adventure unfold? Watch the 3D environment transform!
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-nunito font-bold">
          <Compass className="w-3.5 h-3.5" />
          <span>Led by: {currentBatonHolder}</span>
        </div>
      </div>

      {/* Grid of Worlds */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {WORLDS.map((w) => {
          const isSelected = world?.id === w.id;
          return (
            <motion.div
              key={w.id}
              onClick={() => handleSelect(w)}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative rounded-3xl p-6 cursor-pointer transition-all flex flex-col justify-between border-2 ${
                isSelected
                  ? 'bg-white/95 border-cyan-500 shadow-xl shadow-cyan-500/15 ring-4 ring-cyan-400/20'
                  : 'bg-white/80 backdrop-blur-md border-white/80 hover:border-cyan-300 hover:bg-white shadow-md'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl">{w.emoji}</span>
                  {isSelected && (
                    <div className="flex items-center gap-1 px-2.5 py-0.5 bg-cyan-600 text-white rounded-full text-xs font-nunito font-extrabold shadow-sm">
                      <Check className="w-3 h-3" />
                      <span>Current World</span>
                    </div>
                  )}
                </div>
                <h3 className="font-display font-black text-xl text-gray-900 leading-tight mb-1">
                  {w.name}
                </h3>
                <p className="font-nunito font-extrabold text-xs text-cyan-600 mb-2">
                  {w.subtitle}
                </p>
                <p className="font-nunito text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {w.description}
                </p>
              </div>

              {/* Landmarks */}
              <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs font-nunito">
                <span className="font-bold text-slate-700 block mb-1">Notable Landmarks:</span>
                {w.landmarks.map((lm, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-3 h-3 text-cyan-500 shrink-0" />
                    <span className="truncate">{lm}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
