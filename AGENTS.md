# AGENTS.md - Skillizee POA Story Sprint Guidelines

## Overview
This repository contains a **Skillizee POA (Plan of Activity)** interactive web application for students. Follow the official `skillizee-poa-builder` skill patterns when developing features, adding chapters, and styling components.

---

## 1. Design & Typography Rules
- **Headings & Titles**: Always use `'Baloo 2', cursive` (`font-baloo` or `font-display`, weights: 600, 700, 800).
- **Body & Controls**: Always use `'Nunito', sans-serif` (`font-nunito` or `font-body`, weights: 400, 600, 700, 800).
- **Color Palette**: Curated playful pastels or vibrant gradients (`from-purple-500 to-pink-500`, `from-mint to-sky-pastel`, `from-orange-400 to-yellow-400`).

---

## 2. 3D Backgrounds & Camera Parallax
- The Three.js Canvas container MUST have `fixed inset-0 z-0 pointer-events-none`.
- Use a `MouseParallaxCamera` that interpolates towards normalized cursor positions using frame-based lerp (`camera.position.lerp()`).
- Use `<div className="absolute inset-0 bg-white/30 backdrop-blur-sm pointer-events-none z-0" />` as a frosted scrim behind UI cards to protect text legibility without blocking 3D scene animation.
- Add `<ContactShadows />`, subtle lighting, and soft fog to unify the scene.

---

## 3. Cards & Glassmorphism
- **FluidGlass Cards**: For hero or featured challenges, use magnetic mouse-following spring physics (`useSpring`, `useMotionValue`) with colored organic blur blobs and an inner glass container (`backdrop-blur-[40px] border-[3px] border-white/60`).
- **Section Cards**: `bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/60 p-8`.
- **Interactive Twist Cards**: Use 3D flip card animations (`preserve-3d`, `rotateY(180deg)`) for hints, examples, and twists.

---

## 4. Layout & Gamification Invariants
- **TopBar**:
  - Always include Home button, module/chapter breadcrumb, circular SVG progress indicator (`completed/total`), and full-screen button (`document.documentElement.requestFullscreen()`).
- **Sidebar**:
  - Collapsible module accordion with chapter status icons (`✅` done, `▶️` active, `🔒` locked).
- **Gamification**:
  - Brownie Points tracker with `canvas-confetti` celebrations.
  - Browser Web Speech API (`SpeechSynthesisUtterance`) for voice character simulations.
