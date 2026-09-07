import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Users, ArrowRightLeft } from 'lucide-react';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';
import { BatonPassModal } from './BatonPassModal';

export const BatonStatusBar: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { currentBatonHolder, batonHistory } = useStoryState();
  const { playTap } = useAudio();
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => {
    playTap();
    setModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-2.5">
        <motion.button
          onClick={handleOpen}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/85 backdrop-blur-md border-2 border-purple-200/80 shadow-sm hover:border-purple-400 hover:bg-white transition-all cursor-pointer group"
          title="Click to pass the Story Baton"
        >
          {/* Glowing Baton Icon */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-pink-500 flex items-center justify-center text-white shadow-xs group-hover:rotate-12 transition-transform">
            <Wand2 className="w-4 h-4" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[10px] font-nunito font-extrabold text-purple-600 uppercase tracking-wider leading-none">
              Story Baton Holder
            </span>
            <span className="font-display font-bold text-sm md:text-base text-gray-900 leading-tight">
              {currentBatonHolder}
            </span>
          </div>

          {!compact && (
            <div className="hidden lg:flex items-center gap-1.5 ml-2 pl-3 border-l border-purple-100 text-xs font-nunito font-bold text-purple-700">
              <ArrowRightLeft className="w-3.5 h-3.5 text-purple-500" />
              <span>Pass</span>
            </div>
          )}
        </motion.button>

        {/* Contribution Counter */}
        {!compact && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-purple-50/80 border border-purple-100/80 text-purple-700 text-xs font-nunito font-bold">
            <Users className="w-3.5 h-3.5" />
            <span>{batonHistory.length} Passes</span>
          </div>
        )}
      </div>

      <BatonPassModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
