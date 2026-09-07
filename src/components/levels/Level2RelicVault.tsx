import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, CheckCircle2, Lock, Unlock, ArrowRight, Zap, Sun, Award, HelpCircle, Lightbulb, Shield, BookOpen, Layers } from 'lucide-react';
import { IMPORTANT_OBJECTS, STORY_PROBLEMS, HERO_RELICS_MAP, HERO_PROBLEMS_MAP } from '../../data/storyData';
import { StoryObject, StoryProblem } from '../../types/story';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';
import { Character3DSimulation } from '../simulation/Character3DSimulation';

export const Level2RelicVault: React.FC = () => {
  const { 
    importantObject, 
    setImportantObject, 
    problem, 
    setProblem, 
    setCurrentLevel, 
    hero, 
    companion,
    currentBatonHolder 
  } = useStoryState();
  const { playTap, playAchievement, playFanfare, playBatonPass } = useAudio();

  // Canonical hero relic & problem
  const defaultRelic = (hero && HERO_RELICS_MAP[hero.id]) || importantObject || IMPORTANT_OBJECTS[0];
  const defaultProblem = (hero && HERO_PROBLEMS_MAP[hero.id]) || problem || STORY_PROBLEMS[0];

  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [selectedRelic, setSelectedRelic] = useState<StoryObject>(defaultRelic);
  const [selectedProblem, setSelectedProblem] = useState<StoryProblem>(defaultProblem);

  // Sync default relic and problem with hero on load
  useEffect(() => {
    if (hero) {
      const r = HERO_RELICS_MAP[hero.id] || IMPORTANT_OBJECTS[0];
      const p = HERO_PROBLEMS_MAP[hero.id] || STORY_PROBLEMS[0];
      setSelectedRelic(r);
      setSelectedProblem(p);
      setImportantObject(r);
      setProblem(p);
    }
  }, [hero]);

  // Triggered when 3D simulation reaches stability lock
  const handleSimulationSuccess = () => {
    playFanfare();
    setVaultUnlocked(true);
  };

  const handleSelectRelic = (obj: StoryObject) => {
    playTap();
    setSelectedRelic(obj);
    setImportantObject(obj);
  };

  const handleSelectProblem = (prob: StoryProblem) => {
    playTap();
    setSelectedProblem(prob);
    setProblem(prob);
  };

  const handleAdvanceLevel = () => {
    playBatonPass();
    setImportantObject(selectedRelic);
    setProblem(selectedProblem);
    setCurrentLevel('level-3');
  };

  // Hero-specific level lore & headers
  const heroId = hero?.id || 'hero-naruto';
  const heroHeader = {
    'hero-naruto': {
      tag: 'Level 2 • Hidden Leaf Grand Hokage Vault',
      title: 'The Sage Chakra & Rasengan Energy Matrix 🌀',
      emoji: '📜',
      bannerColor: 'border-orange-400',
      tagColor: 'bg-orange-100 text-orange-900',
      nextLevelName: 'Whispering Shinobi Forest (Level 3)'
    },
    'hero-goku': {
      tag: 'Level 2 • Capsule Corp Hyper-Gravity Ki Chamber',
      title: 'Saiyan Ki Grid & Dragon Radar Calibration 🐉',
      emoji: '🔮',
      bannerColor: 'border-blue-400',
      tagColor: 'bg-blue-100 text-blue-900',
      nextLevelName: 'Snake Way & Lookout Plateau (Level 3)'
    },
    'hero-po': {
      tag: 'Level 2 • Jade Palace Celestial Hall of Heroes',
      title: 'Oogway\'s Jade Staff & Spirit Portal Vault 🥢',
      emoji: '🐼',
      bannerColor: 'border-emerald-400',
      tagColor: 'bg-emerald-100 text-emerald-900',
      nextLevelName: 'Jade Palace Thousand Steps (Level 3)'
    },
    'hero-ironman': {
      tag: 'Level 2 • Stark Industries Holographic Quantum Lab',
      title: 'Stark Holographic Arc Reactor Grid 🦾',
      emoji: '💠',
      bannerColor: 'border-amber-400',
      tagColor: 'bg-amber-100 text-amber-900',
      nextLevelName: 'New York Hypersonic Skyway (Level 3)'
    }
  }[heroId] || {
    tag: 'Level 2 • Ancient Relic Chamber',
    title: 'The Relic Matrix Calibration Lab 🗝️',
    emoji: '🏛️',
    bannerColor: 'border-amber-300',
    tagColor: 'bg-amber-100 text-amber-800',
    nextLevelName: 'Whispering Jungle (Level 3)'
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-12">
      
      {/* Level Header Banner */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-xl p-6 rounded-3xl border-2 ${heroHeader.bannerColor} shadow-xl`}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-3xl shadow-md border border-white/20">
            {heroHeader.emoji}
          </div>
          <div>
            <span className={`px-3 py-0.5 rounded-full font-nunito font-black text-xs uppercase tracking-widest ${heroHeader.tagColor}`}>
              {heroHeader.tag}
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 leading-tight">
              {heroHeader.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200 text-xs font-nunito font-bold text-slate-800">
          <Key className="w-4 h-4 text-amber-500" />
          <span>Active Storyteller: <strong>{currentBatonHolder}</strong></span>
        </div>
      </div>

      {/* 🎮 3D PHYSICAL SIMULATION STAGE (Character-Bespoke) */}
      <Character3DSimulation
        hero={hero || { id: 'hero-naruto' } as any}
        onSuccess={handleSimulationSuccess}
        isUnlocked={vaultUnlocked}
      />

      {/* Vault Unlocked: Story Relic & Dilemma Formulation */}
      {vaultUnlocked && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 animate-fadeIn"
        >
          
          {/* 1. Choose Legendary Relic with High-Contrast Box */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-amber-300 shadow-md">
              <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm">
                1
              </span>
              <h3 className="font-display font-black text-base sm:text-lg text-slate-900 tracking-wide">
                Discovered Character Relic & Story Artifact:
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {IMPORTANT_OBJECTS.map((obj) => {
                const isSelected = selectedRelic.id === obj.id;
                const isHeroCanon = hero && HERO_RELICS_MAP[hero.id]?.id === obj.id;

                return (
                  <motion.div
                    key={obj.id}
                    onClick={() => handleSelectRelic(obj)}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-5 rounded-3xl border-3 cursor-pointer transition-all flex flex-col justify-between gap-4 relative ${
                      isSelected
                        ? 'bg-white border-amber-500 shadow-xl ring-4 ring-amber-400/30'
                        : 'bg-white/90 backdrop-blur-md border-slate-200 hover:border-amber-300 shadow-sm'
                    }`}
                  >
                    {isHeroCanon && (
                      <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-nunito font-black text-[10px] tracking-wider uppercase shadow-md">
                        ⭐ Canonical Relic
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shadow-inner shrink-0">
                        {obj.emoji}
                      </div>
                      <div>
                        <h4 className="font-display font-black text-base text-slate-900 leading-tight">
                          {obj.name}
                        </h4>
                        <span className="font-nunito font-bold text-xs text-amber-600">
                          {obj.category}
                        </span>
                      </div>
                    </div>
                    <p className="font-nunito text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {obj.description}
                    </p>
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-nunito font-bold text-amber-900">
                      ⚡ Power: {obj.power}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 2. Choose Primary Story Problem with High-Contrast Box */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-rose-300 shadow-md">
              <span className="w-7 h-7 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black text-sm">
                2
              </span>
              <h3 className="font-display font-black text-base sm:text-lg text-slate-900 tracking-wide">
                Character Threat & Narrative Crisis:
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Canonical Hero Problem */}
              {hero && HERO_PROBLEMS_MAP[hero.id] && (
                <motion.div
                  onClick={() => handleSelectProblem(HERO_PROBLEMS_MAP[hero.id])}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-5 rounded-3xl border-3 cursor-pointer transition-all flex flex-col justify-between gap-3 relative ${
                    selectedProblem.id === HERO_PROBLEMS_MAP[hero.id].id
                      ? 'bg-white border-rose-500 shadow-xl ring-4 ring-rose-400/30'
                      : 'bg-white/90 backdrop-blur-md border-slate-200 hover:border-rose-300 shadow-sm'
                  }`}
                >
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-nunito font-black text-[10px] tracking-wider uppercase shadow-md">
                    🔥 Primary Quest Dilemma
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-rose-50 border border-rose-200">
                      {HERO_PROBLEMS_MAP[hero.id].emoji}
                    </span>
                    <div>
                      <h4 className="font-display font-black text-base text-slate-900 leading-tight">
                        {HERO_PROBLEMS_MAP[hero.id].title}
                      </h4>
                      <span className="font-nunito font-extrabold text-[11px] text-rose-600">
                        Threat Level: Critical Realm Crisis
                      </span>
                    </div>
                  </div>
                  <p className="font-nunito text-xs text-slate-600 leading-relaxed">
                    {HERO_PROBLEMS_MAP[hero.id].hook || HERO_PROBLEMS_MAP[hero.id].stakes}
                  </p>
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] font-nunito font-bold text-rose-900">
                    🎯 Class Challenge: {HERO_PROBLEMS_MAP[hero.id].questionForClass}
                  </div>
                </motion.div>
              )}

              {/* Alternate Story Dilemmas */}
              {STORY_PROBLEMS.map((prob) => {
                if (hero && HERO_PROBLEMS_MAP[hero.id]?.id === prob.id) return null;
                const isSelected = selectedProblem.id === prob.id;

                return (
                  <motion.div
                    key={prob.id}
                    onClick={() => handleSelectProblem(prob)}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-5 rounded-3xl border-3 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-white border-rose-500 shadow-xl ring-4 ring-rose-400/30'
                        : 'bg-white/90 backdrop-blur-md border-slate-200 hover:border-rose-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 rounded-2xl bg-rose-50 border border-rose-200">
                        {prob.emoji}
                      </span>
                      <div>
                        <h4 className="font-display font-black text-base text-slate-900 leading-tight">
                          {prob.title}
                        </h4>
                        <span className="font-nunito font-extrabold text-[11px] text-rose-600">
                          Threat Level: Alternate Realm Hazard
                        </span>
                      </div>
                    </div>
                    <p className="font-nunito text-xs text-slate-600 leading-relaxed">
                      {prob.hook || prob.stakes}
                    </p>
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] font-nunito font-bold text-rose-900">
                      🎯 Class Challenge: {prob.questionForClass}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Advance to Level 3 Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleAdvanceLevel}
            className="w-full btn-story-primary !py-4 !text-base shadow-2xl flex items-center justify-center gap-3 font-display font-black !bg-gradient-to-r !from-amber-500 !to-yellow-600 !text-slate-950 cursor-pointer"
          >
            <span>Lock In Artifact & Proceed to {heroHeader.nextLevelName}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>

        </motion.div>
      )}

    </div>
  );
};
