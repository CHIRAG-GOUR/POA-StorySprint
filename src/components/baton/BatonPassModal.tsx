import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, ArrowRight, UserCheck, X } from 'lucide-react';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';

interface BatonPassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BatonPassModal: React.FC<BatonPassModalProps> = ({ isOpen, onClose }) => {
  const { currentBatonHolder, participants, passBaton, addParticipant } = useStoryState();
  const { playBatonPass, playTap } = useAudio();

  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [contributionText, setContributionText] = useState<string>('');
  const [newTeamName, setNewTeamName] = useState<string>('');
  const [isAddingTeam, setIsAddingTeam] = useState(false);

  // Available recipients (everyone except current holder)
  const availableRecipients = participants.filter(p => p !== currentBatonHolder);

  const handleConfirmPass = () => {
    if (!selectedRecipient) return;
    playBatonPass();
    const finalContribution = contributionText.trim() || 'Passed the baton with creative courage to expand our tale!';
    passBaton(selectedRecipient, finalContribution);
    setContributionText('');
    setSelectedRecipient('');
    onClose();
  };

  const handleAddNewParticipant = () => {
    if (!newTeamName.trim()) return;
    addParticipant(newTeamName.trim());
    setSelectedRecipient(newTeamName.trim());
    setNewTeamName('');
    setIsAddingTeam(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
        
        {/* Backdrop click to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative z-10 w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-purple-200 flex flex-col gap-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-purple-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Wand2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-black text-2xl text-gray-900 leading-tight">
                  Pass the Story Baton!
                </h3>
                <p className="font-nunito font-semibold text-sm text-purple-600">
                  Transfer responsibility for the next chapter
                </p>
              </div>
            </div>
            <button
              onClick={() => { playTap(); onClose(); }}
              className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Handover Visualizer */}
          <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 p-4 rounded-2xl border border-purple-100/80 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-nunito font-bold text-gray-500 uppercase">From</span>
              <span className="font-display font-bold text-base md:text-lg text-purple-900">
                {currentBatonHolder}
              </span>
            </div>

            <div className="flex items-center gap-1 text-purple-500 font-bold">
              <span className="text-xl">🪄</span>
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </div>

            <div className="flex flex-col text-right">
              <span className="text-xs font-nunito font-bold text-gray-500 uppercase">To Next Storyteller</span>
              <span className="font-display font-bold text-base md:text-lg text-pink-600">
                {selectedRecipient || 'Select Below...'}
              </span>
            </div>
          </div>

          {/* Select Recipient Grid */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-nunito font-bold text-sm text-gray-700">
                Choose the next team or student:
              </label>
              <button
                type="button"
                onClick={() => setIsAddingTeam(!isAddingTeam)}
                className="text-xs font-nunito font-bold text-purple-600 hover:text-purple-800 underline"
              >
                {isAddingTeam ? 'Cancel' : '+ Add New Student/Team'}
              </button>
            </div>

            {isAddingTeam ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter student or team name..."
                  value={newTeamName}
                  onChange={e => setNewTeamName(e.target.value)}
                  className="flex-1 p-3 rounded-xl border-2 border-purple-200 font-nunito text-sm focus:outline-none focus:border-purple-500 bg-white"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddNewParticipant}
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl font-nunito font-bold text-sm hover:bg-purple-700"
                >
                  Add
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-40 overflow-y-auto p-1">
                {availableRecipients.map(recipient => {
                  const isSelected = selectedRecipient === recipient;
                  return (
                    <button
                      key={recipient}
                      type="button"
                      onClick={() => { playTap(); setSelectedRecipient(recipient); }}
                      className={`p-3 rounded-2xl border-2 font-nunito font-bold text-sm text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-purple-600 bg-purple-100 text-purple-900 shadow-sm scale-102'
                          : 'border-slate-200 bg-white hover:border-purple-300 text-slate-700'
                      }`}
                    >
                      <span className="truncate">{recipient}</span>
                      {isSelected && <UserCheck className="w-4 h-4 text-purple-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Optional Contribution Summary */}
          <div className="space-y-1.5">
            <label className="font-nunito font-bold text-sm text-gray-700">
              What was your team’s contribution? (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Discovered the glowing hidden cavern..."
              value={contributionText}
              onChange={e => setContributionText(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-slate-200 font-nunito text-sm focus:outline-none focus:border-purple-500 bg-white shadow-xs"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { playTap(); onClose(); }}
              className="btn-story-secondary text-sm !min-h-[44px] !py-2.5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmPass}
              disabled={!selectedRecipient}
              className="btn-story-primary text-sm !min-h-[44px] !py-2.5 !bg-gradient-to-r !from-purple-600 !to-pink-600"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Confirm Handover</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
