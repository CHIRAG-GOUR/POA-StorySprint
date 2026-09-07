import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Compass, AlertCircle, PlusCircle, RotateCw } from 'lucide-react';
import { TWISTS } from '../../data/storyData';
import { TwistItem } from '../../types/story';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';

const WHEEL_COLORS = [
  '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#38BDF8',
  '#6366F1', '#F43F5E', '#14B8A6', '#F97316', '#A855F7',
  '#06B6D4', '#EAB308', '#84CC16', '#D946EF', '#475569'
];

export const StoryTwistWheel: React.FC = () => {
  const { twists, addTwist, currentBatonHolder } = useStoryState();
  const { playTwistSpin, playAchievement } = useAudio();
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedTwist, setSelectedTwist] = useState<TwistItem | null>(null);
  const controls = useAnimation();

  const handleSpin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedTwist(null);

    // Random target index from TWISTS
    const targetIdx = Math.floor(Math.random() * TWISTS.length);
    const degreesPerSlice = 360 / TWISTS.length;
    // Extra rotations for excitement (5 full turns = 1800 deg)
    const totalRotation = 1800 + (TWISTS.length - targetIdx) * degreesPerSlice;

    // Simulate sound ticking during spin
    const soundInterval = setInterval(() => {
      playTwistSpin();
    }, 120);

    await controls.start({
      rotate: totalRotation,
      transition: {
        duration: 4.2,
        ease: [0.15, 0.9, 0.25, 1]
      }
    });

    clearInterval(soundInterval);
    setIsSpinning(false);
    const chosen = TWISTS[targetIdx];
    setSelectedTwist(chosen);
    playAchievement();
  };

  const handleAcceptTwist = () => {
    if (!selectedTwist) return;
    addTwist(selectedTwist);
  };

  return (
    <div className="flex flex-col gap-8 w-full items-center">
      <div className="text-center max-w-xl">
        <h2 className="font-display font-black text-3xl md:text-4xl text-gray-900 leading-tight mb-2">
          Spin the Story Twist Wheel! 🎡
        </h2>
        <p className="font-nunito font-semibold text-slate-600 text-sm md:text-base">
          Every gripping adventure needs an unexpected wrench thrown into the gears.
        </p>
      </div>

      {/* Wheel Stage */}
      <div className="relative flex items-center justify-center p-4">
        
        {/* Fixed Top Indicator Needle */}
        <div className="absolute -top-3 z-30 flex flex-col items-center">
          <div className="w-6 h-8 bg-gradient-to-b from-rose-500 to-red-600 rounded-md shadow-lg clip-path-triangle transform rotate-180 border-2 border-white" />
          <div className="w-4 h-4 bg-amber-400 rounded-full shadow-md border-2 border-white -mt-1" />
        </div>

        {/* Rotating Wheel SVG Canvas */}
        <motion.div
          animate={controls}
          initial={{ rotate: 0 }}
          className="w-72 h-72 sm:w-88 sm:h-88 rounded-full shadow-2xl border-6 border-white bg-slate-900 overflow-hidden relative"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {TWISTS.map((twist, idx) => {
              const sliceAngle = 360 / TWISTS.length;
              const startAngle = idx * sliceAngle;
              const endAngle = (idx + 1) * sliceAngle;

              // Convert polar to cartesian coordinates
              const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
              const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
              const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
              const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
              const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

              return (
                <path
                  key={twist.id}
                  d={pathData}
                  fill={WHEEL_COLORS[idx % WHEEL_COLORS.length]}
                  stroke="#FFFFFF"
                  strokeWidth="0.8"
                />
              );
            })}
          </svg>

          {/* Center Hub */}
          <div className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-purple-200">
            <span className="text-3xl">🌀</span>
          </div>
        </motion.div>
      </div>

      {/* Spin Action Button */}
      <div>
        <button
          type="button"
          onClick={handleSpin}
          disabled={isSpinning}
          className="btn-story-primary !text-lg !px-10 !py-4 shadow-xl !bg-gradient-to-r !from-fuchsia-600 !to-purple-600"
        >
          <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>{isSpinning ? 'Wheel is Spinning...' : 'SPIN THE TWIST! 🎲'}</span>
        </button>
      </div>

      {/* Reveal Card upon landing */}
      {selectedTwist && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-xl bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 border-3 border-fuchsia-300 shadow-2xl flex flex-col gap-4 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-fuchsia-100 flex items-center justify-center text-4xl mx-auto shadow-sm">
            {selectedTwist.emoji}
          </div>
          <div>
            <span className="px-3 py-1 rounded-full bg-fuchsia-100 text-fuchsia-800 font-nunito font-black text-xs uppercase tracking-wider">
              {selectedTwist.category}
            </span>
            <h3 className="font-display font-black text-2xl md:text-3xl text-slate-900 mt-2">
              {selectedTwist.title}
            </h3>
            <p className="font-nunito text-base text-slate-700 mt-2 leading-relaxed">
              {selectedTwist.description}
            </p>
          </div>

          <div className="bg-fuchsia-50 p-4 rounded-2xl border border-fuchsia-200/80 text-left">
            <p className="font-nunito font-bold text-xs text-fuchsia-900 uppercase mb-1">
              Classroom Challenge:
            </p>
            <p className="font-nunito text-sm text-fuchsia-800 italic">
              "{selectedTwist.storyPrompt}"
            </p>
          </div>

          <button
            type="button"
            onClick={handleAcceptTwist}
            className="btn-story-primary w-full !bg-gradient-to-r !from-purple-600 !to-pink-600"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Lock this Twist into Our Story</span>
          </button>
        </motion.div>
      )}

      {/* Recorded Twists so far */}
      {twists.length > 0 && (
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-purple-200 shadow-sm">
          <h4 className="font-display font-bold text-base text-purple-900 mb-3 flex items-center gap-2">
            <span>Locked Story Twists ({twists.length})</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {twists.map((t, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-purple-100/80 text-purple-800 font-nunito font-bold text-xs flex items-center gap-1.5"
              >
                <span>{t.emoji}</span>
                <span>{t.title}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
