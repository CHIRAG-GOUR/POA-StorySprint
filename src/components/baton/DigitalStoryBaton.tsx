import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Zap, Compass } from 'lucide-react';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';

interface DigitalStoryBatonProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onPassClick?: () => void;
  className?: string;
}

export default function DigitalStoryBaton({
  size = 'md',
  showLabel = true,
  onPassClick,
  className = ''
}: DigitalStoryBatonProps) {
  const { currentBatonHolder } = useStoryState();
  const { playTap } = useAudio();

  const sizeClasses = {
    sm: 'w-28 h-8',
    md: 'w-44 h-12',
    lg: 'w-64 h-16'
  };

  const handleClick = () => {
    playTap();
    if (onPassClick) onPassClick();
  };

  return (
    <motion.div
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      className={`relative flex items-center gap-3 cursor-pointer group ${className}`}
    >
      {/* Baton Core Cylinder */}
      <div className={`relative ${sizeClasses[size]} rounded-full p-1 flex items-center justify-between shadow-lg baton-glow bg-gradient-to-r from-amber-400 via-pink-400 to-purple-500`}>
        
        {/* Left Golden Finial */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-500 shadow-sm flex items-center justify-center border-2 border-white">
          <Zap className="w-4 h-4 text-amber-900" />
        </div>

        {/* Center Grip with Runes */}
        <div className="flex-1 flex items-center justify-center px-2">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60">
            <Wand2 className="w-3.5 h-3.5 text-purple-900" />
            <span className="font-display font-black text-xs md:text-sm text-purple-950 tracking-wider uppercase">
              Story Baton
            </span>
          </div>
        </div>

        {/* Right Crystal Finial */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-200 to-fuchsia-500 shadow-sm flex items-center justify-center border-2 border-white">
          <Compass className="w-4 h-4 text-purple-900" />
        </div>

        {/* Subtle Shimmer highlight */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Holder Label */}
      {showLabel && (
        <div className="hidden sm:flex flex-col">
          <span className="text-[11px] font-nunito font-bold text-purple-600 uppercase tracking-wider leading-none mb-0.5">
            Active Storyteller
          </span>
          <span className="font-display font-bold text-gray-900 text-sm md:text-base leading-tight">
            {currentBatonHolder}
          </span>
        </div>
      )}
    </motion.div>
  );
}
