import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, User } from 'lucide-react';
import { useStoryState } from '../../context/StoryStateContext';

export const StoryTimeline: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { storyEvents, hero, world } = useStoryState();

  if (storyEvents.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 text-center border-2 border-dashed border-purple-200">
        <span className="text-5xl block mb-2">📜</span>
        <h3 className="font-display font-black text-xl text-slate-800">Your Story Timeline is Empty</h3>
        <p className="font-nunito text-sm text-slate-500 max-w-md mx-auto mt-1">
          As students contribute through the Baton Challenges, their story events will appear here in chronological order!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {!compact && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-black text-3xl md:text-4xl text-gray-900 leading-tight">
              Story Builder Timeline 📜
            </h2>
            <p className="font-nunito font-semibold text-slate-600 text-sm md:text-base">
              The living sequence of chapters created one baton pass at a time.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-purple-100 text-purple-800 text-xs font-nunito font-extrabold">
            <BookOpen className="w-4 h-4" />
            <span>{storyEvents.length} Events Recorded</span>
          </div>
        </div>
      )}

      {/* Timeline Chain */}
      <div className="relative pl-6 sm:pl-8 border-l-3 border-purple-300 space-y-6">
        {storyEvents.map((evt, idx) => (
          <motion.div
            key={evt.id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="relative"
          >
            {/* Timeline node icon */}
            <div className="absolute -left-[37px] sm:-left-[45px] top-4 w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-sm shadow-md border-2 border-white">
              {evt.icon || '📜'}
            </div>

            {/* Event Card */}
            <div className="bg-white/85 backdrop-blur-md rounded-2xl p-5 border-2 border-white/80 shadow-md hover:border-purple-300 transition-all">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-nunito font-black text-[11px] uppercase tracking-wider">
                    Chapter {idx + 1}
                  </span>
                  <span className="text-xs font-nunito font-extrabold text-slate-400">
                    • {evt.badge}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-nunito font-semibold text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{evt.timestamp}</span>
                </div>
              </div>

              <h4 className="font-display font-black text-xl text-slate-900 mb-1 leading-snug">
                {evt.title}
              </h4>
              <p className="font-nunito text-sm md:text-base text-slate-700 leading-relaxed">
                {evt.description}
              </p>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3 text-xs font-nunito">
                <div className="flex items-center gap-1.5 text-purple-700 font-bold">
                  <User className="w-3.5 h-3.5" />
                  <span>Storyteller: {evt.storyteller}</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {hero?.name} in {world?.name}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
