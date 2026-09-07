import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Check, ArrowRight, Wand2, Compass, Flame, BookOpen, Star, Award, Info, HelpCircle, X, Crosshair, Cpu, Scroll, Layers, Radio, Sword, Feather } from 'lucide-react';
import { HEROES, COMPANIONS, HERO_COMPANIONS_MAP } from '../../data/storyData';
import { CharacterArchetype, SupportingCompanion } from '../../types/story';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';

interface CharacterGearItem {
  id: string;
  name: string;
  heroId: string;
  category: string;
  effect: string;
  description: string;
}

// Lore-Accurate Equipment Roster for Each Character
const HERO_LORE_GEAR: Record<string, CharacterGearItem[]> = {
  'hero-naruto': [
    { id: 'gear-kunai', name: 'Shadow Kunai & Holster', heroId: 'hero-naruto', category: 'Ninja Tool', effect: '+25 Precision & Defense', description: 'Reinforced steel kunai with explosive chakra seal tags for tactical combat.' },
    { id: 'gear-headband', name: 'Leaf Village Headband', heroId: 'hero-naruto', category: 'Shinobi Honor', effect: '+30 Willpower', description: 'Sacred shinobi metal forehead protector focusing chakra flow.' },
    { id: 'gear-toad-scroll', name: 'Toad Sage Summoning Scroll', heroId: 'hero-naruto', category: 'Summoning Pact', effect: '+35 Summoning', description: 'Mount Myoboku parchment contract summoning Gamakichi and toad allies.' },
    { id: 'gear-chakra-balloon', name: 'Water Balloon Training Orb', heroId: 'hero-naruto', category: 'Chakra Control', effect: '+20 Jutsu Mastery', description: 'Specialized rubber orb used to practice rapid multi-directional chakra rotation.' }
  ],
  'hero-goku': [
    { id: 'gear-powerpole', name: 'Power Pole (Nyoibo)', heroId: 'hero-goku', category: 'Martial Relic', effect: '+30 Reach & Combat', description: 'Legendary red extending staff enchanted by Korin to reach high skies.' },
    { id: 'gear-dragonradar', name: 'Capsule Corp Dragon Radar', heroId: 'hero-goku', category: 'Cosmic Tech', effect: '+35 Scanning Intel', description: 'Bulma’s electromagnetic sensor calibrated to track Dragon Ball frequencies.' },
    { id: 'gear-weighted-gi', name: 'Weighted Training Gi & Boots', heroId: 'hero-goku', category: 'Gravity Regimen', effect: '+25 Speed & Stamina', description: 'Heavy martial training gear that unlocks blistering speed when removed.' },
    { id: 'gear-senzu', name: 'Sacred Senzu Bean Pouch', heroId: 'hero-goku', category: 'Divine Recovery', effect: '+100 Full Energy', description: 'Sacred beans that instantly restore stamina and heal battle fatigue.' }
  ],
  'hero-po': [
    { id: 'gear-steamer', name: 'Mr. Ping’s Golden Dumpling Steamer', heroId: 'hero-po', category: 'Secret Recipe', effect: '+30 Focus & Humor', description: 'Handcrafted bamboo steamer infused with secret ingredient noodle broth.' },
    { id: 'gear-oogway-staff', name: 'Sacred Peach Blossom Staff', heroId: 'hero-po', category: 'Chi Conduit', effect: '+35 Inner Peace', description: 'Master Oogway’s wooden walking staff radiating tranquil Chi waves.' },
    { id: 'gear-furious-amulet', name: 'Furious Five Jade Amulet', heroId: 'hero-po', category: 'Teamwork Guard', effect: '+25 Synchronized Kata', description: 'Ancient jade talisman uniting Tigress, Monkey, Crane, Viper, and Mantis.' },
    { id: 'gear-patch-pants', name: 'Patchwork Martial Arts Pants', heroId: 'hero-po', category: 'Panda Agility', effect: '+20 Impact Deflection', description: 'Silk and linen kung fu pants tailored for belly ricochets and splits.' }
  ],
  'hero-ironman': [
    { id: 'gear-jarvis-hud', name: 'J.A.R.V.I.S. Tactical AI HUD', heroId: 'hero-ironman', category: 'AI Computing', effect: '+35 Real-Time Analysis', description: 'Autonomous neural heads-up display scanning vulnerabilities and trajectories.' },
    { id: 'gear-nanotech-deployer', name: 'Mark L Nanotech Deployer', heroId: 'hero-ironman', category: 'Nanotechnology', effect: '+30 Adaptive Shields', description: 'Microscopic alloy swarm that morphs instantly into shields and plasma blades.' },
    { id: 'gear-repulsor-thrusters', name: 'Hypersonic Repulsor Thrusters', heroId: 'hero-ironman', category: 'Propulsion', effect: '+25 Supersonic Flight', description: 'Sub-orbital ion stabilization thrusters with unibeam synchronization.' },
    { id: 'gear-arc-gauntlet', name: 'Vibranium Arc Reactor Gauntlet', heroId: 'hero-ironman', category: 'Clean Energy', effect: '+30 Energy Output', description: 'Aerospace gauntlet capable of directing clean plasma fusion bursts.' }
  ]
};

