# SkilliZee POA: STORY SPRINT
### *"Pass the Baton. Build the Story."*

A production-grade, interactive educational **Plan of Activity (POA)** designed for digital classroom environments, smartboards, touchscreens, and computer labs. Students collaborate in teams to construct an epic collective tale through structured baton passing, plot dilemmas, surprise twist wheels, tone vocalization challenges, and climax debates—culminating in a published **Digital Class Storybook** and personalized **Story Sprint Passports**.

---

## 🌟 Key Features & Pedagogical Architecture

### 1. The Digital Story Baton Mechanic
- **Ceremonial Handover**: Floating, soft-glowing magical baton indicating the active storyteller in command.
- **Handover Flow**: Clicking the baton or completing a story sprint leg prompts the handover modal with student/team selection, contribution logging, Web Audio magical ascending chime, and celebratory confetti.
- **TopBar Presence**: Persistent status indicator showing who holds the baton and the total handover tally.

### 2. Living 3D Parallax Story World
- Built with **Three.js** and **React Three Fiber** (`@react-three/fiber`, `@react-three/drei`).
- **Mouse Parallax Camera**: Smooth frame-based damping/LERP that moves the camera based on normalized cursor position.
- **Dynamic Realm Morphing**: When students change realms in Module 2 (Forest, Sky Citadels, Underwater, Castle, Space, Desert, Future City, Village), the 3D sky, fog, ground, and landmarks seamlessly adapt in real-time.
- **Performance Optimized**: Uses toon shaders and stylized geometric clouds running at a rock-solid 60 FPS on school touch displays with a frosted scrim overlay to guarantee text legibility.

### 3. Comprehensive 6-Module Curriculum
- **Module 1: Enter Story Sprint**
  - `Chapter 1.1`: Welcome & Baton Rules
  - `Chapter 1.2`: What Makes a Story? (8 Story Ingredients cards with interactive 3D Flip Card animations: Character, Setting, Problem, Goal, Event, Twist, Solution, Ending)
  - `Chapter 1.3`: Meet the Story Baton
  - `Chapter 1.4`: Warm-Up: What Next? (Interactive cliffhanger scenario)
- **Module 2: Create the Story**
  - `Chapter 2.1`: Choose the Hero (7 rich archetypes with special abilities, strengths, and quotes)
  - `Chapter 2.2`: Choose the World (8 dynamic living realms)
  - `Chapter 2.3`: The Important Object (8 glowing magical relics with special powers)
  - `Chapter 2.4`: Create the Problem (6 high-stakes dilemmas with Bloom's taxonomy class inquiries)
  - `Chapter 2.5`: Supporting Character (5 companions with helpful & complicating quirks)
- **Module 3: The Story Sprint**
  - `Chapter 3.1`: Baton Challenge (Active storyteller prompt & contribution builder)
  - `Chapter 3.2`: Story Builder Timeline (Visual chronology of all student contributions)
  - `Chapter 3.3`: Story Sort Sequencing (Pedagogical cause-and-effect drag/swap game)
  - `Chapter 3.4`: Spin the Twist (15-category animated surprise wheel with ticking sound)
  - `Chapter 3.5`: Choice Moments (A/B/C/D classroom voting with live percentages and winner locking)
  - `Chapter 3.6`: Tone Challenge (Auditory exploration with Web Speech API TTS simulation across 8 vocal styles)
- **Module 4: The Story Challenge**
  - `Chapter 4.1`: Climax & Solution (Effort vs. Risk vs. Creative Potential decision matrix)
- **Module 5: Grand Finale**
  - `Chapter 5.1`: Final Challenge Synthesis (Reviewing open story threads)
  - `Chapter 5.2`: Build the Ending (Peaceful, Celebration, Sequel, or Wisdom endings)
  - `Chapter 5.3`: Story Review & Polish (Final approval before publishing)
- **Module 6: Final Output**
  - `Chapter 6.1`: Digital Class Storybook (Interactive paginated book reader with voice narration and print/PDF mode)
  - `Chapter 6.2`: Story Sprint Passport (Individual student/team certificates with verified golden stamps and contribution logs)
  - `Chapter 6.3`: Achievements & Victory (10 meaningful classroom honors with dual confetti fanfare)

### 4. Audio & Voice Architecture
- **Web Audio API Synthesizer**: Custom sound generator creating tap pops, baton pass chimes, wheel ticks, voting pings, and victory fanfare without any external audio file dependencies.
- **Web Speech API**: Browser-native text-to-speech for reading story chapters and demonstrating vocal delivery.
- **Mute Control**: Persistent toggle in the TopBar for classroom volume management.

### 5. Teacher Command Deck (Teacher Mode)
- Accessible via the TopBar `Teacher Mode` button.
- **Sprint Timer**: 1m, 2m, 3m sprint timer with automatic sound alerts.
- **Bloom's Taxonomy Prompts**: Contextual classroom facilitation questions updated for every chapter.
- **Roster Management**: Dynamically add and organize student teams.
- **Reset Story**: Safe reset with confirmation dialog.

---

## 💻 Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8 with `@vitejs/plugin-react`
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **3D Engine**: Three.js + React Three Fiber (`@react-three/fiber`, `@react-three/drei`)
- **Motion & Animation**: Framer Motion
- **Icons**: Lucide React
- **Celebration FX**: Canvas Confetti
- **Typography**: `Baloo 2` (Headings & display) + `Nunito` (Body & controls)

---

## 🚀 Quickstart & Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open browser at
http://localhost:5173/

# 4. Build production bundle
npm run build
```

---

## 🎨 Design System & Accessibility
- **Card System**: FluidGlass magnetic spring cards with organic blur blobs + frosted backdrop scrims.
- **Touch-First**: Minimum 44px hit targets for interactive flat panels and classroom smartboards.
- **Colors**: Educational pastels (Lilac, Mint, Peach, Sky Pastel, Soft Amber).
- **Print Friendly**: Dedicated `@media print` rules for the Storybook and Student Passports.
