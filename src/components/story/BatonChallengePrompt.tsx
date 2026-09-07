import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Send, Lightbulb } from 'lucide-react';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';
import { BatonPassModal } from '../baton/BatonPassModal';

const PROMPT_TEMPLATES = [
  { label: 'Reveal something hidden', icon: '🔍', starter: 'As the shadows parted, they noticed a hidden mechanism carved into...' },
  { label: 'Introduce an unexpected obstacle', icon: '⚡', starter: 'Suddenly, the ground trembled and the only pathway was blocked by...' },
  { label: 'Discover something unusual', icon: '🔮', starter: 'Resting upon an ancient pedestal was a glowing crystal that whispered...' },
  { label: 'A funny moment of relief', icon: '🤣', starter: 'Just when tension was highest, the companion tripped over a root and...' },
  { label: 'Introduce an ancient riddle', icon: '📜', starter: 'A mechanical voice chimed from the stone door, asking: "Only those who..."' },
  { label: 'Hero uses special ability', icon: '🦸', starter: 'Remembering their training, the hero leaped forward and activated...' }
];

export const BatonChallengePrompt: React.FC = () => {
  const { currentBatonHolder, addStoryEvent, hero, world } = useStoryState();
  const { playTap, playAchievement } = useAudio();

  const [selectedPrompt, setSelectedPrompt] = useState(PROMPT_TEMPLATES[0]);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [passModalOpen, setPassModalOpen] = useState(false);

  const handleApplyStarter = (template: typeof PROMPT_TEMPLATES[0]) => {
    playTap();
    setSelectedPrompt(template);
    setEventTitle(template.label);
    setEventDescription(template.starter);
  };

  const handleSubmitContribution = () => {
    if (!eventDescription.trim()) return;
    playAchievement();

    addStoryEvent({
      chapterId: '3.1',
      title: eventTitle.trim() || selectedPrompt.label,
      description: eventDescription.trim(),
      storyteller: currentBatonHolder,
      badge: 'Baton Challenge',
      icon: selectedPrompt.icon
    });

    setEventTitle('');
    setEventDescription('');
    setPassModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-6 w-full">
        {/* Header with Active Baton Badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-purple-100 via-pink-100 to-amber-100 p-6 rounded-3xl border-2 border-purple-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Wand2 className="w-7 h-7 animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
            <div>
              <span className="text-xs font-nunito font-extrabold text-purple-700 uppercase tracking-widest">
                Active Storyteller in Command
              </span>
              <h2 className="font-display font-black text-3xl text-gray-900 leading-tight">
                {currentBatonHolder}'s Turn to Move the Story!
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-nunito font-bold text-slate-700 bg-white/80 px-4 py-2 rounded-full border border-purple-200/80">
            <span>Hero: <strong>{hero?.name}</strong></span>
            <span>•</span>
            <span>Realm: <strong>{world?.name}</strong></span>
          </div>
        </div>

        {/* Quick Creative Starter Prompts */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-nunito font-bold text-slate-700">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Select a Creative Story Prompt to spark ideas:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PROMPT_TEMPLATES.map((tmpl, idx) => {
              const isSelected = selectedPrompt.label === tmpl.label;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyStarter(tmpl)}
                  className={`p-3.5 rounded-2xl border-2 text-left font-nunito font-bold text-sm transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-102'
                      : 'bg-white/80 hover:bg-white border-slate-200 text-slate-800 hover:border-purple-300'
                  }`}
                >
                  <span className="text-xl shrink-0">{tmpl.icon}</span>
                  <span className="truncate">{tmpl.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contribution Writer Area */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 md:p-8 border-2 border-purple-200 shadow-lg space-y-4">
          <div>
            <label className="block font-nunito font-extrabold text-sm text-slate-700 mb-1">
              Scene Headline:
            </label>
            <input
              type="text"
              placeholder="e.g. The Discovery of the Whispering Stone..."
              value={eventTitle}
              onChange={e => setEventTitle(e.target.value)}
              className="w-full p-3.5 rounded-xl border-2 border-slate-200 focus:border-purple-500 font-display font-bold text-lg text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block font-nunito font-extrabold text-sm text-slate-700 mb-1">
              What happens next? (Build onto the story):
            </label>
            <textarea
              rows={4}
              placeholder="Describe what the hero does, what unexpected event happens, or what is found..."
              value={eventDescription}
              onChange={e => setEventDescription(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-purple-500 font-nunito text-base text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none transition-all resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs font-nunito text-slate-500 italic">
              💡 Submitting this event will add it to the Story Timeline and allow you to pass the Baton!
            </p>
            <button
              type="button"
              onClick={handleSubmitContribution}
              disabled={!eventDescription.trim()}
              className="btn-story-primary w-full sm:w-auto !bg-gradient-to-r !from-purple-600 !to-pink-600"
            >
              <Send className="w-4 h-4" />
              <span>Add Event & Pass the Baton</span>
            </button>
          </div>
        </div>
      </div>

      <BatonPassModal isOpen={passModalOpen} onClose={() => setPassModalOpen(false)} />
    </>
  );
};
