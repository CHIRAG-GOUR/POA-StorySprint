import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, CheckCircle, HelpCircle, RotateCcw } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';

interface ScrambledEvent {
  id: string;
  correctIndex: number;
  title: string;
  detail: string;
  icon: string;
}

const INITIAL_PUZZLE: ScrambledEvent[] = [
  { id: 'p3', correctIndex: 2, title: 'Unlocking the Ancient Vault', detail: 'Using the golden key to turn the heavy brass tumblers.', icon: '🗝️' },
  { id: 'p1', correctIndex: 0, title: 'Finding the Mysterious Map', detail: 'Uncovering the parchment hidden inside an old hollow tree.', icon: '🗺️' },
  { id: 'p4', correctIndex: 3, title: 'Restoring the Sky City Crystal', detail: 'Placing the glowing artifact into the pedestal to stop the tremor.', icon: '💎' },
  { id: 'p2', correctIndex: 1, title: 'Crossing the Chasm on Gliders', detail: 'Following the marked path across the canyon winds.', icon: '🦅' }
];

export const StorySortGame: React.FC = () => {
  const [items, setItems] = useState<ScrambledEvent[]>(INITIAL_PUZZLE);
  const [isCompleted, setIsCompleted] = useState(false);
  const { playTap, playAchievement } = useAudio();

  const moveItem = (index: number, direction: 'up' | 'down') => {
    playTap();
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setItems(newItems);
  };

  const handleCheckSequence = () => {
    playTap();
    const isCorrect = items.every((item, idx) => item.correctIndex === idx);
    if (isCorrect) {
      setIsCompleted(true);
      playAchievement();
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
      } catch {
        // Ignore
      }
    } else {
      alert('Not quite! Think about cause and effect: which event had to happen first before the next was even possible?');
    }
  };

  const handleReset = () => {
    playTap();
    setItems(INITIAL_PUZZLE);
    setIsCompleted(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-black text-3xl md:text-4xl text-gray-900 leading-tight">
            Story Sort: Cause & Effect 🔄
          </h2>
          <p className="font-nunito font-semibold text-slate-600 text-sm md:text-base">
            Rearrange these scrambled events into the only logical story sequence!
          </p>
        </div>
        <button
          onClick={handleReset}
          className="btn-story-secondary text-xs !min-h-[40px] !py-2 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Order</span>
        </button>
      </div>

      {/* Interactive Sorting Cards List */}
      <div className="space-y-3">
        {items.map((item, idx) => {
          const isCorrectPosition = isCompleted && item.correctIndex === idx;
          return (
            <motion.div
              key={item.id}
              layout
              className={`p-4 md:p-5 rounded-2xl border-2 flex items-center justify-between gap-4 transition-all ${
                isCorrectPosition
                  ? 'bg-emerald-50/90 border-emerald-400 shadow-md'
                  : 'bg-white/90 backdrop-blur-md border-slate-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-display font-black text-base flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-3xl shrink-0">{item.icon}</span>
                <div>
                  <h4 className="font-display font-black text-lg md:text-xl text-slate-900 leading-snug">
                    {item.title}
                  </h4>
                  <p className="font-nunito text-xs md:text-sm text-slate-600">
                    {item.detail}
                  </p>
                </div>
              </div>

              {/* Reordering Up/Down controls (optimized for touch screens) */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => moveItem(idx, 'up')}
                  disabled={idx === 0 || isCompleted}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-purple-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 font-bold transition-colors cursor-pointer"
                  title="Move Up"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(idx, 'down')}
                  disabled={idx === items.length - 1 || isCompleted}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-purple-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 font-bold transition-colors cursor-pointer"
                  title="Move Down"
                >
                  ▼
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Validation & Feedback */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 text-xs font-nunito text-slate-600">
          <HelpCircle className="w-4 h-4 text-purple-500 shrink-0" />
          <span>
            <em>Pedagogical Rule:</em> Actions must possess causes before effects can follow.
          </span>
        </div>

        {isCompleted ? (
          <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-100 text-emerald-800 font-display font-bold text-base shadow-sm">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>Perfect Sequence! You cannot discover the treasure before finding the map.</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleCheckSequence}
            className="btn-story-primary !bg-gradient-to-r !from-emerald-500 !to-teal-600"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Verify Sequence</span>
          </button>
        )}
      </div>
    </div>
  );
};
