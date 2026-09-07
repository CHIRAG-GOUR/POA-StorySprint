import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Key } from 'lucide-react';
import { IMPORTANT_OBJECTS } from '../../data/storyData';
import { StoryObject } from '../../types/story';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';

export const ObjectSelector: React.FC = () => {
  const { importantObject, setImportantObject, currentBatonHolder } = useStoryState();
  const { playTap, playAchievement } = useAudio();

  const handleSelect = (obj: StoryObject) => {
    playTap();
    playAchievement();
    setImportantObject(obj);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-display font-black text-3xl md:text-4xl text-gray-900 leading-tight">
            The Important Object 🗝️
          </h2>
          <p className="font-nunito font-semibold text-slate-600 text-base md:text-lg">
            What artifact will play a pivotal role in the adventure?
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-nunito font-bold">
          <Key className="w-3.5 h-3.5" />
          <span>Led by: {currentBatonHolder}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {IMPORTANT_OBJECTS.map((obj) => {
          const isSelected = importantObject?.id === obj.id;
          return (
            <motion.div
              key={obj.id}
              onClick={() => handleSelect(obj)}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative rounded-3xl p-6 cursor-pointer transition-all flex flex-col justify-between border-2 ${
                isSelected
                  ? 'bg-white/95 border-amber-500 shadow-xl shadow-amber-500/15 ring-4 ring-amber-400/20'
                  : 'bg-white/80 backdrop-blur-md border-white/80 hover:border-amber-300 hover:bg-white shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shadow-xs">
                    {obj.emoji}
                  </div>
                  {isSelected && (
                    <div className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-500 text-white rounded-full text-xs font-nunito font-extrabold shadow-sm">
                      <Check className="w-3 h-3" />
                      <span>Chosen</span>
                    </div>
                  )}
                </div>
                <h3 className="font-display font-black text-xl text-gray-900 leading-tight mb-1">
                  {obj.name}
                </h3>
                <span className="inline-block px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-800 font-nunito font-bold text-[11px] uppercase tracking-wider mb-2">
                  {obj.category}
                </span>
                <p className="font-nunito text-xs text-slate-600 leading-relaxed mb-4">
                  {obj.description}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs font-nunito">
                <div className="flex items-start gap-1.5 text-slate-700">
                  <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Power:</strong> {obj.power}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
