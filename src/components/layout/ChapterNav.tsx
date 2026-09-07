import React from 'react';
import { ArrowLeft, ArrowRight, Lightbulb, Compass } from 'lucide-react';
import { ISLAND_LOCATIONS, TEACHER_PROMPTS, getHeroLocations } from '../../data/storyData';
import { LevelId } from '../../types/story';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';

export const ChapterNav: React.FC = () => {
  const { currentLevelId, setCurrentLevel, closeLevelActivity, hero, completeStory } = useStoryState();
  const { playTap, playBatonPass, playFanfare } = useAudio();

  const heroLocations = getHeroLocations(hero?.id);
  const currentIndex = heroLocations.findIndex(l => l.id === currentLevelId);
  const prevLoc = currentIndex > 0 ? heroLocations[currentIndex - 1] : null;
  const nextLoc = currentIndex < heroLocations.length - 1 ? heroLocations[currentIndex + 1] : null;

  const currentPrompts = TEACHER_PROMPTS[currentLevelId] || [
    'Guide the students: What unexpected consequence would make this scene more exciting?',
    'Remind the class: Listening is just as important as speaking in a story relay!'
  ];

  const handlePrev = () => {
    if (!prevLoc) return;
    playTap();
    setCurrentLevel(prevLoc.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (!nextLoc) {
      // At Level 6: Complete Story Ceremony & Award Honors
      playFanfare();
      completeStory();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    playBatonPass();
    setCurrentLevel(nextLoc.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-white/85 backdrop-blur-xl border-t border-purple-100 p-4 shadow-sm print:hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Previous Level Button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={!prevLoc}
          className="btn-story-secondary text-xs !min-h-[42px] !py-2 flex items-center gap-2 w-full md:w-auto justify-center disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{prevLoc ? `Previous: Level ${prevLoc.levelNumber}` : 'At Starter Cove'}</span>
        </button>

        {/* Center: 3D Island Return & Facilitation Hint */}
        <div className="flex-1 max-w-xl flex items-center gap-3">
          <button
            type="button"
            onClick={() => { playTap(); closeLevelActivity(); }}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white rounded-xl text-xs font-display font-black flex items-center gap-1.5 shrink-0 cursor-pointer transition-transform hover:scale-105 shadow-sm"
            title="Return to 3D Living Island"
          >
            <Compass className="w-4 h-4 text-emerald-100" />
            <span>3D Island 🏝️</span>
          </button>

          <div className="flex-1 bg-purple-50/70 px-4 py-2 rounded-xl border border-purple-100 flex items-center gap-2 text-xs font-nunito text-purple-900 truncate">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate italic">
              "{currentPrompts[0]}"
            </span>
          </div>
        </div>

        {/* Next / Complete Story Button */}
        <button
          type="button"
          onClick={handleNext}
          className="btn-story-primary text-xs !min-h-[42px] !py-2 !bg-gradient-to-r !from-purple-600 !via-pink-600 !to-amber-500 flex items-center gap-2 w-full md:w-auto justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform font-bold"
        >
          <span>{nextLoc ? `Next: Level ${nextLoc.levelNumber} (${nextLoc.name.split('&')[0]})` : 'Complete Story & Award Honors! 🏆'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
