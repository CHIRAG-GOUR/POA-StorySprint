import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Award, Trophy, Rocket, Printer, CheckCircle2, RotateCcw, Compass } from 'lucide-react';
import { DigitalClassStorybook } from '../output/DigitalClassStorybook';
import { StorySprintPassport } from '../output/StorySprintPassport';
import { AchievementsCelebration } from '../output/AchievementsCelebration';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';

export const Level6StorybookGalleon: React.FC = () => {
  const { currentBatonHolder, closeLevelActivity, completeStory } = useStoryState();
  const { playTap, playFanfare } = useAudio();
  const [activeTab, setActiveTab] = useState<'storybook' | 'passport' | 'achievements'>('storybook');

  const handleCelebrate = () => {
    playFanfare();
    completeStory();
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-xl p-6 rounded-3xl border-2 border-pink-300 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center text-3xl text-white shadow-md">
            ⛵
          </div>
          <div>
            <span className="px-3 py-0.5 rounded-full bg-pink-100 text-pink-800 font-nunito font-black text-xs uppercase tracking-widest">
              Level 6: Galleon Harbor & Starry Lighthouse
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-900 leading-tight">
              The Grand Storybook & Passport Ceremony 📖
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { playTap(); closeLevelActivity(); }}
            className="btn-story-secondary text-xs !min-h-[40px] !py-2 flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <Compass className="w-4 h-4 text-purple-600" />
            <span>Return to 3D Island 🏝️</span>
          </button>

          <button
            type="button"
            onClick={handleCelebrate}
            className="btn-story-primary text-xs !min-h-[40px] !py-2 !bg-gradient-to-r !from-amber-400 !via-pink-500 !to-purple-600 shadow-lg flex items-center gap-1.5"
          >
            <Rocket className="w-4 h-4 text-amber-200 animate-pulse" />
            <span>Launch Celebration Rockets! 🚀</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-center gap-3 bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-purple-200 max-w-lg mx-auto shadow-xs print:hidden">
        <button
          type="button"
          onClick={() => { playTap(); setActiveTab('storybook'); }}
          className={`flex-1 py-2.5 px-4 rounded-xl font-display font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'storybook'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Class Storybook</span>
        </button>

        <button
          type="button"
          onClick={() => { playTap(); setActiveTab('passport'); }}
          className={`flex-1 py-2.5 px-4 rounded-xl font-display font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'passport'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Story Passports</span>
        </button>

        <button
          type="button"
          onClick={() => { playTap(); setActiveTab('achievements'); }}
          className={`flex-1 py-2.5 px-4 rounded-xl font-display font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'achievements'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Honors (10)</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="w-full">
        {activeTab === 'storybook' && <DigitalClassStorybook />}
        {activeTab === 'passport' && <StorySprintPassport />}
        {activeTab === 'achievements' && <AchievementsCelebration />}
      </div>

    </div>
  );
};
