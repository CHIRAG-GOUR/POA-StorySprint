import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Send, ArrowRight, CheckCircle2, RotateCw, Clock, Flame, Shuffle, Trophy, BookOpen, RefreshCw } from 'lucide-react';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';
import { BatonPassModal } from '../baton/BatonPassModal';
import { getHeroTwists, getHeroEpisodeStory } from '../../data/storyData';

export const Level3BatonRelay: React.FC = () => {
  const { currentBatonHolder, addStoryEvent, setCurrentLevel, hero, importantObject, addTwist } = useStoryState();
  const { playTap, playAchievement, playBatonPass, playTwistSpin } = useAudio();

  const heroId = hero?.id || 'hero-naruto';
  const heroTwists = useMemo(() => getHeroTwists(heroId), [heroId]);
  const heroEpisodeStory = useMemo(() => getHeroEpisodeStory(heroId), [heroId]);

  // 🎮 Segmented Twist Wheel State
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeTwistIndex, setActiveTwistIndex] = useState<number | null>(null);

  // 🎮 Sentence Magnet Sprint Game State
  const [sentenceTiles, setSentenceTiles] = useState<string[]>([]);
  const [availableTiles, setAvailableTiles] = useState<{ sentence: string; act: string; icon: string }[]>(heroEpisodeStory);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [sprintComplete, setSprintComplete] = useState(false);

  const [passModalOpen, setPassModalOpen] = useState(false);

  // Sync available tiles when hero changes
  useEffect(() => {
    setAvailableTiles(heroEpisodeStory);
    setSentenceTiles([]);
    setSprintComplete(false);
    setActiveTwistIndex(null);
  }, [heroEpisodeStory]);

  // Live Countdown Timer
  useEffect(() => {
    let interval: any;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(s => s - 1), 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  // Spin the Segmented SVG Twist Wheel
  const handleSpinTwist = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    playTwistSpin();

    const totalSegments = heroTwists.length;
    const segmentAngle = 360 / totalSegments;
    const randomExtraSpins = 5 + Math.floor(Math.random() * 4); // 5 to 8 full spins
    const targetSegment = Math.floor(Math.random() * totalSegments);
    // Align target segment to top pointer (270 degrees or top center)
    const targetOffset = targetSegment * segmentAngle + segmentAngle / 2;
    const newTotalRotation = wheelRotation + randomExtraSpins * 360 + (360 - (wheelRotation % 360)) + (360 - targetOffset);

    setWheelRotation(newTotalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setActiveTwistIndex(targetSegment);
      addTwist(heroTwists[targetSegment]);
      playAchievement();
    }, 3200);
  };

  // Add Magnet Word to Story Line
  const handleAddTile = (tile: { sentence: string; act: string; icon: string }) => {
    playTap();
    if (!timerActive && !sprintComplete) setTimerActive(true);
    setSentenceTiles(prev => [...prev, tile.sentence]);
    setAvailableTiles(prev => prev.filter(t => t.sentence !== tile.sentence));
  };

  const handleRemoveTile = (sentence: string) => {
    playTap();
    const removedItem = heroEpisodeStory.find(t => t.sentence === sentence) || {
      sentence,
      act: 'Story Part',
      icon: '📜'
    };
    setSentenceTiles(prev => prev.filter(s => s !== sentence));
    setAvailableTiles(prev => [...prev, removedItem]);
  };

  // One-click Auto-Assemble full canonical episode story
  const handleAutoAssemble = () => {
    playTap();
    if (!timerActive && !sprintComplete) setTimerActive(true);
    setSentenceTiles(heroEpisodeStory.map(t => t.sentence));
    setAvailableTiles([]);
  };

  const handleResetStory = () => {
    playTap();
    setSentenceTiles([]);
    setAvailableTiles(heroEpisodeStory);
  };

  const handleCompleteSprint = () => {
    if (sentenceTiles.length < 2) {
      alert('Snap at least 2 story scene tiles to construct this chapter!');
      return;
    }
    playAchievement();
    setTimerActive(false);
    setSprintComplete(true);

    const fullText = sentenceTiles.join(' ');
    addStoryEvent({
      chapterId: 'level-3',
      title: `${hero?.name || 'Hero'}’s Canonical Episode Journey`,
      description: fullText,
      storyteller: currentBatonHolder,
      badge: 'Master Story Weaver',
      icon: hero?.avatar || '📜'
    });
  };

  const handleAdvanceLevel = () => {
    playBatonPass();
    setCurrentLevel('level-4');
  };

  // SVG Wheel Slice Colors
  const sliceColors = [
    { bg: '#8b5cf6', stroke: '#7c3aed', text: '#ffffff' }, // Purple
    { bg: '#ec4899', stroke: '#db2777', text: '#ffffff' }, // Pink
    { bg: '#f59e0b', stroke: '#d97706', text: '#ffffff' }, // Amber
    { bg: '#10b981', stroke: '#059669', text: '#ffffff' }, // Emerald
    { bg: '#06b6d4', stroke: '#0891b2', text: '#ffffff' }, // Cyan
    { bg: '#ef4444', stroke: '#dc2626', text: '#ffffff' }  // Red/Coral
  ];

  const totalSlices = heroTwists.length;
  const sliceAngle = 360 / totalSlices;

  return (
    <>
      <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-12">
        
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-xl p-6 rounded-3xl border-2 border-purple-300 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-pink-500 flex items-center justify-center text-3xl text-white shadow-md">
              🌴
            </div>
            <div>
              <span className="px-3 py-0.5 rounded-full bg-purple-100 text-purple-800 font-nunito font-black text-xs uppercase tracking-widest">
                Level 3: Whispering Shinobi Canopy & Stepping Stones
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-900 leading-tight">
                The Plot Twist Wheel & Canonical Story Sprint 🪄
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-2xl border border-purple-200 text-xs font-nunito font-bold text-purple-900">
            <Wand2 className="w-4 h-4 text-purple-600 animate-pulse" />
            <span>Active Storyteller: <strong>{currentBatonHolder}</strong></span>
          </div>
        </div>

        {/* Active Hero Action Spotlight */}
        {hero && (
          <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border-2 border-purple-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {hero.image ? (
                <img
                  src={hero.image}
                  alt={hero.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-400 shadow-sm shrink-0"
                />
              ) : (
                <span className="text-3xl">{hero.avatar}</span>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-nunito font-black px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 uppercase tracking-wider">
                    {hero.storyArchetype}
                  </span>
                  <span className="text-xs font-nunito font-bold text-slate-500">
                    Signature: <strong className="text-purple-700">{hero.signatureMove}</strong>
                  </span>
                </div>
                <h4 className="font-display font-black text-lg text-slate-900 mt-0.5">
                  {hero.name}: Canonical Episode Storyline Arc
                </h4>
                <p className="text-xs font-nunito text-slate-600 line-clamp-1 italic">
                  "{hero.teachingNote}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 bg-purple-50 px-3.5 py-2 rounded-2xl border border-purple-100">
              <span className="text-xs font-nunito font-bold text-purple-900">
                Story Moral: <span className="text-purple-700 font-extrabold">{hero.moral}</span>
              </span>
            </div>
          </div>
        )}

        {/* 2 Main Game Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left 5 Columns: 🎮 High-Precision Segmented SVG Twist Wheel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border-3 border-purple-400/80 shadow-2xl space-y-6 flex flex-col items-center justify-between">
            <div className="text-center space-y-1">
              <span className="text-xs font-nunito font-black text-purple-300 uppercase tracking-widest block">
                Challenge 1: The Island Oracle
              </span>
              <h3 className="font-display font-black text-2xl text-amber-300">
                The Wheel of Plot Twists 🎡
              </h3>
              <p className="font-nunito text-xs text-slate-300">
                Spin the wheel to introduce a surprising story twist for {hero?.name || 'your hero'}!
              </p>
            </div>

            {/* High-Fidelity SVG Segmented Wheel */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              
              {/* Outer Golden Metallic Rim */}
              <div className="absolute inset-0 rounded-full border-8 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)] pointer-events-none z-10" />

              {/* Top Golden Needle Indicator */}
              <div className="absolute -top-3 z-30 flex flex-col items-center">
                <div className="w-0 h-0 border-x-[14px] border-x-transparent border-t-[26px] border-t-amber-300 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] animate-pulse" />
                <div className="w-3 h-3 rounded-full bg-amber-400 -mt-7 border-2 border-white shadow-md" />
              </div>

              {/* Spinning SVG Canvas */}
              <div
                className="w-full h-full rounded-full transition-transform duration-[3200ms] cubic-bezier(0.12, 0.8, 0.15, 1) flex items-center justify-center shadow-2xl"
                style={{ transform: `rotate(${wheelRotation}deg)` }}
              >
                <svg viewBox="0 0 300 300" className="w-full h-full">
                  <defs>
                    <radialGradient id="hubGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="70%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#b45309" />
                    </radialGradient>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.5" />
                    </filter>
                  </defs>

                  {/* 6 Wheel Pie Slices */}
                  {heroTwists.map((twist, index) => {
                    const startAngle = (index * sliceAngle - 90) * (Math.PI / 180);
                    const endAngle = ((index + 1) * sliceAngle - 90) * (Math.PI / 180);
                    const midAngleDeg = index * sliceAngle + sliceAngle / 2;

                    const r = 142;
                    const cx = 150;
                    const cy = 150;

                    const x1 = cx + r * Math.cos(startAngle);
                    const y1 = cy + r * Math.sin(startAngle);
                    const x2 = cx + r * Math.cos(endAngle);
                    const y2 = cy + r * Math.sin(endAngle);

                    const colorScheme = sliceColors[index % sliceColors.length];

                    return (
                      <g key={twist.id}>
                        {/* Wedge Path */}
                        <path
                          d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                          fill={colorScheme.bg}
                          stroke="#ffffff"
                          strokeWidth="2.5"
                        />

                        {/* Rotated Slice Label & Emoji */}
                        <g transform={`rotate(${midAngleDeg}, ${cx}, ${cy})`}>
                          <text
                            x={cx}
                            y={50}
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="17"
                            filter="url(#shadow)"
                          >
                            {twist.emoji}
                          </text>
                          <text
                            x={cx}
                            y={68}
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="9.5"
                            fontWeight="800"
                            fontFamily="'Nunito', sans-serif"
                            filter="url(#shadow)"
                            className="uppercase tracking-tight"
                          >
                            {twist.title.length > 15 ? twist.title.slice(0, 14) + '…' : twist.title}
                          </text>
                        </g>
                      </g>
                    );
                  })}

                  {/* 12 Outer Gold Rivets */}
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = (i * 30 * Math.PI) / 180;
                    const rx = 150 + 138 * Math.cos(angle);
                    const ry = 150 + 138 * Math.sin(angle);
                    return (
                      <circle
                        key={i}
                        cx={rx}
                        cy={ry}
                        r="3.5"
                        fill="#fef08a"
                        stroke="#d97706"
                        strokeWidth="1.5"
                      />
                    );
                  })}

                  {/* Center Chrome Hub */}
                  <circle cx="150" cy="150" r="30" fill="url(#hubGradient)" stroke="#ffffff" strokeWidth="3" />
                  <circle cx="150" cy="150" r="14" fill="#1e1b4b" />
                  <text x="150" y="155" textAnchor="middle" fill="#fef08a" fontSize="13" fontWeight="900">
                    {hero?.avatar || '⭐'}
                  </text>
                </svg>
              </div>
            </div>

            {/* Twist Result Callout */}
            {activeTwistIndex !== null && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full p-4 rounded-2xl bg-purple-900/80 border-2 border-amber-300 text-center shadow-lg"
              >
                <div className="flex items-center justify-center gap-2 text-amber-300 font-display font-black text-base">
                  <span className="text-xl">{heroTwists[activeTwistIndex].emoji}</span>
                  <span>{heroTwists[activeTwistIndex].title}</span>
                </div>
                <p className="font-nunito text-xs text-slate-200 mt-1">
                  {heroTwists[activeTwistIndex].description}
                </p>
                <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-nunito font-extrabold text-[11px]">
                  💡 {heroTwists[activeTwistIndex].storyPrompt}
                </span>
              </motion.div>
            )}

            {/* Spin Button */}
            <button
              type="button"
              disabled={isSpinning}
              onClick={handleSpinTwist}
              className="w-full btn-story-primary !bg-gradient-to-r !from-purple-500 !via-pink-500 !to-amber-500 !text-white font-black !py-4 shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span className="tracking-wide">{isSpinning ? 'Oracle Spinning...' : 'SPIN THE TWIST WHEEL!'}</span>
            </button>
          </div>

          {/* Right 7 Columns: 🎮 Authentic Canonical Story Sprint */}
          <div className="lg:col-span-7 bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xl space-y-6 flex flex-col justify-between">
            
            {/* Top Bar with Timer & Quick Auto-Assemble */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
              <div>
                <span className="text-xs font-nunito font-bold text-purple-600 uppercase tracking-widest block">
                  Challenge 2: Canonical Storyline Sprint
                </span>
                <h3 className="font-display font-black text-2xl text-slate-900">
                  Build {hero?.name || 'Hero'}’s Episode Scene
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAutoAssemble}
                  className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 font-nunito font-black text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                  title="Snap all canonical storyline sentences in sequence"
                >
                  <Wand2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Auto-Assemble Arc</span>
                </button>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-amber-300 font-display font-black text-xs">
                  <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>{timerSeconds}s</span>
                </div>
              </div>
            </div>

            {/* Assembled Episode Scene Container */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-nunito font-bold text-slate-600">
                <span>Assembled Episode Journey ({sentenceTiles.length} Scene Blocks):</span>
                {sentenceTiles.length > 0 && (
                  <button
                    type="button"
                    onClick={handleResetStory}
                    className="text-purple-600 hover:text-rose-600 flex items-center gap-1 cursor-pointer font-extrabold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              <div className="min-h-32 p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-2 border-dashed border-purple-400 flex flex-col gap-2.5 shadow-inner">
                {sentenceTiles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-1">
                    <BookOpen className="w-7 h-7 text-purple-400 mb-1 opacity-60" />
                    <span className="font-nunito text-xs italic">
                      Tap the authentic episode story tiles below (or click <strong>"Auto-Assemble Arc"</strong>) to construct {hero?.name}’s legendary adventure!
                    </span>
                  </div>
                ) : (
                  sentenceTiles.map((sentence, i) => (
                    <motion.div
                      key={i}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-purple-800/80 hover:bg-purple-700 border border-purple-400/50 shadow-md group transition-all"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-display font-black text-[11px] shrink-0 mt-0.5">
                          #{i + 1}
                        </span>
                        <p className="font-nunito font-bold text-xs sm:text-sm text-slate-100 leading-relaxed">
                          {sentence}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveTile(sentence)}
                        className="text-purple-300 hover:text-rose-300 font-black text-xs px-1.5 py-0.5 rounded-md hover:bg-rose-900/40 shrink-0 cursor-pointer"
                        title="Remove tile"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Available Story Magnet Bank */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-nunito font-bold text-slate-600 uppercase tracking-wider block">
                  Available Episode Story Magnets:
                </label>
                <span className="text-[11px] font-nunito text-slate-500 font-bold">
                  {availableTiles.length} remaining
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {availableTiles.map((tile, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAddTile(tile)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-400 text-left transition-all shadow-xs cursor-pointer group flex items-start gap-2"
                  >
                    <span className="text-base shrink-0 mt-0.5">{tile.icon}</span>
                    <div className="flex-1">
                      <span className="text-[10px] font-nunito font-extrabold text-purple-700 uppercase tracking-wider block">
                        {tile.act}
                      </span>
                      <p className="font-nunito font-bold text-xs text-slate-800 leading-snug group-hover:text-purple-950">
                        + {tile.sentence}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Complete Sprint & Advance Controls */}
            {!sprintComplete ? (
              <button
                type="button"
                onClick={handleCompleteSprint}
                disabled={sentenceTiles.length < 2}
                className="w-full btn-story-primary !bg-gradient-to-r !from-purple-600 !to-indigo-600 font-black !py-4 shadow-xl flex items-center justify-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Lock In Episode Scene & Pass the Story Baton!</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 font-nunito font-bold text-xs flex items-center justify-between gap-2 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Canonical Scene Recorded! Ready for Waterfall Audio Studio.</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-black text-[11px]">
                    +100 Points
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPassModalOpen(true)}
                  className="w-full btn-story-primary !bg-gradient-to-r !from-emerald-500 !to-teal-600 font-black !py-4 shadow-xl flex items-center justify-center gap-2 text-white cursor-pointer hover:scale-[1.01] transition-transform"
                >
                  <span>Pass Baton & Enter Level 4 (Waterfall)</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      <BatonPassModal
        isOpen={passModalOpen}
        onClose={() => {
          setPassModalOpen(false);
          handleAdvanceLevel();
        }}
      />
    </>
  );
};
