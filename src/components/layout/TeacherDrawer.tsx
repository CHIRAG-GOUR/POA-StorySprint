import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, Clock, Play, Pause, RotateCcw, Users, Plus, Trash2, BookOpen, Lightbulb } from 'lucide-react';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';
import { TEACHER_PROMPTS } from '../../data/storyData';

interface TeacherDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherDrawer: React.FC<TeacherDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    currentChapterId, 
    className, 
    setClassName, 
    storyTitle, 
    setStoryTitle, 
    participants, 
    addParticipant, 
    resetStory 
  } = useStoryState();
  const { playTap, playBatonPass } = useAudio();

  // Classroom Sprint Timer
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [newStudent, setNewStudent] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(s => s - 1), 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playBatonPass();
      alert('⏰ Story Sprint Timer Reached 0! Pass the Baton to the next storyteller!');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleToggleTimer = () => {
    playTap();
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = (secs: number) => {
    playTap();
    setIsTimerRunning(false);
    setTimerSeconds(secs);
  };

  const handleAddParticipant = () => {
    if (!newStudent.trim()) return;
    playTap();
    addParticipant(newStudent.trim());
    setNewStudent('');
  };

  const currentPrompts = TEACHER_PROMPTS[currentChapterId] || [
    'Guide the students: What unexpected consequence would make this scene more exciting?',
    'Remind the class: Listening is just as important as speaking in a story relay!'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl border-l-2 border-amber-200/80 shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-amber-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-display font-black text-xl shadow-sm">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-slate-900 leading-tight">
                    Teacher Facilitator
                  </h3>
                  <p className="font-nunito text-xs text-amber-700 font-bold">Classroom Command Deck</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Sections */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Sprint Timer */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-nunito font-bold text-amber-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Story Sprint Baton Timer</span>
                  </span>
                  <span className="font-display font-black text-xl text-amber-950">
                    {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleTimer}
                    className={`flex-1 py-2 rounded-xl font-nunito font-bold text-xs flex items-center justify-center gap-1.5 ${
                      isTimerRunning ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                    }`}
                  >
                    {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleResetTimer(60)}
                    className="px-2.5 py-2 rounded-xl bg-white border border-amber-200 text-xs font-nunito font-bold text-amber-900"
                  >
                    1m
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResetTimer(120)}
                    className="px-2.5 py-2 rounded-xl bg-white border border-amber-200 text-xs font-nunito font-bold text-amber-900"
                  >
                    2m
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResetTimer(180)}
                    className="px-2.5 py-2 rounded-xl bg-white border border-amber-200 text-xs font-nunito font-bold text-amber-900"
                  >
                    3m
                  </button>
                </div>
              </div>

              {/* Bloom's Taxonomy Pedagogical Prompts */}
              <div className="space-y-2">
                <h4 className="font-display font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-purple-600" />
                  <span>Chapter {currentChapterId} Prompts:</span>
                </h4>
                <div className="space-y-2">
                  {currentPrompts.map((p, idx) => (
                    <div key={idx} className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs font-nunito text-purple-950 leading-relaxed">
                      💡 "{p}"
                    </div>
                  ))}
                </div>
              </div>

              {/* Classroom Info Configuration */}
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <h4 className="font-display font-bold text-sm text-slate-900">
                  Classroom Details
                </h4>
                <div>
                  <label className="text-[11px] font-nunito font-bold text-slate-500 block mb-1">
                    Class / Section Name:
                  </label>
                  <input
                    type="text"
                    value={className}
                    onChange={e => setClassName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-nunito bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-nunito font-bold text-slate-500 block mb-1">
                    Story Title:
                  </label>
                  <input
                    type="text"
                    value={storyTitle}
                    onChange={e => setStoryTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-nunito bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Participants / Teams Roster */}
              <div className="space-y-2.5 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>Storyteller Teams ({participants.length})</span>
                  </h4>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="New team or student name..."
                    value={newStudent}
                    onChange={e => setNewStudent(e.target.value)}
                    className="flex-1 p-2 rounded-xl border border-slate-200 text-xs font-nunito bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddParticipant}
                    className="p-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {participants.map(p => (
                    <span key={p} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-nunito font-semibold">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={resetStory}
                className="text-xs font-nunito font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Story Sprint</span>
              </button>
              <span className="text-[10px] font-nunito text-slate-400">SkilliZee POA v1.0</span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
