import React from 'react';
import { Home, Maximize, Volume2, VolumeX, Menu, Compass, GraduationCap } from 'lucide-react';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';
import { BatonStatusBar } from '../baton/BatonStatusBar';
import { ISLAND_LOCATIONS, getHeroLocations } from '../../data/storyData';

interface TopBarProps {
  onToggleSidebar: () => void;
  onToggleTeacherDrawer: () => void;
  onToggleMap: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleSidebar,
  onToggleTeacherDrawer,
  onToggleMap
}) => {
  const { currentLevelId, completedLevels, setCurrentLevel, isTeacherMode, hero } = useStoryState();
  const { isMuted, toggleMute, playTap } = useAudio();

  const heroLocations = getHeroLocations(hero?.id);
  const currentLoc = heroLocations.find(l => l.id === currentLevelId) || heroLocations[0];
  const completedCount = completedLevels.length;
  const totalLevels = heroLocations.length;
  const progressPercent = Math.round((completedCount / totalLevels) * 100);

  const toggleFullScreen = () => {
    playTap();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleHomeClick = () => {
    playTap();
    setCurrentLevel('level-1');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/85 backdrop-blur-xl border-b border-purple-100/80 shadow-xs px-4 md:px-8 py-2.5 transition-all print:hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left Section: Menu, Home, Map, Breadcrumbs */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => { playTap(); onToggleSidebar(); }}
            className="w-10 h-10 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center transition-colors cursor-pointer border border-purple-200/60"
            title="Toggle Quest Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleHomeClick}
            className="w-10 h-10 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 flex items-center justify-center transition-colors cursor-pointer border border-amber-200/60"
            title="Return to Starter Cove"
          >
            <Home className="w-5 h-5" />
          </button>

          {/* Interactive Island Map Button */}
          <button
            type="button"
            onClick={() => { playTap(); onToggleMap(); }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-nunito font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all hover:scale-102"
            title="Open Interactive 3D Island World Map"
          >
            <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
            <span className="hidden sm:inline">Island Map 🗺️</span>
          </button>

          {/* Breadcrumb Title */}
          <div className="hidden lg:flex flex-col text-left pl-2">
            <span className="text-[10px] font-nunito font-extrabold text-purple-600 uppercase tracking-wider leading-none">
              Level {currentLoc.levelNumber} Quest
            </span>
            <span className="font-display font-black text-sm text-gray-900 leading-tight flex items-center gap-1">
              <span>{currentLoc.emoji}</span>
              <span className="truncate max-w-[200px]">{currentLoc.name}</span>
            </span>
          </div>
        </div>

        {/* Center: Live Baton Status */}
        <div className="flex items-center">
          <BatonStatusBar />
        </div>

        {/* Right Section: Progress, Teacher Mode, Audio, Fullscreen */}
        <div className="flex items-center gap-2">
          
          {/* SVG Circular Progress */}
          <div className="relative w-10 h-10 flex items-center justify-center" title={`${completedCount}/${totalLevels} Levels Completed (${progressPercent}%)`}>
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-purple-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-purple-600 transition-all duration-500 ease-out"
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-display font-black text-[10px] text-purple-900">
              {progressPercent}%
            </span>
          </div>

          {/* Teacher Mode Button */}
          <button
            type="button"
            onClick={() => { playTap(); onToggleTeacherDrawer(); }}
            className={`px-3 py-2 rounded-xl text-xs font-nunito font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isTeacherMode
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-white hover:bg-amber-50 text-amber-900 border-amber-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span className="hidden md:inline">Teacher</span>
          </button>

          {/* Audio Toggle */}
          <button
            type="button"
            onClick={() => { playTap(); toggleMute(); }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer border ${
              isMuted
                ? 'bg-slate-100 text-slate-400 border-slate-200'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200/60'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullScreen}
            className="w-10 h-10 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center transition-colors cursor-pointer border border-purple-200/60"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
