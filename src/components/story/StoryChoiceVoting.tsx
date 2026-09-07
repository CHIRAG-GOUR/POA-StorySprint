import React from 'react';
import { motion } from 'framer-motion';
import { Check, Vote, Lock, Unlock, Trophy } from 'lucide-react';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';
import { ChoiceOption } from '../../types/story';

export const StoryChoiceVoting: React.FC = () => {
  const { 
    activeVoteQuestion, 
    activeVoteOptions, 
    votingLocked, 
    setVotingLocked, 
    castVote, 
    addDecision, 
    decisions 
  } = useStoryState();
  const { playVote, playTap, playAchievement } = useAudio();

  const totalVotes = activeVoteOptions.reduce((sum, opt) => sum + opt.votes, 0);

  // Determine highest voted option
  const sortedOptions = [...activeVoteOptions].sort((a, b) => b.votes - a.votes);
  const winningOption = sortedOptions[0];

  const handleVoteClick = (id: 'A' | 'B' | 'C' | 'D') => {
    if (votingLocked) return;
    playVote();
    castVote(id);
  };

  const handleToggleLock = () => {
    playTap();
    setVotingLocked(!votingLocked);
  };

  const handleAdoptWinningChoice = () => {
    if (!activeVoteQuestion || !winningOption) return;
    playAchievement();
    addDecision(activeVoteQuestion, winningOption);
    alert(`Decided! "${winningOption.text}" has officially entered our Class Story!`);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <div className="text-center space-y-1">
        <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-nunito font-extrabold text-xs uppercase tracking-wider">
          Classroom Consensus Vote
        </span>
        <h2 className="font-display font-black text-3xl md:text-4xl text-gray-900 leading-tight">
          Choice Moment: What Should the Hero Do?
        </h2>
        <p className="font-display font-bold text-xl text-purple-700 mt-2">
          "{activeVoteQuestion}"
        </p>
      </div>

      {/* 4 Voting Option Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeVoteOptions.map((opt) => {
          const percent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          const isWinning = votingLocked && opt.id === winningOption.id;

          return (
            <motion.div
              key={opt.id}
              onClick={() => handleVoteClick(opt.id)}
              whileHover={!votingLocked ? { scale: 1.02, y: -3 } : undefined}
              whileTap={!votingLocked ? { scale: 0.98 } : undefined}
              className={`relative rounded-3xl p-6 border-2 transition-all cursor-pointer overflow-hidden ${
                isWinning
                  ? 'bg-amber-50 border-amber-500 ring-4 ring-amber-400/30 shadow-xl'
                  : 'bg-white/85 backdrop-blur-md border-slate-200 hover:border-purple-300 shadow-sm'
              }`}
            >
              {/* Top Row */}
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-display font-black text-lg flex items-center justify-center shadow-xs">
                    {opt.id}
                  </span>
                  <span className="font-nunito font-bold text-xs text-slate-500 uppercase">
                    {opt.consequence}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-display font-black text-lg text-purple-900">
                  <span>{opt.votes}</span>
                  <span className="text-xs font-nunito text-slate-400 font-normal">votes</span>
                  <span className="text-sm font-bold text-purple-600">({percent}%)</span>
                </div>
              </div>

              {/* Option Text */}
              <p className="font-display font-bold text-xl text-slate-800 mb-4 leading-snug">
                {opt.text}
              </p>

              {/* Live Animated Progress Fill Bar */}
              <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200/60">
                <motion.div
                  className={`h-full rounded-full ${
                    isWinning
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {isWinning && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-nunito font-extrabold text-amber-800 bg-amber-200/50 px-3 py-1 rounded-xl">
                  <Trophy className="w-3.5 h-3.5 text-amber-600" />
                  <span>Winning Class Choice</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Classroom Voting Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs font-nunito font-bold text-slate-600">
          <Vote className="w-4 h-4 text-purple-600" />
          <span>Total Classroom Ballots Cast: <strong>{totalVotes}</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleLock}
            className="btn-story-secondary text-xs !min-h-[40px] !py-2 flex items-center gap-1.5"
          >
            {votingLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{votingLocked ? 'Unlock Voting' : 'Lock & Finalize'}</span>
          </button>

          {votingLocked && (
            <button
              type="button"
              onClick={handleAdoptWinningChoice}
              className="btn-story-primary text-xs !min-h-[40px] !py-2 !bg-gradient-to-r !from-emerald-500 !to-teal-600"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Adopt Winner ({winningOption.id}) into Story</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
