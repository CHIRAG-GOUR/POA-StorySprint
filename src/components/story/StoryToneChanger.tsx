import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Check, Theater } from 'lucide-react';
import { TONES } from '../../data/storyData';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';

const CORE_SENTENCE = "The heavy brass door slowly began to swing open...";

export const StoryToneChanger: React.FC = () => {
  const { currentTone, setTone } = useStoryState();
  const { playTap } = useAudio();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const selectedToneObj = TONES.find(t => t.id === currentTone) || TONES[0];

  const handleSpeakTone = (tone: typeof TONES[0]) => {
    playTap();
    setTone(tone.id);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${CORE_SENTENCE} ${tone.sample}`);
      utterance.pitch = tone.pitch;
      utterance.rate = tone.rate;
      
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-800 font-nunito font-extrabold text-xs uppercase tracking-wider">
          Auditory & Emotional Expression
        </span>
        <h2 className="font-display font-black text-3xl md:text-4xl text-gray-900 leading-tight">
          Tone Challenge: How Words Come Alive 🎭
        </h2>
        <p className="font-nunito font-semibold text-slate-600 text-sm md:text-base max-w-xl mx-auto">
          The exact same words can feel terrified, hilarious, or majestic depending on the tone of delivery.
        </p>
      </div>

      {/* Main Sentence Display Box */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 border-3 border-purple-200 shadow-xl text-center space-y-4">
        <span className="text-xs font-nunito font-bold text-slate-400 uppercase tracking-widest">
          Test Sentence
        </span>
        <p className="font-display font-black text-2xl md:text-4xl text-purple-950 leading-relaxed">
          "{CORE_SENTENCE}"
        </p>

        {/* Selected Tone Preview */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-100 text-purple-900 font-display font-bold text-lg">
            <span>{selectedToneObj.emoji}</span>
            <span>Current Tone: {selectedToneObj.label}</span>
          </div>

          <button
            type="button"
            onClick={() => handleSpeakTone(selectedToneObj)}
            disabled={isPlayingAudio}
            className="btn-story-primary !py-2.5 !px-5 !min-h-[46px] text-sm !bg-gradient-to-r !from-pink-500 !to-purple-600"
          >
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span>{isPlayingAudio ? 'Speaking Voice...' : 'Listen in Tone 🔊'}</span>
          </button>
        </div>

        <p className="font-nunito text-sm text-slate-600 italic bg-purple-50/70 p-3 rounded-xl border border-purple-100">
          Example Extension: "{selectedToneObj.sample}"
        </p>
      </div>

      {/* Grid of 8 Tones */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TONES.map((t) => {
          const isSelected = currentTone === t.id;
          return (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => handleSpeakTone(t)}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-purple-600 text-white border-purple-600 shadow-lg scale-102 ring-4 ring-purple-300/30'
                  : 'bg-white/80 hover:bg-white border-slate-200 text-slate-800 hover:border-purple-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{t.emoji}</span>
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </div>
              <span className="font-display font-bold text-base leading-tight">
                {t.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
