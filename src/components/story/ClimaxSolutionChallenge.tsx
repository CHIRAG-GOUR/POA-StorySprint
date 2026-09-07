import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Flame, ShieldAlert, Trophy, Lightbulb } from 'lucide-react';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';

const CLIMAX_STRATEGIES = [
  {
    id: 'sol-invention',
    title: 'The Ingenious Contraption',
    emoji: '⚙️',
    type: 'Clever Invention',
    summary: 'Combine the hero’s special gadgets with the mysterious object to neutralize the threat safely.',
    effort: 'High (requires technical synergy)',
    risk: 'Moderate (devices can overheat)',
    creativePotential: 'Outstanding (showcases out-of-the-box thinking)',
    color: 'border-cyan-400 bg-cyan-50/50'
  },
  {
    id: 'sol-alliance',
    title: 'The Unlikely Alliance',
    emoji: '🤝',
    type: 'Surprise Alliance',
    summary: 'Reach out to the former rival and unite against the catastrophe that threatens everyone.',
    effort: 'Moderate (requires courage and trust)',
    risk: 'High (risk of sudden betrayal)',
    creativePotential: 'Deep & Emotional (redeems characters)',
    color: 'border-purple-400 bg-purple-50/50'
  },
  {
    id: 'sol-negotiation',
    title: 'The Peaceful Truth Accord',
    emoji: '🕊️',
    type: 'Peaceful Negotiation',
    summary: 'Uncover the misunderstood motive behind the conflict and resolve it through honesty and empathy.',
    effort: 'Low physical, High wisdom',
    risk: 'Low-to-Medium',
    creativePotential: 'Profound (teaches non-violent conflict resolution)',
    color: 'border-emerald-400 bg-emerald-50/50'
  },
  {
    id: 'sol-daring',
    title: 'The Midnight Stunt Rescue',
    emoji: '⚡',
    type: 'Daring Rescue',
    summary: 'A breathtaking acrobatic infiltration through the vents to recover the stolen core just in the nick of time.',
    effort: 'Extremely High agility',
    risk: 'High (narrow margin for error)',
    creativePotential: 'Cinematic & Thrilling (maximum suspense)',
    color: 'border-amber-400 bg-amber-50/50'
  }
];

export const ClimaxSolutionChallenge: React.FC = () => {
  const { climaxSolution, setClimaxSolution, problem, hero, world } = useStoryState();
  const { playTap, playAchievement } = useAudio();
  const [selectedStrategy, setSelectedStrategy] = useState(CLIMAX_STRATEGIES[0]);

  const handleLockClimax = (strategy: typeof CLIMAX_STRATEGIES[0]) => {
    playTap();
    playAchievement();
    setSelectedStrategy(strategy);
    setClimaxSolution(`${strategy.type}: ${strategy.summary}`);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <span className="px-3.5 py-1 rounded-full bg-rose-100 text-rose-800 font-nunito font-black text-xs uppercase tracking-widest">
          Module 4: Climax & Resolution
        </span>
        <h2 className="font-display font-black text-3xl md:text-5xl text-gray-900 leading-tight">
          How Will Our Hero Save the Day? 🔥
        </h2>
        <p className="font-nunito font-semibold text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
          The stakes are at their peak for <strong>{hero?.name}</strong> in <strong>{world?.name}</strong>.
          We must analyze the risks and creative payoff of each solution!
        </p>
      </div>

      {/* Grid of 4 Strategic Solutions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CLIMAX_STRATEGIES.map((strat) => {
          const isSelected = climaxSolution?.includes(strat.type);
          return (
            <motion.div
              key={strat.id}
              whileHover={{ y: -4, scale: 1.01 }}
              className={`rounded-3xl p-6 border-2 transition-all flex flex-col justify-between ${strat.color} ${
                isSelected
                  ? 'ring-4 ring-purple-500/40 border-purple-600 bg-white shadow-xl'
                  : 'bg-white/85 backdrop-blur-md shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{strat.emoji}</span>
                    <span className="font-nunito font-extrabold text-xs text-purple-700 uppercase tracking-wider">
                      {strat.type}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500 text-white font-nunito font-black text-xs shadow-xs">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Class Consensus</span>
                    </div>
                  )}
                </div>

                <h3 className="font-display font-black text-2xl text-slate-900 mb-2">
                  {strat.title}
                </h3>
                <p className="font-nunito text-sm md:text-base text-slate-700 leading-relaxed mb-4">
                  {strat.summary}
                </p>
              </div>

              {/* Strategic Risk & Effort Analysis */}
              <div className="border-t border-slate-200/70 pt-3 space-y-2 text-xs font-nunito">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-bold">Required Effort:</span>
                  <span className="font-semibold text-slate-800">{strat.effort}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-bold">Possible Risk:</span>
                  <span className="font-semibold text-rose-600 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {strat.risk}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-bold">Creative Potential:</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-emerald-500" />
                    {strat.creativePotential}
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleLockClimax(strat)}
                    className="btn-story-primary w-full text-xs !min-h-[42px] !py-2 !bg-gradient-to-r !from-purple-600 !to-pink-600"
                  >
                    <span>Adopt this Climax Solution</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Classroom Facilitation Guide Box */}
      <div className="bg-purple-50/80 backdrop-blur-md rounded-2xl p-5 border border-purple-200/80 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs font-nunito text-purple-900 leading-relaxed">
          <strong>Teacher Facilitation Prompt (Bloom's Taxonomy - Evaluation):</strong>
          <p className="mt-0.5">
            "Ask the classroom: Why is a solution that uses intelligence or friendship often more satisfying in a story than one that relies purely on brute physical strength?"
          </p>
        </div>
      </div>
    </div>
  );
};
