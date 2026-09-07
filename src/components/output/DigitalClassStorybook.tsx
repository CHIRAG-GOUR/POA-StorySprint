import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Printer, 
  Download,
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Heart, 
  Shield, 
  Layers, 
  Award, 
  Trophy,
  Rocket,
  Flame,
  Lightbulb,
  Compass,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';
import { CHARACTER_STORIES_MAP, CharacterStoryItem } from '../../data/characterStoriesData';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const DigitalClassStorybook: React.FC = () => {
  const { 
    className, 
    hero, 
    participants,
    selectedStoryId,
    setSelectedStoryId,
    completeStory
  } = useStoryState();
  
  const { playTap, playFanfare } = useAudio();

  // Active hero and strictly ONLY their 10 stories
  const activeHeroId = hero?.id || 'hero-naruto';
  const heroStories: CharacterStoryItem[] = CHARACTER_STORIES_MAP[activeHeroId] || CHARACTER_STORIES_MAP['hero-naruto'];

  // Current selected story index (0 to 9)
  const currentStoryIndex = Math.max(
    0, 
    heroStories.findIndex(s => s.id === selectedStoryId)
  );
  const activeStory: CharacterStoryItem = heroStories[currentStoryIndex] || heroStories[0];

  // Specific cover image with background for this character (Downloads original)
  const coverImageWithBackground = {
    'hero-naruto': '/assets/cover_naruto.webp',
    'hero-goku': '/assets/cover_goku.webp',
    'hero-po': '/assets/cover_po.webp',
    'hero-ironman': '/assets/cover_ironman.webp'
  }[activeHeroId] || '/assets/cover_naruto.webp';

  // Specific animated action gifs for this character
  const characterGifs = {
    'hero-naruto': [
      '/assets/gifs/naruto_1.gif',
      '/assets/gifs/naruto_2.gif',
      '/assets/gifs/naruto_3.gif',
      '/assets/gifs/naruto_4.gif',
      '/assets/gifs/naruto_5.gif'
    ],
    'hero-goku': [
      '/assets/gifs/goku_1.gif',
      '/assets/gifs/goku_2.gif',
      '/assets/gifs/goku_3.gif',
      '/assets/gifs/goku_4.gif',
      '/assets/gifs/goku_1.gif'
    ],
    'hero-po': [
      '/assets/gifs/po_1.gif',
      '/assets/gifs/po_2.gif',
      '/assets/gifs/po_3.gif',
      '/assets/gifs/po_4.gif',
      '/assets/gifs/po_5.gif'
    ],
    'hero-ironman': [
      '/assets/gifs/ironman_1.gif',
      '/assets/gifs/ironman_2.gif',
      '/assets/gifs/ironman_3.gif',
      '/assets/gifs/ironman_4.gif',
      '/assets/gifs/ironman_5.gif'
    ]
  }[activeHeroId] || [
    '/assets/gifs/naruto_1.gif',
    '/assets/gifs/naruto_2.gif',
    '/assets/gifs/naruto_3.gif',
    '/assets/gifs/naruto_4.gif',
    '/assets/gifs/naruto_5.gif'
  ];

  // Book reader spread state:
  // 0: Closed Front Hardcover
  // 1: Spread 1 (Pages 1 & 2: Chapter 1 & Chapter 2)
  // 2: Spread 2 (Pages 3 & 4: Chapter 3 & Chapter 4)
  // 3: Spread 3 (Pages 5 & 6: Chapter 5 & Epilogue)
  // 4: Closed Back Hardcover (Certificate & Seals)
  const [currentSpread, setCurrentSpread] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Sync story selection to active hero
  useEffect(() => {
    if (!selectedStoryId || !selectedStoryId.startsWith(activeHeroId.replace('hero-', ''))) {
      if (heroStories.length > 0) {
        setSelectedStoryId(heroStories[0].id);
      }
    }
  }, [activeHeroId, selectedStoryId, setSelectedStoryId, heroStories]);

  // Turn to next spread
  const handleNextSpread = () => {
    if (currentSpread < 4 && !isFlipping) {
      playTap();
      setFlipDirection('next');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSpread(prev => Math.min(4, prev + 1));
        setIsFlipping(false);
      }, 350);
    }
  };

  // Turn to previous spread
  const handlePrevSpread = () => {
    if (currentSpread > 0 && !isFlipping) {
      playTap();
      setFlipDirection('prev');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentSpread(prev => Math.max(0, prev - 1));
        setIsFlipping(false);
      }, 350);
    }
  };

  // Select a story from the 10 character stories
  const handleSelectStory = (storyId: string) => {
    playTap();
    setSelectedStoryId(storyId);
    setCurrentSpread(0);
  };

  const [exportProgress, setExportProgress] = useState<string | null>(null);

  // 📥 Download Each Page in Standard A4 Size (Multi-Page PDF)
  const handleDownloadA4PDF = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    setExportProgress('Preparing Storybook Pages...');
    playFanfare();

    // Dedicated offscreen rendering sandbox
    const sandbox = document.createElement('div');
    sandbox.id = 'pdf-export-sandbox';
    sandbox.style.position = 'fixed';
    sandbox.style.left = '0';
    sandbox.style.top = '0';
    sandbox.style.width = '794px'; // 210mm at 96 DPI
    sandbox.style.zIndex = '-99999';
    sandbox.style.opacity = '0';
    sandbox.style.pointerEvents = 'none';
    sandbox.style.background = '#faf6ed';
    document.body.appendChild(sandbox);

    try {
      const template = document.getElementById('storybook-a4-print-template');
      if (!template) {
        window.print();
        setIsExportingPdf(false);
        setExportProgress(null);
        return;
      }

      // Clone template into sandbox
      const clone = template.cloneNode(true) as HTMLElement;
      clone.style.display = 'block';
      clone.classList.remove('hidden');
      sandbox.appendChild(clone);

      const pages = clone.querySelectorAll('.print-a4-page');
      const totalPages = pages.length;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      for (let i = 0; i < totalPages; i++) {
        setExportProgress(`Rendering Page ${i + 1} of ${totalPages}...`);
        const pageElement = pages[i] as HTMLElement;
        
        // Ensure explicit width/height for A4 aspect ratio
        pageElement.style.width = '794px';
        pageElement.style.minHeight = '1123px';
        pageElement.style.boxSizing = 'border-box';

        const canvas = await html2canvas(pageElement, {
          scale: 2, // 2x scale = 1588x2246 sharp print resolution
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#faf6ed'
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) {
          pdf.addPage('a4', 'portrait');
        }
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      }

      setExportProgress('Saving A4 PDF Masterpiece...');
      const safeTitle = activeStory.title.replace(/[^a-zA-Z0-9_-]/g, '_');
      pdf.save(`${safeTitle}_A4_Storybook.pdf`);
    } catch (err) {
      console.warn('PDF export fallback to browser print', err);
      window.print();
    } finally {
      if (document.body.contains(sandbox)) {
        document.body.removeChild(sandbox);
      }
      setIsExportingPdf(false);
      setExportProgress(null);
    }
  };

  // Direct A4 Print Action
  const handlePrintA4 = () => {
    playFanfare();
    window.print();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        handleNextSpread();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrevSpread();
      } else if (e.key === 'Home') {
        setCurrentSpread(0);
      } else if (e.key === 'End') {
        setCurrentSpread(4);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSpread, isFlipping]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-16">
      
      {/* ── 📚 TOP CONTROL BAR & 10 CHARACTER STORIES SELECTOR ── */}
      <div className="flex flex-col gap-4 bg-white/95 backdrop-blur-xl p-5 rounded-3xl border-2 border-amber-300 shadow-xl print:hidden">
        
        {/* Row 1: Active Hero Header & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl text-white shadow-md border-2 border-white">
              {hero?.emoji || activeStory.crestEmoji}
            </div>
            <div>
              <span className="text-[10px] font-nunito font-black text-amber-700 uppercase tracking-widest block">
                Official Classroom Chronicle
              </span>
              <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 leading-tight">
                {hero?.name}’s Published Storybook 📖
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {currentSpread > 0 && (
              <button
                type="button"
                onClick={() => { playTap(); setCurrentSpread(0); }}
                className="btn-story-secondary text-xs !min-h-[38px] !py-2 flex items-center gap-1.5 cursor-pointer !bg-white hover:!bg-amber-50 border border-amber-300 text-slate-800 font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                <span>Front Cover</span>
              </button>
            )}

            {/* 📥 Download A4 PDF Button */}
            <button
              type="button"
              onClick={handleDownloadA4PDF}
              disabled={isExportingPdf}
              className="btn-story-primary text-xs !min-h-[38px] !py-2 !bg-gradient-to-r !from-emerald-600 !via-teal-600 !to-cyan-600 flex items-center gap-1.5 cursor-pointer shadow-md text-white font-bold disabled:opacity-50"
              title="Download entire storybook as multi-page A4 PDF"
            >
              {isExportingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isExportingPdf ? 'Exporting A4 PDF...' : 'Download A4 PDF'}</span>
            </button>

            {/* 🖨️ Print A4 Pages */}
            <button
              type="button"
              onClick={handlePrintA4}
              className="btn-story-primary text-xs !min-h-[38px] !py-2 !bg-gradient-to-r !from-amber-500 !via-orange-500 !to-red-500 flex items-center gap-1.5 cursor-pointer shadow-md text-white font-bold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4 Book</span>
            </button>

            {/* 🚀 Award Honors & Launch Rockets */}
            <button
              type="button"
              onClick={() => { playFanfare(); completeStory(); }}
              className="btn-story-primary text-xs !min-h-[38px] !py-2 !bg-gradient-to-r !from-purple-600 !via-pink-600 !to-amber-500 flex items-center gap-1.5 cursor-pointer shadow-md text-white font-bold"
            >
              <Rocket className="w-3.5 h-3.5 text-amber-300" />
              <span>Award Honors 🏆</span>
            </button>
          </div>
        </div>

        {/* Export Progress Notification Banner */}
        {exportProgress && (
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-nunito font-bold text-xs shadow-xs animate-pulse">
            <Loader2 className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
            <span>{exportProgress}</span>
          </div>
        )}

        {/* Row 2: 10 Bespoke Stories for THIS Selected Character Only */}
        <div className="flex flex-col gap-2 pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between text-xs font-nunito font-extrabold text-slate-700">
            <span className="flex items-center gap-1.5 text-amber-800 font-black">
              <Layers className="w-4 h-4 text-amber-600" />
              10 Complete Bespoke Stories for {hero?.name || 'Character'} (Select to Read):
            </span>
            <span className="text-slate-500 font-bold">
              Story {currentStoryIndex + 1} of 10
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {heroStories.map((st, idx) => {
              const isSelected = st.id === activeStory.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleSelectStory(st.id)}
                  className={`p-2.5 rounded-2xl text-left transition-all border cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-300 shadow-md scale-102 ring-2 ring-amber-400/50'
                      : 'bg-white hover:bg-amber-50/80 text-slate-800 border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-black mb-1">
                    <span className={isSelected ? 'text-amber-100' : 'text-amber-700'}>
                      #{idx + 1}
                    </span>
                    <span>{st.crestEmoji}</span>
                  </div>
                  <div className="font-display font-black text-xs leading-tight line-clamp-2">
                    {st.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── 📖 3D PHYSICAL FLIP-BOOK CONTAINER WITH REALISTIC PERSPECTIVE ── */}
      <div className="relative w-full min-h-[660px] flex items-center justify-center py-6 perspective-[2500px]">
        
        {/* Book shadow & table ambiance */}
        <div className="absolute inset-x-8 bottom-0 h-16 bg-black/40 rounded-full blur-2xl transform scale-y-50 pointer-events-none z-0" />

        <div className="relative w-full max-w-5xl min-h-[610px] flex items-center justify-center z-10">
          
          <AnimatePresence mode="wait">
            
            {/* ══════════════════════════════════════════════════════════════
               SPREAD 0: CLOSED FRONT HARDCOVER (With Rich Cover Art & Background & Metallic Seals)
               ══════════════════════════════════════════════════════════════ */}
            {currentSpread === 0 && (
              <motion.div
                key={`spread-0-${activeStory.id}`}
                initial={{ scale: 0.94, opacity: 0, rotateY: -18 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.94, opacity: 0, rotateY: -65 }}
                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                onClick={handleNextSpread}
                className="relative w-full max-w-2xl min-h-[600px] rounded-[38px] shadow-[0_35px_85px_rgba(0,0,0,0.85),0_15px_30px_rgba(0,0,0,0.5)] overflow-hidden border-[8px] border-amber-400 flex flex-col justify-between select-none cursor-pointer group transform-gpu"
              >
                {/* Rich Hardcover Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${activeStory.bgGradient} z-0`} />
                
                {/* Leather Grain Texture Overlay */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />

                {/* Layered Paper Edge Rim (Simulating 200 Stacked Pages) */}
                <div className="absolute right-0 top-3 bottom-3 w-3 bg-gradient-to-l from-stone-400/80 via-stone-200/90 to-stone-400/60 shadow-inner z-15 pointer-events-none border-l border-stone-400/40" />
                <div className="absolute bottom-0 left-12 right-0 h-3 bg-gradient-to-t from-stone-400/80 via-stone-200/90 to-stone-400/60 shadow-inner z-15 pointer-events-none border-t border-stone-400/40" />

                {/* Left Spine Ribbon with Gold Foil Ribs */}
                <div className={`absolute left-0 top-0 bottom-0 w-12 sm:w-14 ${activeStory.spineColor} border-r-2 border-amber-400/90 shadow-[inset_-8px_0_20px_rgba(0,0,0,0.85)] z-20 flex flex-col items-center justify-between py-7`}>
                  <div className="w-3 h-3 rounded-full bg-amber-300 shadow-sm border border-amber-100" />
                  <div className="space-y-4 flex flex-col items-center">
                    <div className="w-6 h-0.5 bg-amber-300/80 shadow-xs" />
                    <span className="[writing-mode:vertical-lr] rotate-180 font-display font-black text-xs sm:text-sm text-amber-200 tracking-widest uppercase drop-shadow-md">
                      SkilliZee Chronicles
                    </span>
                    <div className="w-6 h-0.5 bg-amber-300/80 shadow-xs" />
                  </div>
                  <div className="w-3 h-3 rounded-full bg-amber-300 shadow-sm border border-amber-100" />
                </div>

                {/* Gilded Metal Protective Corner Brackets */}
                <div className="absolute top-0 right-0 w-18 h-18 border-t-[6px] border-r-[6px] border-amber-300 rounded-tr-[30px] pointer-events-none z-20 shadow-md" />
                <div className="absolute bottom-0 right-0 w-18 h-18 border-b-[6px] border-r-[6px] border-amber-300 rounded-br-[30px] pointer-events-none z-20 shadow-md" />

                {/* Silk Ribbon Bookmark */}
                <div className="absolute top-0 right-16 w-6 h-28 bg-gradient-to-b from-amber-400 to-red-600 shadow-lg z-25 rounded-b-md flex items-end justify-center pb-2 border-x border-amber-200">
                  <span className="text-xs">{activeStory.crestEmoji}</span>
                </div>

                {/* Front Cover Layout */}
                <div className="relative z-10 pl-16 pr-8 sm:pl-22 sm:pr-12 py-7 flex flex-col items-center text-center justify-between h-full space-y-4">
                  
                  {/* 🎖️ Gilded Tagline Ribbon Badge */}
                  <div className="space-y-1 mt-1">
                    <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/30 to-amber-500/20 border-2 border-amber-300/80 text-amber-200 text-xs font-nunito font-extrabold uppercase tracking-widest shadow-[0_2px_8px_rgba(245,158,11,0.3)]">
                      <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                      <span>{activeStory.tagline}</span>
                    </div>
                    
                    {/* Story Title */}
                    <h1 className="font-display font-black text-2xl sm:text-4xl text-amber-100 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] mt-2 leading-tight tracking-tight">
                      {activeStory.title}
                    </h1>
                    
                    <p className="font-nunito font-bold text-xs sm:text-sm text-amber-300 drop-shadow-md">
                      {activeStory.subtitle}
                    </p>
                  </div>

                  {/* 🖼️ Gilded Full-Art Character Cover Image (With Background Intact) */}
                  <div className="relative my-1 w-full max-w-sm">
                    <div className="w-full h-46 sm:h-54 rounded-2xl p-2 bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 shadow-[0_0_35px_rgba(245,158,11,0.6)] border-2 border-white/80 flex items-center justify-center">
                      <div className="w-full h-full rounded-xl overflow-hidden bg-slate-950 relative border border-amber-200 shadow-inner">
                        <img
                          src={coverImageWithBackground}
                          alt={activeStory.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                        <span className="absolute bottom-2 left-3 right-3 text-center text-xs font-display font-black text-amber-200 drop-shadow-lg truncate">
                          {hero?.name} • Official Author Edition
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 🏅 3 Premium Metallic Pill Cards (Balanced 3-Column Grid) */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full max-w-lg">
                    {/* 1. Insight Seal */}
                    <div className="bg-gradient-to-b from-amber-900/80 via-amber-800/60 to-amber-950/90 border-2 border-amber-400/90 shadow-[0_3px_12px_rgba(245,158,11,0.35)] rounded-2xl p-2.5 flex flex-col items-center justify-center text-center">
                      <div className="flex items-center gap-1 text-[10px] font-nunito font-black uppercase text-amber-300/90 tracking-wider mb-0.5">
                        <Lightbulb className="w-3 h-3 text-amber-400" />
                        <span>Insight</span>
                      </div>
                      <span className="font-display font-black text-[11px] sm:text-xs text-amber-100 leading-tight line-clamp-2">
                        {activeStory.authorSeals.insight}
                      </span>
                    </div>

                    {/* 2. Teamwork Seal */}
                    <div className="bg-gradient-to-b from-blue-950/80 via-blue-900/60 to-slate-950/90 border-2 border-sky-400/90 shadow-[0_3px_12px_rgba(56,189,248,0.35)] rounded-2xl p-2.5 flex flex-col items-center justify-center text-center">
                      <div className="flex items-center gap-1 text-[10px] font-nunito font-black uppercase text-sky-300/90 tracking-wider mb-0.5">
                        <Shield className="w-3 h-3 text-sky-400" />
                        <span>Teamwork</span>
                      </div>
                      <span className="font-display font-black text-[11px] sm:text-xs text-sky-100 leading-tight line-clamp-2">
                        {activeStory.authorSeals.teamwork}
                      </span>
                    </div>

                    {/* 3. Moral Seal */}
                    <div className="bg-gradient-to-b from-emerald-950/80 via-emerald-900/60 to-slate-950/90 border-2 border-emerald-400/90 shadow-[0_3px_12px_rgba(16,185,129,0.35)] rounded-2xl p-2.5 flex flex-col items-center justify-center text-center">
                      <div className="flex items-center gap-1 text-[10px] font-nunito font-black uppercase text-emerald-300/90 tracking-wider mb-0.5">
                        <Heart className="w-3 h-3 text-emerald-400" />
                        <span>Moral</span>
                      </div>
                      <span className="font-display font-black text-[11px] sm:text-xs text-emerald-100 leading-tight line-clamp-2">
                        {activeStory.authorSeals.moral}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Flip Hint Button */}
                  <div className="pt-1 w-full max-w-md space-y-1.5">
                    <div className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-display font-black text-base shadow-[0_10px_30px_rgba(245,158,11,0.6)] group-hover:scale-103 transition-transform flex items-center justify-center gap-2.5 border-2 border-white/90">
                      <BookOpen className="w-5 h-5 text-slate-950" />
                      <span>CLICK TO OPEN & TURN PAGES ➔</span>
                    </div>
                    <p className="text-xs font-nunito font-bold text-amber-200/90">
                      Written & Illustrated by {className}
                    </p>
                  </div>

                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════
               SPREADS 1, 2, 3: OPEN DOUBLE-PAGE SPREADS (Rich Parchment & Drop Caps & GIFs)
               ══════════════════════════════════════════════════════════════ */}
            {(currentSpread === 1 || currentSpread === 2 || currentSpread === 3) && (
              <motion.div
                key={`spread-${currentSpread}-${activeStory.id}`}
                initial={{ opacity: 0, rotateY: flipDirection === 'next' ? 22 : -22, scale: 0.98 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: flipDirection === 'next' ? -22 : 22, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                className="relative w-full max-w-5xl min-h-[600px] rounded-[38px] shadow-[0_30px_80px_rgba(0,0,0,0.75)] overflow-hidden border-[8px] border-amber-300/90 bg-[#faf6ed] text-slate-900 select-none transform-gpu"
              >
                {/* 3D Stacked Page Edge Layers */}
                <div className="absolute top-0 bottom-0 left-0 w-5 bg-gradient-to-r from-stone-500/30 to-transparent pointer-events-none z-20" />
                <div className="absolute top-0 bottom-0 right-0 w-5 bg-gradient-to-l from-stone-500/30 to-transparent pointer-events-none z-20" />
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-stone-500/30 to-transparent pointer-events-none z-20" />

                {/* Deep Spine Center Gutter Fold Shadow */}
                <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-14 -ml-7 bg-gradient-to-r from-stone-500/15 via-stone-900/40 to-stone-500/15 z-20 pointer-events-none shadow-inner" />

                {/* Silk Ribbon Bookmark Hanging at Center */}
                <div className="hidden md:block absolute top-0 left-1/2 -ml-3 w-6 h-24 bg-gradient-to-b from-amber-500 via-red-500 to-red-700 rounded-b-md shadow-md z-30 pointer-events-none border-x border-amber-300/70" />

                {/* 2-Page Spread Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x-2 divide-amber-200/80 min-h-[550px]">
                  
                  {/* ── LEFT PAGE ── */}
                  {(() => {
                    const leftIdx = (currentSpread - 1) * 2;
                    const leftCh = activeStory.chapters[leftIdx];
                    const leftPageNum = leftIdx + 1;
                    const initialLetter = leftCh.content.charAt(0);
                    const restContent = leftCh.content.slice(1);
                    const actionGif = characterGifs[leftIdx % characterGifs.length];

                    return (
                      <div 
                        onClick={handlePrevSpread}
                        className="p-7 sm:p-9 flex flex-col justify-between space-y-4 bg-gradient-to-br from-[#fefcf8] via-[#faf6ed] to-[#f4ecd9] cursor-pointer hover:bg-[#f8f2e2] transition-colors relative group"
                        title="Click left page to turn back"
                      >
                        {/* Page Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-amber-300/70 text-xs font-nunito font-black text-amber-900">
                          <span className="uppercase tracking-widest truncate max-w-[260px]">
                            {activeStory.title}
                          </span>
                          <span className="bg-amber-200/70 px-2.5 py-0.5 rounded-full text-amber-950 font-bold">
                            Page {leftPageNum}
                          </span>
                        </div>

                        {/* Chapter Body */}
                        <div className="space-y-4 flex-1">
                          
                          {/* Chapter Header Banner */}
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl text-white shadow-sm shrink-0 border border-white">
                              {leftCh.icon}
                            </div>
                            <div>
                              <span className="text-xs font-nunito font-black uppercase tracking-widest text-amber-800 block">
                                {leftCh.chapterNumber}
                              </span>
                              <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 leading-tight">
                                {leftCh.chapterTitle}
                              </h2>
                            </div>
                          </div>

                          {/* 🎬 Embedded Illustrated Action Scene GIF */}
                          <div className="w-full h-32 sm:h-36 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-sm relative bg-slate-950">
                            <img
                              src={actionGif}
                              alt={leftCh.chapterTitle}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                            <span className="absolute bottom-1.5 left-2.5 right-2.5 text-[11px] font-display font-bold text-amber-200 truncate">
                              Scene: {leftCh.chapterTitle}
                            </span>
                          </div>

                          {/* Illuminated Drop-Cap Narrative */}
                          <div className="text-slate-900 font-nunito text-sm sm:text-base leading-relaxed space-y-3 font-semibold">
                            <p>
                              <span className="float-left text-4xl sm:text-5xl font-display font-black text-amber-700 mr-2 leading-none p-1.5 bg-amber-100/70 rounded-xl border border-amber-300/50 shadow-xs">
                                {initialLetter}
                              </span>
                              {restContent}
                            </p>
                          </div>

                          {/* Highlight box */}
                          {leftCh.highlightBox && (
                            <div className="p-3.5 rounded-2xl bg-amber-100/70 border-2 border-amber-300/80 shadow-xs space-y-1">
                              <span className="text-xs font-nunito font-black uppercase text-amber-900 flex items-center gap-1.5">
                                <Award className="w-3.5 h-3.5 text-amber-600" />
                                {leftCh.highlightBox.title}
                              </span>
                              <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
                                {leftCh.highlightBox.text}
                              </p>
                            </div>
                          )}

                        </div>

                        {/* Page Footer */}
                        <div className="pt-2 flex items-center justify-between text-[11px] font-nunito font-extrabold text-amber-900/60 border-t border-amber-200">
                          <span>SkilliZee Chronicles • {className}</span>
                          <span className="text-amber-700 font-black group-hover:underline">⬅ Turn Back</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* ── RIGHT PAGE ── */}
                  {(() => {
                    const rightIdx = (currentSpread - 1) * 2 + 1;
                    const rightCh = activeStory.chapters[rightIdx];
                    const rightPageNum = rightIdx + 1;
                    const initialLetter = rightCh.content.charAt(0);
                    const restContent = rightCh.content.slice(1);
                    const actionGif = characterGifs[rightIdx % characterGifs.length];

                    return (
                      <div 
                        onClick={handleNextSpread}
                        className="p-7 sm:p-9 flex flex-col justify-between space-y-4 bg-gradient-to-bl from-[#fefcf8] via-[#faf6ed] to-[#f4ecd9] cursor-pointer hover:bg-[#f8f2e2] transition-colors relative group"
                        title="Click right page to turn forward"
                      >
                        {/* Page Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-amber-300/70 text-xs font-nunito font-black text-amber-900">
                          <span className="uppercase tracking-widest">
                            {rightCh.chapterTitle}
                          </span>
                          <span className="bg-amber-200/70 px-2.5 py-0.5 rounded-full text-amber-950 font-bold">
                            Page {rightPageNum}
                          </span>
                        </div>

                        {/* Chapter Body */}
                        <div className="space-y-4 flex-1">
                          
                          {/* Chapter Header Banner */}
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl text-white shadow-sm shrink-0 border border-white">
                              {rightCh.icon}
                            </div>
                            <div>
                              <span className="text-xs font-nunito font-black uppercase tracking-widest text-purple-800 block">
                                {rightCh.chapterNumber}
                              </span>
                              <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 leading-tight">
                                {rightCh.chapterTitle}
                              </h2>
                            </div>
                          </div>

                          {/* 🎬 Embedded Illustrated Action Scene GIF */}
                          <div className="w-full h-32 sm:h-36 rounded-2xl overflow-hidden border-2 border-purple-300 shadow-sm relative bg-slate-950">
                            <img
                              src={actionGif}
                              alt={rightCh.chapterTitle}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                            <span className="absolute bottom-1.5 left-2.5 right-2.5 text-[11px] font-display font-bold text-purple-200 truncate">
                              Scene: {rightCh.chapterTitle}
                            </span>
                          </div>

                          {/* Illuminated Drop-Cap Narrative */}
                          <div className="text-slate-900 font-nunito text-sm sm:text-base leading-relaxed space-y-3 font-semibold">
                            <p>
                              <span className="float-left text-4xl sm:text-5xl font-display font-black text-purple-700 mr-2 leading-none p-1.5 bg-purple-100/70 rounded-xl border border-purple-300/50 shadow-xs">
                                {initialLetter}
                              </span>
                              {restContent}
                            </p>
                          </div>

                          {/* Highlight box */}
                          {rightCh.highlightBox && (
                            <div className="p-3.5 rounded-2xl bg-purple-100/70 border-2 border-purple-300/80 shadow-xs space-y-1">
                              <span className="text-xs font-nunito font-black uppercase text-purple-900 flex items-center gap-1.5">
                                <Award className="w-3.5 h-3.5 text-purple-600" />
                                {rightCh.highlightBox.title}
                              </span>
                              <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
                                {rightCh.highlightBox.text}
                              </p>
                            </div>
                          )}

                          {/* Epilogue Author Honors */}
                          {currentSpread === 3 && (
                            <div className="p-3.5 rounded-2xl bg-amber-100/80 border-2 border-amber-300 space-y-1.5">
                              <div className="flex items-center justify-between text-xs font-black uppercase text-amber-900">
                                <span className="flex items-center gap-1">
                                  <Award className="w-4 h-4 text-amber-600" />
                                  Official Authors & Storytellers:
                                </span>
                                <span>Classroom Edition</span>
                              </div>
                              <p className="text-xs font-extrabold text-slate-800">
                                {participants.join(' • ')}
                              </p>
                            </div>
                          )}

                        </div>

                        {/* Page Footer */}
                        <div className="pt-2 flex items-center justify-between text-[11px] font-nunito font-extrabold text-amber-900/60 border-t border-amber-200">
                          <span className="text-amber-700 font-black group-hover:underline">Turn Next ➔</span>
                          <span>The End of Spread</span>
                        </div>
                      </div>
                    );
                  })()}

                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════
               SPREAD 4: CLOSED BACK HARDCOVER (Certificate & Reopen)
               ══════════════════════════════════════════════════════════════ */}
            {currentSpread === 4 && (
              <motion.div
                key={`spread-4-${activeStory.id}`}
                initial={{ scale: 0.94, opacity: 0, rotateY: 18 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.94, opacity: 0, rotateY: -18 }}
                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                className="relative w-full max-w-2xl min-h-[600px] rounded-[38px] shadow-[0_35px_85px_rgba(0,0,0,0.85),0_15px_30px_rgba(0,0,0,0.5)] overflow-hidden border-[8px] border-amber-400 flex flex-col justify-between p-8 text-center select-none"
              >
                {/* Leather Texture */}
                <div className={`absolute inset-0 bg-gradient-to-br ${activeStory.bgGradient} z-0`} />

                {/* Back Cover Details */}
                <div className="relative z-10 flex flex-col items-center justify-between h-full space-y-5 text-amber-100">
                  
                  <div className="space-y-2 mt-2">
                    <div className="w-16 h-16 rounded-3xl bg-amber-400/20 border-2 border-amber-300 flex items-center justify-center text-4xl shadow-inner mx-auto">
                      📜
                    </div>
                    <h2 className="font-display font-black text-3xl sm:text-4xl text-amber-200">
                      The Legend Concludes
                    </h2>
                    <p className="text-sm font-nunito font-bold text-amber-300/80">
                      Official SkilliZee Story Sprint Passport Certificate
                    </p>
                  </div>

                  {/* Moral Wisdom */}
                  <div className="p-5 rounded-3xl bg-black/40 border-2 border-amber-300/40 max-w-lg">
                    <span className="text-xs font-black uppercase text-amber-300 block mb-1">
                      The Living Moral Wisdom:
                    </span>
                    <p className="text-sm sm:text-base font-display font-bold italic text-amber-100">
                      "{activeStory.moral}"
                    </p>
                  </div>

                  {/* Author Stamp Certificate */}
                  <div className="p-4 rounded-2xl bg-amber-400/15 border border-amber-300/40 max-w-md w-full">
                    <span className="text-xs font-black uppercase text-amber-300 block mb-1">
                      Certified Authors:
                    </span>
                    <p className="text-xs font-extrabold text-white">
                      {participants.join(', ')} • {className}
                    </p>
                  </div>

                  {/* Reopen / Award Honors Controls */}
                  <div className="pt-2 w-full max-w-md space-y-2.5">
                    <button
                      type="button"
                      onClick={() => { playFanfare(); completeStory(); }}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-display font-black text-base shadow-lg cursor-pointer hover:scale-103 transition-transform flex items-center justify-center gap-2 border-2 border-white/80"
                    >
                      <Rocket className="w-5 h-5 text-amber-300 animate-bounce" />
                      <span>AWARD HONORS & LAUNCH ROCKETS! 🚀</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { playTap(); setCurrentSpread(0); }}
                      className="w-full py-3 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-amber-200 font-display font-bold text-sm border border-amber-300/50 cursor-pointer transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reopen from Front Cover</span>
                    </button>
                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>

      {/* ── SPREAD BOTTOM FLIP NAVIGATION BAR ── */}
      <div className="flex items-center justify-between p-4 bg-white/90 backdrop-blur-xl rounded-2xl border-2 border-amber-300/80 shadow-md max-w-5xl mx-auto w-full print:hidden">
        
        {/* Previous Page Button */}
        <button
          type="button"
          onClick={handlePrevSpread}
          disabled={currentSpread === 0 || isFlipping}
          className="btn-story-secondary text-xs !min-h-[40px] !py-2 flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer !bg-white hover:!bg-amber-50 text-slate-800 font-black border border-amber-300 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4 text-amber-700" />
          <span>Previous (Turn Back)</span>
        </button>

        {/* Spread Selector Tabs */}
        <div className="flex items-center gap-2">
          {[
            { label: 'Front Cover', spread: 0 },
            { label: 'Ch 1 & 2', spread: 1 },
            { label: 'Ch 3 & 4', spread: 2 },
            { label: 'Ch 5 & Epilogue', spread: 3 },
            { label: 'Back Cover', spread: 4 }
          ].map((tab) => {
            const isActive = currentSpread === tab.spread;
            return (
              <button
                key={tab.spread}
                onClick={() => { playTap(); setCurrentSpread(tab.spread); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-display font-black transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-amber-300 shadow-md scale-105 ring-2 ring-amber-400'
                    : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Next Page Button */}
        <button
          type="button"
          onClick={handleNextSpread}
          disabled={currentSpread === 4 || isFlipping}
          className="btn-story-secondary text-xs !min-h-[40px] !py-2 flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer !bg-white hover:!bg-amber-50 text-slate-800 font-black border border-amber-300 shadow-sm"
        >
          <span>Next (Turn Page)</span>
          <ChevronRight className="w-4 h-4 text-amber-700" />
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
         🖨️ DEDICATED MULTI-PAGE A4 PRINT & PDF GENERATION TEMPLATE
         (Renders exactly 8 distinct A4 portrait pages for export/print)
         ══════════════════════════════════════════════════════════════════ */}
      <div id="storybook-a4-print-template" className="hidden print:block print-a4-container">
        
        {/* ── A4 PAGE 1: FRONT COVER ── */}
        <div className="print-a4-page bg-gradient-to-br from-amber-950 via-stone-900 to-amber-950 text-amber-100 border-8 border-amber-400 rounded-3xl p-10 flex flex-col justify-between text-center">
          <div className="space-y-3">
            <div className="inline-block px-6 py-2 rounded-full bg-amber-400/30 border border-amber-300 text-amber-200 font-black text-sm uppercase tracking-widest">
              {activeStory.tagline}
            </div>
            <h1 className="font-display font-black text-4xl text-amber-100 leading-tight">
              {activeStory.title}
            </h1>
            <p className="font-nunito font-bold text-lg text-amber-300">
              {activeStory.subtitle}
            </p>
          </div>

          <div className="my-4 mx-auto w-72 h-72 rounded-3xl overflow-hidden border-4 border-amber-400 shadow-2xl bg-black">
            <img
              src={coverImageWithBackground}
              alt={activeStory.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 w-full max-w-md mx-auto">
            <div className="p-3 rounded-2xl bg-amber-900/80 border border-amber-400 text-amber-200 font-black text-xs">
              💡 {activeStory.authorSeals.insight}
            </div>
            <div className="p-3 rounded-2xl bg-blue-950/80 border border-sky-400 text-sky-200 font-black text-xs">
              🛡️ {activeStory.authorSeals.teamwork}
            </div>
            <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-400 text-emerald-200 font-black text-xs">
              ❤️ {activeStory.authorSeals.moral}
            </div>
          </div>

          <div className="pt-4 border-t border-amber-400/40 text-sm font-bold text-amber-300">
            Written & Illustrated Collaboratively by {className}
          </div>
        </div>

        {/* ── A4 PAGES 2 TO 7: CHAPTERS 1 TO 6 ── */}
        {activeStory.chapters.map((ch, idx) => {
          const actionGif = characterGifs[idx % characterGifs.length];
          const initialLetter = ch.content.charAt(0);
          const restContent = ch.content.slice(1);

          return (
            <div 
              key={idx} 
              className="print-a4-page bg-[#faf6ed] text-slate-900 border-4 border-amber-300/80 rounded-2xl p-10 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-amber-300 text-sm font-nunito font-black text-amber-900">
                <span className="uppercase tracking-widest">{activeStory.title}</span>
                <span className="bg-amber-200 px-3 py-1 rounded-full">Chapter {idx + 1} • Page {idx + 2}</span>
              </div>

              {/* Title & Icon */}
              <div className="my-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-3xl shadow-md border-2 border-white">
                    {ch.icon}
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-amber-800 block">
                      {ch.chapterNumber}
                    </span>
                    <h2 className="font-display font-black text-3xl text-slate-900">
                      {ch.chapterTitle}
                    </h2>
                  </div>
                </div>

                {/* Chapter Scene Illustration */}
                <div className="w-full h-44 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md bg-slate-950">
                  <img
                    src={actionGif}
                    alt={ch.chapterTitle}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Narrative Text */}
                <div className="text-slate-900 font-nunito text-base leading-relaxed font-semibold">
                  <p>
                    <span className="float-left text-5xl font-display font-black text-amber-800 mr-3 leading-none p-2 bg-amber-100 rounded-xl border border-amber-300">
                      {initialLetter}
                    </span>
                    {restContent}
                  </p>
                </div>

                {/* Highlight Card */}
                {ch.highlightBox && (
                  <div className="p-4 rounded-2xl bg-amber-100/80 border-2 border-amber-300 space-y-1">
                    <span className="text-xs font-black uppercase text-amber-900 block">
                      📜 {ch.highlightBox.title}
                    </span>
                    <p className="text-sm text-slate-800 font-bold">
                      {ch.highlightBox.text}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-amber-300/60 flex items-center justify-between text-xs font-bold text-amber-900/70">
                <span>SkilliZee Chronicles • {className}</span>
                <span>Story Sprint Masterpiece</span>
              </div>
            </div>
          );
        })}

        {/* ── A4 PAGE 8: BACK COVER & OFFICIAL DIPLOMA CERTIFICATE ── */}
        <div className="print-a4-page bg-gradient-to-br from-amber-950 via-stone-900 to-amber-950 text-amber-100 border-8 border-amber-400 rounded-3xl p-10 flex flex-col justify-between text-center">
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-amber-400/30 border-2 border-amber-300 flex items-center justify-center text-4xl mx-auto">
              📜
            </div>
            <h2 className="font-display font-black text-4xl text-amber-200">
              Official Story Scribe Diploma
            </h2>
            <p className="text-sm font-nunito font-bold text-amber-300">
              SkilliZee Guild of Certified Storytellers
            </p>
          </div>

          {/* Moral Wisdom */}
          <div className="p-6 rounded-3xl bg-black/50 border-2 border-amber-400 max-w-lg mx-auto space-y-2">
            <span className="text-xs font-black uppercase text-amber-300 block">
              🌟 The Living Story Moral
            </span>
            <p className="text-lg font-display font-bold italic text-amber-100">
              "{activeStory.moral}"
            </p>
          </div>

          {/* Class Authors Roll */}
          <div className="p-5 rounded-2xl bg-amber-400/20 border border-amber-300/60 max-w-lg mx-auto">
            <span className="text-xs font-black uppercase text-amber-300 block mb-1">
              🏛️ Certified Authors Roll:
            </span>
            <p className="text-sm font-extrabold text-white">
              {participants.join(', ')} • {className}
            </p>
          </div>

          <div className="pt-4 border-t border-amber-400/40 text-xs font-bold text-amber-300">
            Official A4 Edition • SkilliZee Story Sprint Island
          </div>
        </div>

      </div>

    </div>
  );
};
