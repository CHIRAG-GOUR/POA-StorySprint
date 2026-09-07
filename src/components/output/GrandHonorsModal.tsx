import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Award, 
  Printer, 
  BookOpen, 
  Compass, 
  X, 
  CheckCircle2, 
  Heart, 
  Shield,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';
import { CHARACTER_STORIES_MAP } from '../../data/characterStoriesData';

export const GrandHonorsModal: React.FC = () => {
  const { 
    showHonorsCeremony, 
    setShowHonorsCeremony, 
    className, 
    hero, 
    selectedStoryId, 
    achievements, 
    participants,
    closeLevelActivity 
  } = useStoryState();
  
  const { playTap, playFanfare } = useAudio();

  if (!showHonorsCeremony) return null;

  const activeHeroId = hero?.id || 'hero-naruto';
  const heroStories = CHARACTER_STORIES_MAP[activeHeroId] || CHARACTER_STORIES_MAP['hero-naruto'];
  const activeStory = heroStories.find(s => s.id === selectedStoryId) || heroStories[0];

  const handlePrint = () => {
    playFanfare();
    window.print();
  };

  const handleCloseToStorybook = () => {
    playTap();
    setShowHonorsCeremony(false);
  };

  const handleReturnToIsland = () => {
    playTap();
    setShowHonorsCeremony(false);
    closeLevelActivity();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-gradient-to-br from-amber-50 via-[#fdfaf2] to-amber-100 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-4 border-amber-400 p-6 sm:p-10 my-auto text-slate-900 overflow-hidden"
        >
          {/* Ornate Background Watermark */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#d97706_2px,transparent_2px)] [background-size:24px_24px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-amber-400/60 rounded-tr-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-amber-400/60 rounded-bl-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={handleCloseToStorybook}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-amber-200/80 hover:bg-amber-300 text-amber-950 flex items-center justify-center cursor-pointer transition-colors shadow-sm z-20 print:hidden"
            title="Close ceremony"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Ceremony Header */}
          <div className="text-center space-y-3 relative z-10 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/30 border border-amber-500/60 text-amber-900 font-nunito font-black text-xs uppercase tracking-widest shadow-inner">
              <Rocket className="w-4 h-4 text-amber-700" />
              <span>Official Graduation & Honors Ceremony</span>
              <Rocket className="w-4 h-4 text-amber-700" />
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 border-2 border-white flex items-center justify-center text-3xl shadow-md">
                🏆
              </div>
              <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 leading-tight">
                Grand Story Scribe Honors!
              </h1>
            </div>

            <p className="font-nunito font-bold text-sm sm:text-base text-amber-900 max-w-2xl mx-auto">
              Conferred upon <strong className="text-slate-950 font-black">{className}</strong> for successfully completing the legendary quest of <strong className="text-amber-800">{hero?.name}</strong>!
            </p>
          </div>

          {/* Official Parchment Diploma Card */}
          <div className="relative z-10 bg-white/95 rounded-2xl p-6 sm:p-8 border-2 border-amber-300 shadow-lg space-y-6 my-6">
            
            {/* Diploma Title & Crest */}
            <div className="border-b-2 border-amber-200/80 pb-4 text-center space-y-1">
              <span className="text-[11px] font-nunito font-black text-amber-700 uppercase tracking-widest block">
                SkilliZee Guild of Imaginative Masterminds
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
                "{activeStory.title}"
              </h2>
              <p className="font-nunito font-bold text-xs sm:text-sm text-slate-600 italic">
                {activeStory.subtitle} • {activeStory.tagline}
              </p>
            </div>

            {/* Core Moral & Wisdom */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-2 border-amber-300/80 text-center space-y-1">
              <span className="text-xs font-nunito font-black uppercase text-amber-900 flex items-center justify-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                The Guiding Story Moral
                <Award className="w-4 h-4 text-amber-600" />
              </span>
              <p className="font-display font-bold text-base sm:text-lg text-slate-900 italic">
                "{activeStory.moral}"
              </p>
            </div>

            {/* 3 Author Seals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-nunito font-black uppercase text-amber-700 block">
                    Insight Seal
                  </span>
                  <span className="font-display font-black text-xs text-slate-900 leading-tight">
                    {activeStory.authorSeals.insight}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-300 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-nunito font-black uppercase text-blue-700 block">
                    Teamwork Seal
                  </span>
                  <span className="font-display font-black text-xs text-slate-900 leading-tight">
                    {activeStory.authorSeals.teamwork}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-nunito font-black uppercase text-emerald-700 block">
                    Moral Seal
                  </span>
                  <span className="font-display font-black text-xs text-slate-900 leading-tight">
                    {activeStory.authorSeals.moral}
                  </span>
                </div>
              </div>
            </div>

            {/* 10 Honors Badges Unlocked Grid */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-nunito font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  10 Classroom Honors Badges Awarded:
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
                  100% Complete 🌟
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col items-center text-center justify-between"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-lg text-white shadow-xs mb-1">
                      {ach.icon}
                    </div>
                    <span className="font-display font-black text-xs text-slate-900 line-clamp-1">
                      {ach.title}
                    </span>
                    <span className="text-[10px] font-nunito font-bold text-amber-800 truncate max-w-full">
                      {ach.earnedBy || 'All Teams'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Signatures & Class Roll */}
            <div className="border-t border-amber-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-nunito">
              <div>
                <span className="font-black text-slate-800 uppercase block">Certified Author Teams:</span>
                <span className="font-bold text-slate-600">{participants.join(' • ')}</span>
              </div>
              <div className="text-right flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-400/30 border border-amber-400 flex items-center justify-center text-amber-900 font-display font-black text-xs">
                  SEAL
                </div>
                <div>
                  <span className="font-black text-amber-950 block">SkilliZee Story Guild</span>
                  <span className="text-[10px] text-amber-800 font-bold">Verified Storytelling Master</span>
                </div>
              </div>
            </div>

          </div>

          {/* Action Navigation Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 print:hidden">
            
            <button
              type="button"
              onClick={handlePrint}
              className="btn-story-primary text-sm !py-3 !px-6 !bg-gradient-to-r !from-amber-500 !via-orange-500 !to-red-500 flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:scale-105 transition-transform w-full sm:w-auto font-bold"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Diploma & Honors</span>
            </button>

            <button
              type="button"
              onClick={handleCloseToStorybook}
              className="btn-story-secondary text-sm !py-3 !px-6 !bg-white hover:!bg-purple-50 text-purple-900 border-2 border-purple-300 flex items-center justify-center gap-2 shadow-md cursor-pointer hover:scale-105 transition-transform w-full sm:w-auto font-bold"
            >
              <BookOpen className="w-4 h-4 text-purple-700" />
              <span>Read & Flip Storybook 📖</span>
            </button>

            <button
              type="button"
              onClick={handleReturnToIsland}
              className="btn-story-secondary text-sm !py-3 !px-6 !bg-emerald-50 hover:!bg-emerald-100 text-emerald-950 border-2 border-emerald-300 flex items-center justify-center gap-2 shadow-md cursor-pointer hover:scale-105 transition-transform w-full sm:w-auto font-bold"
            >
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>Explore 3D Living Island 🏝️</span>
            </button>

          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
};
