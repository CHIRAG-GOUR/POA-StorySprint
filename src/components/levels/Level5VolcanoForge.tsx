import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Lightbulb, 
  Users, 
  HeartHandshake, 
  ArrowRight, 
  Award, 
  Palette, 
  Layers, 
  CheckCircle2, 
  Flame, 
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';
import { HERO_STRATEGIES_MAP } from '../../data/storyData';
import { CHARACTER_STORIES_MAP, CharacterStoryItem } from '../../data/characterStoriesData';

interface StoryClimaxSeal {
  id: string;
  pillar: string;
  badgeName: string;
  icon: any;
  iconBg: string;
  glowColor: string;
  description: string;
  stamped: boolean;
}

export const Level5VolcanoForge: React.FC = () => {
  const { 
    storyTitle,
    setStoryTitle,
    className,
    world,
    importantObject,
    companion,
    setClimaxSolution, 
    setEnding, 
    setCurrentLevel, 
    currentBatonHolder,
    hero,
    selectedStoryId,
    setSelectedStoryId
  } = useStoryState();
  
  const { playTap, playAchievement, playFanfare, playBatonPass } = useAudio();

  const heroId = hero?.id || 'hero-naruto';
  const activeStrategies = (hero && HERO_STRATEGIES_MAP[hero.id]) || HERO_STRATEGIES_MAP['hero-naruto'];
  const heroStories: CharacterStoryItem[] = CHARACTER_STORIES_MAP[heroId] || CHARACTER_STORIES_MAP['hero-naruto'];

  // Default story selection
  const currentStoryIndex = Math.max(0, heroStories.findIndex(s => s.id === selectedStoryId));
  const activeStory: CharacterStoryItem = heroStories[currentStoryIndex] || heroStories[0];

  // Seals config
  const initialSeals: StoryClimaxSeal[] = [
    {
      id: 'seal-insight',
      pillar: 'Pillar 1: Creative Insight',
      badgeName: activeStory.authorSeals.insight,
      icon: Lightbulb,
      iconBg: 'bg-amber-500',
      glowColor: 'shadow-amber-500/50',
      description: 'Ingenious strategic concept to resolve the crisis without destruction.',
      stamped: true,
    },
    {
      id: 'seal-teamwork',
      pillar: 'Pillar 2: Ally Synergy',
      badgeName: activeStory.authorSeals.teamwork,
      icon: Users,
      iconBg: 'bg-blue-500',
      glowColor: 'shadow-blue-500/50',
      description: 'Collaborative coordination combining the relic, companion, and classroom ideas.',
      stamped: true,
    },
    {
      id: 'seal-moral',
      pillar: 'Pillar 3: Moral Transformation',
      badgeName: activeStory.authorSeals.moral,
      icon: HeartHandshake,
      iconBg: 'bg-emerald-500',
      glowColor: 'shadow-emerald-500/50',
      description: 'Enduring life lesson and moral wisdom discovered through the journey.',
      stamped: true,
    }
  ];

  // Form states
  const [customTitle, setCustomTitle] = useState(activeStory.title);
  const [selectedTagline, setSelectedTagline] = useState(activeStory.tagline);
  const [seals, setSeals] = useState<StoryClimaxSeal[]>(initialSeals);
  const [selectedStrat, setSelectedStrat] = useState(activeStrategies[0]);
  const [moral, setMoral] = useState(activeStory.moral);

  // Sync when hero or selectedStory changes
  useEffect(() => {
    const stories = CHARACTER_STORIES_MAP[heroId] || CHARACTER_STORIES_MAP['hero-naruto'];
    const idx = Math.max(0, stories.findIndex(s => s.id === selectedStoryId));
    const target = stories[idx] || stories[0];
    
    setCustomTitle(target.title);
    setSelectedTagline(target.tagline);
    setMoral(target.moral);
    setStoryTitle(target.title);

    setSeals([
      {
        id: 'seal-insight',
        pillar: 'Pillar 1: Creative Insight',
        badgeName: target.authorSeals.insight,
        icon: Lightbulb,
        iconBg: 'bg-amber-500',
        glowColor: 'shadow-amber-500/50',
        description: 'Ingenious strategic concept to resolve the crisis without destruction.',
        stamped: true,
      },
      {
        id: 'seal-teamwork',
        pillar: 'Pillar 2: Ally Synergy',
        badgeName: target.authorSeals.teamwork,
        icon: Users,
        iconBg: 'bg-blue-500',
        glowColor: 'shadow-blue-500/50',
        description: 'Collaborative coordination combining the relic, companion, and classroom ideas.',
        stamped: true,
      },
      {
        id: 'seal-moral',
        pillar: 'Pillar 3: Moral Transformation',
        badgeName: target.authorSeals.moral,
        icon: HeartHandshake,
        iconBg: 'bg-emerald-500',
        glowColor: 'shadow-emerald-500/50',
        description: 'Enduring life lesson and moral wisdom discovered through the journey.',
        stamped: true,
      }
    ]);
  }, [heroId, selectedStoryId]);

  const stampedCount = seals.filter(s => s.stamped).length;
  const isCoverReady = stampedCount === seals.length;

  // Toggle seal stamping
  const handleToggleSeal = (sealId: string) => {
    playTap();
    setSeals(prev => {
      const updated = prev.map(s => s.id === sealId ? { ...s, stamped: !s.stamped } : s);
      const allStamped = updated.every(s => s.stamped);
      if (allStamped) {
        playFanfare();
      } else {
        playAchievement();
      }
      return updated;
    });
  };

  // Sync ending state when ready
  useEffect(() => {
    if (isCoverReady) {
      setStoryTitle(customTitle);
      setClimaxSolution(`${selectedStrat.type}: ${selectedStrat.summary}`);
      setEnding({
        type: selectedStrat.type,
        summary: selectedStrat.summary,
        moral: moral
      });
    }
  }, [isCoverReady, customTitle, selectedStrat, moral, setStoryTitle, setClimaxSolution, setEnding]);

  const handleAdvanceLevel = () => {
    playBatonPass();
    setStoryTitle(customTitle);
    setCurrentLevel('level-6');
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-xl p-6 rounded-3xl border-2 border-amber-300 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl text-white shadow-md">
            📖
          </div>
          <div>
            <span className="px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 font-nunito font-black text-xs uppercase tracking-widest">
              Level 5: Volcano Summit Climax & Cover Studio
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-900 leading-tight">
              Design the Physical Storybook & Bind the Climax 🔥
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200 text-xs font-nunito font-bold text-amber-900">
          <Award className="w-4 h-4 text-amber-600" />
          <span>Lead Author: <strong>{currentBatonHolder}</strong></span>
        </div>
      </div>

      {/* Main 2-Column Cover Page & Climax Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 6 Columns: 📚 LIVE 3D HARDCOVER STORYBOOK COVER PREVIEW */}
        <div className="lg:col-span-6 flex flex-col items-center gap-4">
          
          <div className="w-full flex items-center justify-between gap-3 bg-white/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl border-2 border-amber-300 shadow-md">
            <span className="text-xs sm:text-sm font-display font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs">
                <Palette className="w-4 h-4" />
              </div>
              <span>Live Realistic Hardcover Preview</span>
            </span>
            <span className={`px-3 py-1 rounded-xl text-xs font-black font-nunito shadow-xs flex items-center gap-1.5 ${
              isCoverReady 
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-300' 
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}>
              <span>{isCoverReady ? 'COVER COMPLETED & GILDED 🏆' : `Seals Stamped: ${stampedCount}/3`}</span>
            </span>
          </div>

          {/* 3D Realistic Hardcover Book Surface */}
          <motion.div 
            whileHover={{ rotateY: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className={`relative w-full max-w-md min-h-[530px] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden border-4 ${activeStory.borderAccent} flex flex-col justify-between p-6 perspective-[1200px] select-none`}
          >
            {/* Background Texture Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${activeStory.bgGradient} z-0`} />

            {/* Realistic Hardcover Book Spine Ribbon (Left Edge) */}
            <div className={`absolute left-0 top-0 bottom-0 w-8 sm:w-10 ${activeStory.spineColor} border-r-2 border-amber-400/80 shadow-2xl z-10 flex flex-col items-center justify-between py-5`}>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-300" />
              <span className="[writing-mode:vertical-lr] rotate-180 font-display font-black text-[10px] text-amber-200 tracking-widest uppercase">
                SkilliZee Sprint Edition
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-300" />
            </div>

            {/* Inner Gilded Content */}
            <div className="relative z-10 pl-8 pr-2 flex flex-col items-center text-center justify-between h-full space-y-4">
              
              {/* Top Subtitle Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-[11px] font-nunito font-extrabold uppercase tracking-widest shadow-inner">
                <BookOpen className="w-3 h-3 text-amber-300" />
                <span>{selectedTagline}</span>
              </div>

              {/* Book Title (Live Custom Title) */}
              <div className="space-y-1">
                <h1 className="font-display font-black text-2xl sm:text-3xl text-amber-100 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-tight">
                  {customTitle}
                </h1>
                <p className="font-nunito font-bold text-xs text-amber-300/90">
                  Written & Illustrated by {className}
                </p>
              </div>

              {/* Gilded Center Hero Portrait Medallion */}
              <div className="relative my-1">
                <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-3xl p-2 bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 shadow-[0_0_30px_rgba(245,158,11,0.5)] border-2 border-white/60 flex items-center justify-center">
                  <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-950 relative border border-amber-200 shadow-inner flex items-center justify-center">
                    <img
                      src={activeStory.coverImage || hero?.image || '/assets/hero_naruto.png'}
                      alt={hero?.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute bottom-1.5 left-2 right-2 text-center text-xs font-display font-black text-amber-200 drop-shadow-md">
                      {hero?.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* 🏅 3 Gilded Author Climax Seals (Stamped Live!) */}
              <div className="w-full bg-black/40 backdrop-blur-md rounded-2xl p-2.5 border border-white/20 space-y-1.5">
                <span className="text-[10px] font-nunito font-black text-amber-300 uppercase tracking-wider block">
                  Author Seals of Climax Mastery:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {seals.map((seal) => (
                    <div 
                      key={seal.id}
                      className={`p-1.5 rounded-xl flex flex-col items-center justify-center transition-all ${
                        seal.stamped 
                          ? 'bg-amber-400/30 border border-amber-300 text-amber-200 shadow-sm' 
                          : 'bg-white/5 border border-dashed border-white/30 text-white/40'
                      }`}
                    >
                      <span className="text-xs">{seal.stamped ? '⭐' : '⭕'}</span>
                      <span className="text-[9px] font-display font-black truncate max-w-full">
                        {seal.badgeName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Classroom Stamp */}
              <div className="text-[10px] font-nunito font-bold text-amber-300/80">
                Official SkilliZee Hardcover Passport Edition
              </div>

            </div>
          </motion.div>
        </div>

        {/* Right 6 Columns: 🛠️ STORY SELECTION, TITLE & 3 SEALS STUDIO */}
        <div className="lg:col-span-6 bg-white/95 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border-2 border-amber-200 shadow-xl space-y-5">
          
          {/* Step 1: Select Story or Customize Title */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-nunito font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-amber-600" />
                Step 1: Choose Story & Book Title
              </span>
              <span className="text-xs text-slate-500 font-bold">
                10 Bespoke Stories for {hero?.name}
              </span>
            </div>

            {/* 10 Stories Quick Selector */}
            <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-1">
              {heroStories.map((st) => {
                const isSelected = st.id === activeStory.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      playTap();
                      setSelectedStoryId(st.id);
                      setCustomTitle(st.title);
                      setSelectedTagline(st.tagline);
                      setMoral(st.moral);
                      setStoryTitle(st.title);
                    }}
                    className={`p-2 rounded-xl text-left transition-all border cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-600 shadow-sm font-black'
                        : 'bg-slate-50 hover:bg-amber-50 text-slate-800 border-slate-200 text-xs font-bold'
                    }`}
                  >
                    <span>{st.crestEmoji}</span>
                    <span className="text-xs line-clamp-1">{st.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Title Input */}
            <div className="space-y-1 pt-1">
              <label className="text-xs font-nunito font-bold text-slate-700 block">
                Custom Storybook Cover Title:
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => {
                  setCustomTitle(e.target.value);
                  setStoryTitle(e.target.value);
                }}
                placeholder="Enter custom book title..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-display font-black text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Step 2: Stamp 3 Climax Author Seals */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-nunito font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Step 2: Stamp the 3 Climax Author Seals
              </span>
              <span className="text-xs font-bold text-slate-500">
                Click cards to stamp/unstamp
              </span>
            </div>

            <div className="space-y-2.5">
              {seals.map((seal) => {
                const Icon = seal.icon;
                return (
                  <motion.div
                    key={seal.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleToggleSeal(seal.id)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      seal.stamped
                        ? 'bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-amber-400 shadow-sm'
                        : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                        seal.stamped ? seal.iconBg : 'bg-slate-200 text-slate-500'
                      } text-white`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-nunito font-extrabold uppercase tracking-wider text-amber-700 block">
                          {seal.pillar}
                        </span>
                        <h5 className="font-display font-black text-sm text-slate-900">
                          {seal.badgeName}
                        </h5>
                        <p className="font-nunito text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                          {seal.description}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-xl font-display font-black text-xs shrink-0 transition-all ${
                        seal.stamped
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
                      }`}
                    >
                      {seal.stamped ? '✅ Stamped' : '+ Stamp Seal'}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Choose Resolution Style & Moral Takeaway */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <span className="text-xs font-nunito font-black uppercase tracking-wider text-amber-700 block">
              Step 3: Choose Final Climax Resolution Strategy
            </span>

            <div className="space-y-2">
              {activeStrategies.map((strat) => {
                const isSelected = selectedStrat.id === strat.id;
                return (
                  <div
                    key={strat.id}
                    onClick={() => { playTap(); setSelectedStrat(strat); }}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 shadow-sm ring-1 ring-amber-400'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl p-1.5 rounded-lg bg-white shadow-xs border border-slate-200">
                        {strat.icon}
                      </span>
                      <div>
                        <h5 className="font-display font-black text-xs text-slate-900">
                          {strat.title}
                        </h5>
                        <span className="text-[10px] font-nunito font-bold text-amber-700">
                          {strat.type} • Creative Score: {strat.creativeScore}
                        </span>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />}
                  </div>
                );
              })}
            </div>

            {/* Class Takeaway Moral */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-nunito font-bold text-slate-700 block">
                Classroom Takeaway Moral:
              </label>
              <input
                type="text"
                value={moral}
                onChange={(e) => setMoral(e.target.value)}
                placeholder="What moral does this story teach?"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs font-nunito font-bold text-slate-800 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Final Action Button: Advance to Level 6 Storybook */}
          <motion.button
            whileHover={{ scale: isCoverReady ? 1.02 : 1 }}
            whileTap={{ scale: isCoverReady ? 0.98 : 1 }}
            type="button"
            disabled={!isCoverReady}
            onClick={handleAdvanceLevel}
            className={`w-full btn-story-primary !py-4 !text-base shadow-2xl flex items-center justify-center gap-3 font-display font-black cursor-pointer transition-all ${
              isCoverReady
                ? '!bg-gradient-to-r !from-amber-500 !to-orange-600 text-white'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>{isCoverReady ? '🏆 Bind Cover & Open Digital Storybook (Level 6)' : '🔒 Stamp All 3 Seals to Finish Book Cover'}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>

        </div>

      </div>

    </div>
  );
};
