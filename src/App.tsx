import React, { useState, useEffect } from 'react';
import { StoryStateProvider, useStoryState } from './context/StoryStateContext';
import { AudioProvider, useAudio } from './context/AudioContext';
import StoryWorldBackground from './components/background/StoryWorldBackground';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { ChapterNav } from './components/layout/ChapterNav';
import { TeacherDrawer } from './components/layout/TeacherDrawer';
import { WelcomeModal } from './components/welcome/WelcomeModal';

import { Level1HeroForge } from './components/levels/Level1HeroForge';
import { Level2RelicVault } from './components/levels/Level2RelicVault';
import { Level3BatonRelay } from './components/levels/Level3BatonRelay';
import { Level4WaterfallStudio } from './components/levels/Level4WaterfallStudio';
import { Level5VolcanoForge } from './components/levels/Level5VolcanoForge';
import { Level6StorybookGalleon } from './components/levels/Level6StorybookGalleon';
import { GrandHonorsModal } from './components/output/GrandHonorsModal';
import { Maximize, Minimize, Volume2, VolumeX, ArrowLeft, X } from 'lucide-react';
import { getHeroLocations } from './data/storyData';

function StorySprintContent() {
  const { 
    currentLevelId, 
    setCurrentLevel,
    isActivityModalOpen,
    openLevelActivity,
    closeLevelActivity,
    hero 
  } = useStoryState();
  
  const { isMuted, toggleMute, playTap } = useAudio();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teacherDrawerOpen, setTeacherDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true);

  // Monitor browser fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    playTap();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen error:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.warn('Exit fullscreen error:', err);
        });
      }
    }
  };

  const heroLocations = getHeroLocations(hero?.id);
  const currentLoc = heroLocations.find(l => l.id === currentLevelId) || heroLocations[0];

  // Active level router
  const renderCurrentLevel = () => {
    switch (currentLevelId) {
      case 'level-1':
        return <Level1HeroForge />;
      case 'level-2':
        return <Level2RelicVault />;
      case 'level-3':
        return <Level3BatonRelay />;
      case 'level-4':
        return <Level4WaterfallStudio />;
      case 'level-5':
        return <Level5VolcanoForge />;
      case 'level-6':
        return <Level6StorybookGalleon />;
      default:
        return <Level1HeroForge />;
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden select-none">
      {/* 🌟 Thin Decorative Border Frame */}
      <div className="fixed inset-2 sm:inset-3 border-2 border-white/80 rounded-2xl sm:rounded-3xl pointer-events-none z-40 shadow-[inset_0_0_12px_rgba(255,255,255,0.4)]" />

      {/* 🏝️ 3D LIVING ISLAND WORLD CANVAS (Always Active) */}
      <StoryWorldBackground />

      {/* 🗺️ Welcome Entry Window */}
      <WelcomeModal
        isOpen={isWelcomeOpen && !isActivityModalOpen}
        onStart={() => {
          setIsWelcomeOpen(false);
        }}
      />

      {/* 🧭 Top Navigation Header (Always Accessible on Island) */}
      <TopBar
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        onToggleTeacherDrawer={() => setTeacherDrawerOpen(prev => !prev)}
        onToggleMap={() => {
          playTap();
          closeLevelActivity();
        }}
      />

      {/* 🎮 MAIN ACTIVITY VIEW */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between bg-slate-950/40 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          {/* Header with Return to 3D Island Button */}
          <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-amber-200/80 px-4 md:px-8 py-3 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => { playTap(); closeLevelActivity(); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-display font-black text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to 3D Island 🏝️</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-xl">{currentLoc.emoji}</span>
                <span className="font-display font-black text-xs sm:text-sm text-[#78350F]">
                  Level {currentLoc.levelNumber}: {currentLoc.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { playTap(); setSidebarOpen(true); }}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-nunito font-bold border border-purple-200 cursor-pointer"
              >
                📜 Quests List
              </button>
              <button
                type="button"
                onClick={() => { playTap(); setTeacherDrawerOpen(true); }}
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-nunito font-bold border border-amber-200 cursor-pointer"
              >
                🎓 Teacher Hub
              </button>
              <button
                type="button"
                onClick={() => { playTap(); closeLevelActivity(); }}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Back to Island"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Activity Content */}
          <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex flex-col justify-center">
            {renderCurrentLevel()}
          </main>

          {/* Bottom Chapter Switcher Navigation */}
          <footer className="w-full py-2.5 bg-white/90 backdrop-blur-xl border-t border-slate-200 text-center">
            <ChapterNav />
          </footer>
        </div>
      )}

      {/* Floating Control Dock (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 print:hidden">
        <button
          type="button"
          onClick={() => { playTap(); toggleMute(); }}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-slate-900/85 hover:bg-slate-900 text-amber-300 backdrop-blur-xl border-2 border-amber-400/80 shadow-2xl cursor-pointer transition-all hover:scale-110 active:scale-95"
          title={isMuted ? "Unmute Sounds" : "Mute Sounds"}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-slate-900/85 hover:bg-slate-900 text-amber-300 backdrop-blur-xl border-2 border-amber-400/80 shadow-2xl cursor-pointer transition-all hover:scale-110 active:scale-95"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize className="w-5 h-5 text-amber-400" /> : <Maximize className="w-5 h-5 text-amber-400" />}
        </button>
      </div>

      {/* Sidebar Navigation Drawer */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Teacher Facilitation Drawer */}
      <TeacherDrawer
        isOpen={teacherDrawerOpen}
        onClose={() => setTeacherDrawerOpen(false)}
      />

      {/* 🏆 Grand Graduation & Honors Ceremony Modal */}
      <GrandHonorsModal />
    </div>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <StoryStateProvider>
        <StorySprintContent />
      </StoryStateProvider>
    </AudioProvider>
  );
}
