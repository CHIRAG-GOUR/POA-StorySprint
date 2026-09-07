import React from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, Zap } from 'lucide-react';
import { HEROES } from '../../data/storyData';
import { CharacterArchetype } from '../../types/story';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';

export const CharacterSelector: React.FC = () => {
  const { hero, setHero, currentBatonHolder } = useStoryState();
  const { playTap, playAchievement } = useAudio();

  const handleSelect = (selectedHero: CharacterArchetype) => {
    playTap();
    playAchievement();
    setHero(selectedHero);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-display font-black text-3xl md:text-4xl text-gray-900 leading-tight">
            Choose Your Hero 🦸
          </h2>
          <p className="font-nunito font-semibold text-slate-600 text-base md:text-lg">
            Whose shoes will the class step into for this adventure?
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-800 text-xs font-nunito font-bold">
          <Shield className="w-3.5 h-3.5" />
          <span>Led by: {currentBatonHolder}</span>
        </div>
      </div>

      {/* Grid of Character Archetypes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {HEROES.map((h) => {
          const isSelected = hero?.id === h.id;
          return (
            <motion.div
              key={h.id}
              onClick={() => handleSelect(h)}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative rounded-3xl p-6 cursor-pointer transition-all flex flex-col justify-between border-2 ${
                isSelected
                  ? 'bg-white/95 border-purple-500 shadow-xl shadow-purple-500/15 ring-4 ring-purple-400/20'
                  : 'bg-white/80 backdrop-blur-md border-white/80 hover:border-purple-300 hover:bg-white shadow-md'
              }`}
            >
              {/* Top Banner with Avatar */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${h.color} flex items-center justify-center text-3xl shadow-md`}>
                  {h.avatar}
                </div>
                {isSelected ? (
                  <div className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-nunito font-extrabold shadow-sm">
                    <Check className="w-3.5 h-3.5" />
                    <span>Chosen Hero</span>
                  </div>
                ) : (
                  <span className="text-2xl opacity-40 group-hover:opacity-100 transition-opacity">
                    {h.emoji}
                  </span>
                )}
              </div>

              {/* Names & Description */}
              <div className="space-y-1.5 mb-4">
                <h3 className="font-display font-black text-2xl text-gray-900 leading-tight">
                  {h.name}
                </h3>
                <p className="font-nunito font-extrabold text-sm text-purple-600">
                  {h.title}
                </p>
                <p className="font-nunito text-xs text-slate-600 leading-relaxed italic">
                  {h.quote}
                </p>
              </div>

              {/* Strengths & Abilities Pills */}
              <div className="space-y-2 border-t border-slate-100 pt-3 text-xs font-nunito">
                <div className="flex items-start gap-2 text-slate-700">
                  <Shield className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Strength:</strong> {h.strength}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Ability:</strong> {h.specialAbility}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