// Default universal lore gear
const ALL_LORE_GEAR: CharacterGearItem[] = [
  HERO_LORE_GEAR['hero-naruto'][0], // Shadow Kunai
  HERO_LORE_GEAR['hero-ironman'][0], // J.A.R.V.I.S.
  HERO_LORE_GEAR['hero-goku'][0],   // Power Pole
  HERO_LORE_GEAR['hero-po'][0]      // Dumpling Steamer
];

export const Level1HeroForge: React.FC = () => {
  const { hero, setHero, companion, setCompanion, setCurrentLevel, currentBatonHolder } = useStoryState();
  const { 
    playTap, 
    playAchievement, 
    playBatonPass, 
    playTwistSpin,
    playCharacterSound,
    stopCharacterSound 
  } = useAudio();

  // No hero selected by default if hero is null
  const [selectedHero, setSelectedHero] = useState<CharacterArchetype | null>(hero || null);
  const defaultCompanion = (hero && HERO_COMPANIONS_MAP[hero.id]) || companion || COMPANIONS[0];
  const [selectedCompanion, setSelectedCompanion] = useState<SupportingCompanion>(defaultCompanion);
  
  // Active character lore gear
  const activeGearList = selectedHero ? (HERO_LORE_GEAR[selectedHero.id] || ALL_LORE_GEAR) : ALL_LORE_GEAR;
  const [equippedGear, setEquippedGear] = useState<string[]>([activeGearList[0]?.id || 'gear-kunai']);
  const [customMotto, setCustomMotto] = useState(hero ? hero.quote : '');
  
  // Activity Explanation Pop-up Modal State (opens by default on entry)
  const [isExplainerOpen, setIsExplainerOpen] = useState(true);

  // Update equipped gear default when hero changes
  useEffect(() => {
    if (selectedHero && HERO_LORE_GEAR[selectedHero.id]) {
      setEquippedGear([HERO_LORE_GEAR[selectedHero.id][0].id, HERO_LORE_GEAR[selectedHero.id][1].id]);
    }
  }, [selectedHero?.id]);

  // GIF Continuous Looping State (In-place auto switching)
  const activeGifs = selectedHero
    ? (selectedHero.gifs && selectedHero.gifs.length > 0 
        ? selectedHero.gifs 
        : (selectedHero.image ? [selectedHero.image] : []))
    : [];
  
  const [gifIndex, setGifIndex] = useState(0);

  // Stop character sound when navigating away or unmounting
  useEffect(() => {
    return () => {
      stopCharacterSound();
    };
  }, [stopCharacterSound]);

  // Reset GIF index when active hero changes
  useEffect(() => {
    setGifIndex(0);
  }, [selectedHero?.id]);

  // Continuous seamless looping through character's GIFs in place
  useEffect(() => {
    if (!activeGifs || activeGifs.length <= 1) return;
    const interval = setInterval(() => {
      setGifIndex((prev) => (prev + 1) % activeGifs.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [activeGifs]);

  // Power Trial Arcade Game State
  const [powerCharge, setPowerCharge] = useState(30);
  const [isCharging, setIsCharging] = useState(false);
  const [trialCompleted, setTrialCompleted] = useState(false);
  const [trialScore, setTrialScore] = useState<number | null>(null);

  // Power Charge Loop
  useEffect(() => {
    let timer: any;
    if (isCharging) {
      timer = setInterval(() => {
        setPowerCharge(prev => {
          if (prev >= 100) return 0;
          return prev + 4;
        });
      }, 40);
    }
    return () => clearInterval(timer);
  }, [isCharging]);

  // Handle Hero Selection & Sound Hook
  const handleHeroSelect = (h: CharacterArchetype) => {
    playTap();
    setSelectedHero(h);
    setHero(h);
    setCustomMotto(h.quote);

    // Auto-select canonical companion for the hero
    const canonCompanion = HERO_COMPANIONS_MAP[h.id] || COMPANIONS[0];
    setSelectedCompanion(canonCompanion);
    setCompanion(canonCompanion);
    setTrialCompleted(false);
    setTrialScore(null);

    // Play character theme sound on continuous loop until next chapter
    playCharacterSound(h.id, h.soundUrl, h.soundStartTime);
  };

  const handleCompanionSelect = (c: SupportingCompanion) => {
    playTap();
    setSelectedCompanion(c);
    setCompanion(c);
  };

  const toggleGear = (gearId: string) => {
    playTap();
    setEquippedGear(prev =>
      prev.includes(gearId) ? prev.filter(id => id !== gearId) : [...prev, gearId]
    );
  };

  // Test Power Mini-Game Strike
  const handleStrikeRune = () => {
    setIsCharging(false);
    const score = Math.round(100 - Math.abs(powerCharge - 85) * 1.5);
    const finalScore = Math.max(10, Math.min(100, score));
    setTrialScore(finalScore);
    playAchievement();

    if (finalScore >= 75) {
      setTrialCompleted(true);
      try {
        confetti({ particleCount: 80, spread: 90, origin: { y: 0.6 } });
      } catch {}
    } else {
      playTwistSpin();
    }
  };

  const handleAdvanceLevel = () => {
    if (!selectedHero) {
      alert('Please select a hero first!');
      return;
    }
    stopCharacterSound();
    playBatonPass();
    setHero({ ...selectedHero, quote: customMotto || selectedHero.quote });
    setCompanion(selectedCompanion);
    setCurrentLevel('level-2');
  };

  // Dynamic Theme Styling Helpers
  const cardBg = selectedHero?.themeStyles?.cardBg || 'from-slate-900 via-indigo-950 to-slate-900';
  const borderClass = selectedHero?.themeStyles?.borderClass || 'border-amber-400 ring-4 ring-amber-400/30';
  const badgeBg = selectedHero?.themeStyles?.badgeBg || 'bg-amber-500/20 text-amber-300 border-amber-400/40';
  const accentText = selectedHero?.themeStyles?.accentText || 'text-amber-300';
  const statColors = selectedHero?.themeStyles?.statColors || {
    courage: 'bg-amber-400',
    ingenuity: 'bg-cyan-400',
    teamwork: 'bg-emerald-400',
    willpower: 'bg-purple-400'
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-12">
      
      {/* ── WELCOME & ACTIVITY EXPLANATION POP-UP MODAL ── */}
      <AnimatePresence>
        {isExplainerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-emerald-400 overflow-hidden text-slate-900"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 text-white flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-nunito font-black uppercase tracking-widest text-emerald-200 block">
                    Activity 1 Orientation
                  </span>
                  <h3 className="font-display font-black text-2xl text-white">
                    Starter Cove & Hero Academy
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => { playTap(); setIsExplainerOpen(false); }}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition-colors"
                  title="Close Guide"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-8 space-y-5 max-h-[70vh] overflow-y-auto font-nunito">
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-bold">
                  Every story sprint begins by defining the protagonist, their supporting companions, and their specialized lore gear.
                </p>

                {/* 4 Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block">Step 1</span>
                    <h5 className="font-display font-black text-sm text-emerald-950 mt-0.5">
                      Select Character Archetype
                    </h5>
                    <p className="text-xs text-slate-600 mt-1">
                      Choose between Naruto Uzumaki, Son Goku, Po the Dragon Warrior, or Tony Stark (Iron Man).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-cyan-50 border border-cyan-200">
                    <span className="text-[10px] font-black uppercase text-cyan-700 tracking-wider block">Step 2</span>
                    <h5 className="font-display font-black text-sm text-cyan-950 mt-0.5">
                      Inspect Action Clips & Theme
                    </h5>
                    <p className="text-xs text-slate-600 mt-1">
                      Watch looping action clips, review storytelling stat bars, and listen to the character anthem.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
                    <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider block">Step 3</span>
                    <h5 className="font-display font-black text-sm text-purple-950 mt-0.5">
                      Equip Lore Gear & Companion
                    </h5>
                    <p className="text-xs text-slate-600 mt-1">
                      Equip iconic lore gear (Kunai, J.A.R.V.I.S., Power Pole, Dumpling Steamer) and pair with a loyal ally.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                    <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider block">Step 4</span>
                    <h5 className="font-display font-black text-sm text-amber-950 mt-0.5">
                      Power Trial Arcade
                    </h5>
                    <p className="text-xs text-slate-600 mt-1">
                      Time your charge strike to calibrate the team matrix before advancing to Level 2.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between text-xs font-nunito font-bold">
                  <span>Click on any hero card to inspect their stats and begin.</span>
                  <span className="text-emerald-400 uppercase tracking-widest font-black text-[11px]">
                    4 Characters Ready
                  </span>
                </div>

                {/* Confirm Button */}
                <button
                  type="button"
                  onClick={() => { playTap(); setIsExplainerOpen(false); }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-display font-black text-base shadow-lg hover:scale-[1.01] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Select Character</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-xl p-6 rounded-3xl border-2 border-emerald-300 shadow-xl">
        <div>
          <span className="text-xs font-nunito font-extrabold uppercase tracking-widest text-emerald-600">
            Level 1 • Starter Cove
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
            Assemble Your Hero Team & Lore Gear
          </h2>
          <p className="font-nunito text-sm text-slate-600">
            Select your protagonist, equip canonical lore gear, and calibrate team attributes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => { playTap(); setIsExplainerOpen(true); }}
            className="px-3.5 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-nunito font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>Activity Guide</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-900 text-white border border-slate-700 px-3.5 py-2 rounded-2xl shadow-xs">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-nunito font-bold">
              Active Baton: {currentBatonHolder}
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Hero Selection Grid & Hero Power Card */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Select Hero Archetype */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-nunito font-black uppercase tracking-wider text-emerald-600 block">
                  Step 1 of 3
                </span>
                <h3 className="font-display font-black text-xl text-slate-800">
                  Select Your Hero Archetype
                </h3>
              </div>
              <span className="text-xs font-nunito font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                {selectedHero ? `Selected: ${selectedHero.name}` : 'Click to Select a Hero'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {HEROES.map((h) => {
                const isSelected = selectedHero?.id === h.id;
                return (
                  <motion.button
                    key={h.id}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => handleHeroSelect(h)}
                    className={`relative p-3 rounded-2xl text-center border-2 transition-all cursor-pointer flex flex-col items-center justify-between min-h-[140px] overflow-hidden ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-lg ring-3 ring-emerald-400/60'
                        : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50/80 shadow-sm'
                    }`}
                  >
                    {/* Character Avatar Icon */}
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 shadow-md mb-2 bg-slate-100 flex items-center justify-center shrink-0">
                      {h.image ? (
                        <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-display font-bold">{h.name[0]}</span>
                      )}
                    </div>

                    <div className="w-full">
                      <h4 className="font-display font-black text-xs text-slate-900 leading-snug line-clamp-1">
                        {h.name}
                      </h4>
                      <span className="text-[10px] font-nunito font-bold text-slate-500 block line-clamp-1">
                        {h.storyArchetype}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* SELECTED HERO POWER & DESCRIPTION CARD */}
          <AnimatePresence mode="wait">
            {selectedHero ? (
              <motion.div
                key={selectedHero.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className={`bg-gradient-to-br ${cardBg} rounded-3xl p-6 sm:p-7 text-white border-4 ${borderClass} space-y-5 transition-all duration-300 shadow-2xl`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/20">
                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/80 shadow-xl shrink-0 bg-black/20">
                      <img src={selectedHero.image} alt={selectedHero.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] font-nunito font-black tracking-widest uppercase block opacity-90">
                        Hero Power Profile
                      </span>
                      <h4 className="font-display font-black text-2xl text-white drop-shadow-sm">
                        {selectedHero.name}
                      </h4>
                      <span className={`text-xs font-nunito font-bold ${accentText}`}>
                        {selectedHero.title}
                      </span>
                    </div>
                  </div>
                </div>

                {/* DYNAMIC CONTINUOUS IN-PLACE GIF PLAYER */}
                <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden bg-black/50 border-2 border-white/30 shadow-inner flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${selectedHero.id}-${gifIndex}`}
                      src={activeGifs[gifIndex]}
                      alt={selectedHero.name}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0.5 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = selectedHero.image || '';
                      }}
                    />
                  </AnimatePresence>
                </div>

                {/* Story Building Lesson Box */}
                <div className={`p-4 rounded-2xl border backdrop-blur-md space-y-2 ${badgeBg}`}>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-white" />
                    <span className="font-display font-black text-xs uppercase tracking-wider text-white">
                      Story Building Lesson:
                    </span>
                  </div>
                  <p className="font-nunito text-xs text-white/95 leading-relaxed">
                    {selectedHero.teachingNote || selectedHero.personality}
                  </p>
                  <div className={`pt-1 text-[11px] font-nunito font-extrabold ${accentText}`}>
                    <strong>Core Moral:</strong> "{selectedHero.moral || selectedHero.quote}"
                  </div>
                </div>

                {/* Storytelling Stat Bars */}
                {selectedHero.stats && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/35 p-3.5 rounded-2xl border border-white/20 backdrop-blur-md">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-nunito font-bold text-white/90">
                        <span>Courage</span>
                        <span className="font-black text-white">{selectedHero.stats.courage}%</span>
                      </div>
                      <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
                        <div className={`h-full ${statColors.courage}`} style={{ width: `${selectedHero.stats.courage}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-nunito font-bold text-white/90">
                        <span>Ingenuity</span>
                        <span className="font-black text-white">{selectedHero.stats.ingenuity}%</span>
                      </div>
                      <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
                        <div className={`h-full ${statColors.ingenuity}`} style={{ width: `${selectedHero.stats.ingenuity}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-nunito font-bold text-white/90">
                        <span>Teamwork</span>
                        <span className="font-black text-white">{selectedHero.stats.teamwork}%</span>
                      </div>
                      <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
                        <div className={`h-full ${statColors.teamwork}`} style={{ width: `${selectedHero.stats.teamwork}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-nunito font-bold text-white/90">
                        <span>Willpower</span>
                        <span className="font-black text-white">{selectedHero.stats.willpower}%</span>
                      </div>
                      <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
                        <div className={`h-full ${statColors.willpower}`} style={{ width: `${selectedHero.stats.willpower}%` }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Special Ability & Signature Move */}
                <div className="flex flex-col sm:flex-row gap-3 text-xs font-nunito">
                  <div className="flex-1 bg-black/35 p-3 rounded-xl border border-white/20 backdrop-blur-md">
                    <span className={`font-black block mb-0.5 ${accentText}`}>Special Ability:</span>
                    <span className="text-white/90">{selectedHero.specialAbility}</span>
                  </div>
                  {selectedHero.signatureMove && (
                    <div className="flex-1 bg-black/35 p-3 rounded-xl border border-white/20 backdrop-blur-md">
                      <span className={`font-black block mb-0.5 ${accentText}`}>Signature Move:</span>
                      <span className="text-white/90">{selectedHero.signatureMove}</span>
                    </div>
                  )}
                </div>

              </motion.div>
            ) : (
              <motion.div
                key="no-hero-selected"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border-2 border-dashed border-slate-300 text-center space-y-4 shadow-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                  <Shield className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-display font-black text-xl text-slate-800">
                    No Hero Selected Yet
                  </h4>
                  <p className="font-nunito text-xs text-slate-500 max-w-md mx-auto mt-1">
                    Click on any of the 4 legendary heroes above to view their theme styling, inspect action clips, and hear their anthem.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2. Supporting Companion Pairing */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-emerald-300 shadow-md">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
                2
              </span>
              <h3 className="font-display font-black text-base sm:text-lg text-slate-900 tracking-wide">
                Pair a Faithful Companion:
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMPANIONS.map((c) => {
                const isSelected = selectedCompanion?.id === c.id;
                return (
                  <motion.div
                    key={c.id}
                    onClick={() => handleCompanionSelect(c)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`rounded-2xl p-3.5 border-2 cursor-pointer transition-all flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-400/30'
                        : 'bg-white/90 backdrop-blur-md border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <h5 className="font-display font-black text-sm text-slate-900 leading-tight">
                        {c.name}
                      </h5>
                      <span className="font-nunito text-[11px] text-emerald-700 font-bold block">
                        {c.quirk || c.howTheyHelp}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 3. Character-Lore Gear Loadout Matrix */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-blue-300 shadow-md">
              <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm">
                3
              </span>
              <h3 className="font-display font-black text-base sm:text-lg text-slate-900 tracking-wide">
                Equip Character Lore Gear:
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeGearList.map((g) => {
                const isEquipped = equippedGear.includes(g.id);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => toggleGear(g.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                      isEquipped
                        ? 'bg-blue-50/95 border-blue-500 shadow-md ring-2 ring-blue-400/30'
                        : 'bg-white/85 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-nunito font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {g.category}
                      </span>
                      {isEquipped && (
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="font-display font-black text-sm text-slate-900 leading-tight block">
                        {g.name}
                      </span>
                      <p className="font-nunito text-xs text-slate-600 mt-1 leading-snug">
                        {g.description}
                      </p>
                    </div>
                    <span className="font-nunito text-[11px] text-blue-700 font-bold block pt-1 border-t border-slate-200/80">
                      {g.effect}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Mini-Game Power Trial & Level Advance */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* MINI-GAME: Ancient Power Trial Arcade */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 rounded-3xl p-6 text-white border-3 border-amber-400 shadow-2xl space-y-5 sticky top-24">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
                <span className="font-display font-black text-amber-300 text-sm uppercase tracking-wider">
                  {selectedHero ? `${selectedHero.name.split(' ')[0]}'s Power Trial` : 'Hero Power Trial Arcade'}
                </span>
              </div>
              {trialCompleted && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-nunito font-black text-xs">
                  Trial Passed
                </span>
              )}
            </div>

            <p className="font-nunito text-xs text-slate-300">
              {selectedHero 
                ? `Hold the Charge button and release in the Sweet Spot (80-90%) to unleash ${selectedHero.signatureMove || 'Hero Power'}!`
                : 'Select a hero archetype on the left to activate this power calibration trial.'}
            </p>

            {/* Power Meter Gauge */}
            <div className="space-y-2 bg-slate-950/80 p-4 rounded-2xl border border-slate-700">
              <div className="flex justify-between text-xs font-nunito font-bold">
                <span className="text-slate-400">Energy Matrix</span>
                <span className={`font-black ${powerCharge >= 80 && powerCharge <= 90 ? 'text-amber-400 animate-pulse' : 'text-slate-200'}`}>
                  {powerCharge}% Power
                </span>
              </div>

              {/* Meter Bar */}
              <div className="relative h-6 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-600">
                {/* Sweet Spot Target Zone */}
                <div className="absolute top-0 bottom-0 left-[80%] right-[10%] bg-emerald-400/40 border-x-2 border-emerald-300 flex items-center justify-center">
                  <span className="text-[9px] font-black text-emerald-200 uppercase tracking-tighter">
                    TARGET
                  </span>
                </div>
                {/* Active Charge Fill */}
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-amber-400 transition-all duration-75"
                  style={{ width: `${powerCharge}%` }}
                />
              </div>

              {/* Game Control Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={!selectedHero}
                  onMouseDown={() => selectedHero && setIsCharging(true)}
                  onTouchStart={() => selectedHero && setIsCharging(true)}
                  className={`flex-1 py-3 rounded-xl font-display font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                    !selectedHero 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : isCharging
                      ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-300 cursor-pointer'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                  }`}
                >
                  <Flame className="w-4 h-4 text-amber-300" />
                  <span>{isCharging ? 'CHARGING...' : 'HOLD TO CHARGE'}</span>
                </button>

                <button
                  type="button"
                  disabled={!selectedHero}
                  onClick={handleStrikeRune}
                  className={`px-5 py-3 rounded-xl font-display font-black text-sm shadow-lg flex items-center gap-1.5 ${
                    !selectedHero
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>STRIKE</span>
                </button>
              </div>

              {trialScore !== null && (
                <div className="text-center pt-2">
                  <span className="font-display font-black text-sm text-amber-300">
                    Strike Impact: {trialScore}% — {trialScore >= 75 ? 'Trial Smashed! Power Unlocked' : 'Close! Try hitting the target zone'}
                  </span>
                </div>
              )}
            </div>

            {/* Custom Battle Cry Input */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-nunito font-bold text-amber-300 block">
                Hero's Custom Motto / Quote:
              </label>
              <input
                type="text"
                value={customMotto}
                onChange={(e) => setCustomMotto(e.target.value)}
                placeholder={selectedHero ? selectedHero.quote : "Select a hero to enter motto..."}
                disabled={!selectedHero}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-nunito text-white focus:outline-none focus:border-amber-400 disabled:opacity-50"
              />
            </div>

            {/* Advance to Level 2 Button */}
            <motion.button
              whileHover={{ scale: selectedHero ? 1.03 : 1 }}
              whileTap={{ scale: selectedHero ? 0.97 : 1 }}
              type="button"
              disabled={!selectedHero}
              onClick={handleAdvanceLevel}
              className={`w-full btn-story-primary !py-4 !text-base shadow-2xl flex items-center justify-center gap-3 font-display font-black transition-all ${
                selectedHero
                  ? '!bg-gradient-to-r !from-emerald-500 !to-teal-600 cursor-pointer text-white'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <span>
                {selectedHero 
                  ? `Lock In ${selectedHero.name.split(' ')[0]} & Enter Sun Temple` 
                  : 'Select a Hero to Begin'}
              </span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>

          </div>

        </div>

      </div>

    </div>
  );
};
