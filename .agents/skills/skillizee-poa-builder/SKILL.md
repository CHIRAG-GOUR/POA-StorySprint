---
name: skillizee-poa-builder
description: "Comprehensive blueprint and design patterns for building Skillizee POAs (Plan of Activity / Power of Art) with 3D parallax backgrounds, fluid glass cards, audio/TTS, and gamification."
risk: none
source: workspace
date_added: "2026-09-03"
---

# Skillizee POA (Plan of Activity) Builder

> Engineering architecture, 3D parallax backgrounds, fluid glassmorphism cards, gamification, and layout systems for Skillizee interactive learning sprint applications.

## When to Use
Use this skill when scaffolding, creating, or refactoring any **POA (Plan of Activity / Power of Art)** web application in the `Skillizee` ecosystem (e.g., `POA Story Sprint`, grade-level POAs, club activities).

---

## 1. Environment & Tech Stack

### Dependencies Blueprint
```json
{
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "three": "^0.183.2",
    "@react-three/fiber": "^9.5.0",
    "@react-three/drei": "^10.7.7",
    "framer-motion": "^12.38.0",
    "lucide-react": "^1.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.5.0",
    "canvas-confetti": "^1.9.4"
  },
  "devDependencies": {
    "vite": "^8.0.1",
    "@vitejs/plugin-react": "^6.0.1",
    "tailwindcss": "^4.2.2",
    "@tailwindcss/vite": "^4.2.2"
  }
}
```

### Typography Standard
In `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
```
- **Headings & Badges**: `'Baloo 2', cursive` (`font-baloo` or `font-display`) – rounded, playful, friendly.
- **Body & Controls**: `'Nunito', sans-serif` (`font-nunito` or `font-body`) – crisp, accessible reading copy.

---

## 2. 3D Parallax & Living World Backgrounds

### Core Rules for Background 3D:
1. **Pointer-Events Isolation**: The canvas wrapper MUST be `fixed inset-0 z-0 pointer-events-none`. This ensures all buttons, inputs, and UI cards on top are 100% clickable.
2. **Mouse-Follow Parallax Camera with LERP**:
   Smoothly interpolate the camera coordinates towards cursor offsets:
   ```tsx
   function MouseParallaxCamera() {
     const { camera } = useThree();
     const mouse = useRef({ x: 0, y: 0 });
     const target = useRef({ x: 0, y: 0 });

     useEffect(() => {
       const handleMouseMove = (e: MouseEvent) => {
         mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
         mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
       };
       window.addEventListener('mousemove', handleMouseMove);
       return () => window.removeEventListener('mousemove', handleMouseMove);
     }, []);

     useFrame(() => {
       target.current.x += (mouse.current.x - target.current.x) * 0.05;
       target.current.y += (mouse.current.y - target.current.y) * 0.05;
       camera.position.x = target.current.x * 3.5;
       camera.position.y = 10 - target.current.y * 2;
       camera.lookAt(0, 0, 0);
     });

     return null;
   }
   ```
3. **Cursor Interaction via Ground Raycasting**:
   Raycasting the cursor onto `new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)` allows 3D characters, mascots, or toys to turn, reach, or run towards the cursor.
4. **Frosted Glass Scrim**:
   Add `<div className="absolute inset-0 bg-white/30 backdrop-blur-sm pointer-events-none z-0" />` behind UI to soften high-contrast 3D meshes and preserve text contrast.

---

## 3. Cards & Glassmorphic Systems

