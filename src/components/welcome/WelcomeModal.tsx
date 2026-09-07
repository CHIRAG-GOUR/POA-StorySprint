import React from 'react';
import { Compass, MapPin, Award, Volume2, Play, Flame, ArrowRight } from 'lucide-react';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';

interface WelcomeModalProps {
  isOpen: boolean;
  onStart: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onStart }) => {
  const { className, storyTitle } = useStoryState();
  const { playFanfare, playTap } = useAudio();

  if (!isOpen) return null;

  const handleStartAdventure = () => {
    playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onStart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      {/* Outer Adventure Modal Container */}
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#FFFDF5] via-[#FFFBEB] to-[#FEF3C7] rounded-3xl border-4 border-[#78350F] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] p-6 sm:p-8 text-center overflow-hidden">
        
        {/* Decorative Corner Wooden Rivets */}
        <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-[#B45309] border-2 border-[#78350F] shadow-sm" />
        <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#B45309] border-2 border-[#78350F] shadow-sm" />
        <div className="absolute bottom-3 left-3 w-4 h-4 rounded-full bg-[#B45309] border-2 border-[#78350F] shadow-sm" />
        <div className="absolute bottom-3 right-3 w-4 h-4 rounded-full bg-[#B45309] border-2 border-[#78350F] shadow-sm" />

        {/* Floating Top Banner Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg border-2 border-amber-300 mb-3 animate-bounce">
          <Compass className="w-9 h-9" />
        </div>

        {/* 3D Adventure Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-adventure-3d tracking-wide mb-1 select-none leading-tight uppercase">
          Welcome to
        </h1>
        <h2 className="text-4xl sm:text-6xl font-black text-adventure-3d tracking-wider mb-3 select-none leading-none uppercase">
          Story Island
        </h2>

        <p className="font-display font-extrabold text-amber-900 text-sm sm:text-base mb-6 max-w-md mx-auto">
          Pass the story baton, conquer interactive challenges, and craft an epic collaborative legend!
        </p>

        {/* Class & Expedition Details Card */}
        <div className="bg-white/80 border-2 border-amber-200/80 rounded-2xl p-3.5 mb-6 shadow-sm flex items-center justify-around text-left">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏫</span>
            <div>
              <span className="text-[10px] font-nunito font-extrabold uppercase text-amber-700 block">Class Team</span>
              <span className="font-display font-black text-slate-800 text-xs sm:text-sm">{className}</span>
            </div>
          </div>
          <div className="h-8 w-px bg-amber-200" />
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🗺️</span>
            <div>
              <span className="text-[10px] font-nunito font-extrabold uppercase text-amber-700 block">Current Quest</span>
              <span className="font-display font-black text-slate-800 text-xs sm:text-sm">{storyTitle}</span>
            </div>
          </div>
        </div>

        {/* 3 Steps Mini Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-6 text-center">
          <div className="bg-amber-100/70 border border-amber-300/60 rounded-xl p-2.5">
            <span className="text-xl block mb-1">🗿</span>
            <span className="font-display font-bold text-slate-800 text-xs block">1. Forge Hero</span>
          </div>
          <div className="bg-amber-100/70 border border-amber-300/60 rounded-xl p-2.5">
            <span className="text-xl block mb-1">⚡</span>
            <span className="font-display font-bold text-slate-800 text-xs block">2. Pass Baton</span>
          </div>
          <div className="bg-amber-100/70 border border-amber-300/60 rounded-xl p-2.5">
            <span className="text-xl block mb-1">🌋</span>
            <span className="font-display font-bold text-slate-800 text-xs block">3. Climax Boss</span>
          </div>
        </div>

        {/* Big Start Adventure Action Button */}
        <button
          type="button"
          onClick={handleStartAdventure}
          className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-adventure font-black text-lg sm:text-xl shadow-[0_8px_20px_rgba(234,88,12,0.4)] hover:shadow-[0_12px_28px_rgba(234,88,12,0.55)] border-2 border-yellow-200 transition-all hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-3"
        >
          <Play className="w-6 h-6 text-yellow-200 fill-yellow-200" />
          <span>Start Adventure</span>
          <ArrowRight className="w-6 h-6 text-yellow-200" />
        </button>
      </div>
    </div>
  );
};
