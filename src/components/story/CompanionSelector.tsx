import React from 'react';
import { motion } from 'framer-motion';
import { Check, Users, ThumbsUp, AlertCircle } from 'lucide-react';
import { COMPANIONS } from '../../data/storyData';
import { SupportingCompanion } from '../../types/story';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';

export const CompanionSelector: React.FC = () => {
  const { companion, setCompanion, currentBatonHolder } = useStoryState();
  const { playTap, playAchievement } = useAudio();

  const handleSelect = (comp: SupportingCompanion) => {
    playTap();
    playAchievement();
    setCompanion(comp);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-display font-black text-3xl md:text-4xl text-gray-900 leading-tight">
            Meet the Supporting Companion 🤝
          </h2>
          <p className="font-nunito font-semibold text-slate-600 text-base md:text-lg">
            Who accompanies our hero, bringing quirks, aid, and unexpected complications?
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-nunito font-bold">
          <Users className="w-3.5 h-3.5" />
          <span>Led by: {currentBatonHolder}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {COMPANIONS.map((comp) => {
          const isSelected = companion?.id === comp.id;
          return (
            <motion.div
              key={comp.id}
              onClick={() => handleSelect(comp)}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative rounded-3xl p-6 cursor-pointer transition-all flex flex-col justify-between border-2 ${
                isSelected
                  ? 'bg-white/95 border-emerald-500 shadow-xl shadow-emerald-500/15 ring-4 ring-emerald-400/20'
                  : 'bg-white/80 backdrop-blur-md border-white/80 hover:border-emerald-300 hover:bg-white shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl">{comp.emoji}</span>
                  {isSelected && (
                    <div className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500 text-white rounded-full text-xs font-nunito font-extrabold shadow-sm">
                      <Check className="w-3 h-3" />
                      <span>Chosen</span>
                    </div>
                  )}
                </div>
                <h3 className="font-display font-black text-2xl text-gray-900 leading-tight mb-1">
                  {comp.name}
                </h3>
                <p className="font-nunito font-extrabold text-xs text-emerald-600 uppercase tracking-wider mb-2">
                  {comp.archetype}
                </p>
                <p className="font-nunito text-xs text-slate-600 leading-relaxed italic mb-4">
                  "Quirk: {comp.quirk}"
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs font-nunito">
                <div className="flex items-start gap-1.5 text-emerald-800 bg-emerald-50/60 p-2 rounded-xl border border-emerald-100/60">
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>How They Help:</strong> {comp.howTheyHelp}</span>
                </div>
                <div className="flex items-start gap-1.5 text-amber-800 bg-amber-50/60 p-2 rounded-xl border border-amber-100/60">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Complication:</strong> {comp.howTheyComplicate}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
