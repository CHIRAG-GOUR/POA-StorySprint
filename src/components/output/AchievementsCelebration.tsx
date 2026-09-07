import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle2, Award, PartyPopper } from 'lucide-react';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';

export const AchievementsCelebration: React.FC = () => {
  const { achievements, unlockAchievement, currentBatonHolder } = useStoryState();
  const { playTap, playAchievement, playFanfare } = useAudio();

  const handleCelebrateAll = () => {
    playFanfare();
  };

  const handleBadgeClick = (id: string) => {
    playTap();
    playAchievement();
    unlockAchievement(id, currentBatonHolder);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
      {/* High-Contrast Header Card */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border-2 border-purple-200 shadow-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-nunito font-black text-xs uppercase tracking-widest mb-2">
            🌟 Expedition Hall of Fame
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-900 leading-tight">
            Classroom Achievements & Honors 🏆
          </h2>
          <p className="font-nunito font-bold text-slate-600 text-sm sm:text-base mt-1">
            Celebrating the imagination, collaboration, and courage of all storytellers!
          </p>
        </div>

        <button
          type="button"
          onClick={handleCelebrateAll}
          className="btn-story-primary !py-3.5 !px-7 !bg-gradient-to-r !from-amber-400 !via-pink-500 !to-purple-600 shadow-xl shrink-0 cursor-pointer hover:scale-105 transition-all"
        >
          <PartyPopper className="w-5 h-5 animate-bounce" />
          <span>Celebrate Victory! 🎉</span>
        </button>
      </div>

      {/* Grid of 10 Meaningful Achievements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {achievements.map((ach) => (
          <motion.div
            key={ach.id}
            onClick={() => handleBadgeClick(ach.id)}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative rounded-3xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between ${
              ach.unlocked
                ? 'bg-white/95 border-amber-400 shadow-lg shadow-amber-400/15'
                : 'bg-white/70 border-slate-200 opacity-60 hover:opacity-100'
            }`}
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${ach.color} flex items-center justify-center text-3xl shadow-md border-2 border-white`}>
                  {ach.icon}
                </div>
                {ach.unlocked ? (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-nunito font-extrabold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Unlocked</span>
                  </span>
                ) : (
                  <span className="text-xs font-nunito font-bold text-slate-400">
                    Tap to Award
                  </span>
                )}
              </div>

              <h3 className="font-display font-black text-2xl text-slate-900 mb-1 leading-snug">
                {ach.title}
              </h3>
              <p className="font-nunito text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                {ach.description}
              </p>
            </div>

            {ach.earnedBy && (
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs font-nunito text-purple-700 font-bold">
                <span>Awarded to:</span>
                <span className="px-2 py-0.5 rounded-lg bg-purple-50">{ach.earnedBy}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