### A. The Magnetic FluidGlass Card
From `POA Spoon`, creating a living, interactive glass container:
```tsx
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function FluidGlass({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-[2.5rem] p-1 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.15)] bg-slate-50/20 ${className}`}
    >
      {/* Animated Floating Color Blobs */}
      <motion.div
        className="absolute w-80 h-80 bg-pastel-green rounded-[40%_60%_70%_30%] mix-blend-multiply opacity-80 blur-[60px] pointer-events-none"
        style={{
          x: useTransform(smoothX, x => x * 0.8),
          y: useTransform(smoothY, y => y * 0.8),
          left: 'calc(50% - 10rem)',
          top: 'calc(50% - 10rem)',
        }}
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" } }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-pastel-orange rounded-[60%_40%_30%_70%] mix-blend-multiply opacity-70 blur-[70px] pointer-events-none"
        style={{
          x: useTransform(smoothX, x => x * -0.5),
          y: useTransform(smoothY, y => y * -0.5),
          left: 'calc(50% - 12rem)',
          top: 'calc(50% - 12rem)',
        }}
        animate={{ rotate: -360, scale: [1, 1.2, 1] }}
        transition={{ rotate: { duration: 25, repeat: Infinity, ease: "linear" } }}
      />

      {/* Glass Inner Surface */}
      <div className="relative h-full w-full bg-white/40 backdrop-blur-[40px] border-[3px] border-white/60 rounded-[2.2rem] z-10 p-8 shadow-[inset_0_0_20px_rgba(255,255,255,0.8)]">
        {children}
      </div>
    </div>
  );
}
```

### B. Standard Section Cards
- **Bright Theme**: `bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 p-8`.
- **Dark Theme**: `bg-[#0a0301]/60 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl`.

### C. 3D Flip / Twist Card
Flip cards with CSS 3D transforms (`perspective: 1000px`, `transform-style: preserve-3d`, `rotateY(180deg)`) for questions, challenges, and reveals.

---

## 4. Navigation & Layout Shell

### The ActivityLayout System
- **TopBar**:
  - Logo with gradient square (`bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl`).
  - Breadcrumb (`Module Title` > `Chapter Title`).
  - Circular SVG Progress Ring with gradient stroke (`#prog`).
  - Fullscreen Toggle button using `document.documentElement.requestFullscreen()`.
- **Sidebar**:
  - Collapsible module accordion.
  - Chapter buttons with status indicators (`✅` done, `▶️` active, `🔒` locked).
  - Hover translation animations (`whileHover={{ x: 4 }}`).
- **ChapterNav Footer**:
  - Back & Next buttons with dynamic label.
  - Linear progress fill (`width: (current/total) * 100%`).
- **AnimatePresence Transitions**:
  ```tsx
  <AnimatePresence mode="wait">
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.35 }}
    >
      <Outlet />
    </motion.div>
  </AnimatePresence>
  ```

---

## 5. Gamification, Audio, and Voice

### A. Brownie Points Tracker
- Global context (`ProgressContext`) managing `browniePoints` count and completed chapter IDs saved in `localStorage`.
- Celebrate point gains with `canvas-confetti`:
  ```ts
  confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
  ```

### B. Web Speech API Voice Simulation
Simulate characters or funny voices:
```ts
const speakText = (text: string, voiceType: 'robot' | 'baby' | 'giant') => {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  if (voiceType === 'robot') { utterance.pitch = 0.5; utterance.rate = 1.0; }
  else if (voiceType === 'baby') { utterance.pitch = 1.8; utterance.rate = 1.3; }
  else if (voiceType === 'giant') { utterance.pitch = 0.2; utterance.rate = 0.7; }
  window.speechSynthesis.speak(utterance);
};
```

---

## 6. Checklist for New POA Creation
- [ ] Initialize project with Vite + React + Tailwind + Three.js + Framer Motion.
- [ ] Add Google Fonts (`Baloo 2` + `Nunito`) in `index.html`.
- [ ] Implement `WorldBackground.jsx` with `pointer-events-none` Canvas and mouse parallax.
- [ ] Set up `ProgressContext` for tracking chapter completions, brownie points, and user inputs.
- [ ] Build `ActivityLayout` with TopBar (progress dial + fullscreen) and Sidebar.
- [ ] Create interactive chapter cards (`FluidGlass`, multi-step questions, twist cards).
- [ ] Add brownie point confetti and audio / TTS interactions.
