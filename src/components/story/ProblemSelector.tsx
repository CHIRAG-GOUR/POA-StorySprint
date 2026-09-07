import React from 'react';
import { motion } from 'framer-motion';
import { Check, AlertTriangle, HelpCircle, Flame } from 'lucide-react';
import { STORY_PROBLEMS } from '../../data/storyData';
import { StoryProblem } from '../../types/story';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';

export const ProblemSelector: React.FC = () => {
  const { problem, setProblem, currentBatonHolder } = useStoryState();
  const { playTap, playAchievement } = useAudio();

  const handleSelect = (prob: StoryProblem) => {
    playTap();
    playAchievement();
    setProblem(prob);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-display font-black text-3xl md:text-4xl text-gray-900 leading-tight">
            Create the Central Problem ⚠️
          </h2>
          <p className="font-nunito font-semibold text-slate-600 text-base md:text-lg">
            Every memorable adventure needs high stakes and an urgent mystery to solve.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-nunito font-bold">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Led by: {currentBatonHolder}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {STORY_PROBLEMS.map((prob) => {
          const isSelected = problem?.id === prob.id;
          return (
            <motion.div
              key={prob.id}
              onClick={() => handleSelect(prob)}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative rounded-3xl p-6 cursor-pointer transition-all flex flex-col justify-between border-2 ${
                isSelected
                  ? 'bg-white/95 border-rose-500 shadow-xl shadow-rose-500/15 ring-4 ring-rose-400/20'
                  : 'bg-white/80 backdrop-blur-md border-white/80 hover:border-rose-300 hover:bg-white shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl">{prob.emoji}</span>
                  {isSelected && (
                    <div className="flex items-center gap-1 px-2.5 py-0.5 bg-rose-500 text-white rounded-full text-xs font-nunito font-extrabold shadow-sm">
                      <Check className="w-3 h-3" />
                      <span>Chosen Dilemma</span>
                    </div>
                  )}
                </div>
                <h3 className="font-display font-black text-2xl text-gray-900 leading-tight mb-2">
                  {prob.title}
                </h3>
                <p className="font-nunito font-semibold text-sm text-rose-600 leading-snug mb-3">
                  "{prob.hook}"
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs font-nunito">
                <div className="flex items-start gap-1.5 text-slate-700">
                  <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                  <span><strong>The Stakes:</strong> {prob.stakes}</span>
                </div>
                <div className="flex items-start gap-1.5 text-purple-800 bg-purple-50/70 p-2.5 rounded-xl border border-purple-100/60">
                  <HelpCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>Class Inquiry:</strong> {prob.questionForClass}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
