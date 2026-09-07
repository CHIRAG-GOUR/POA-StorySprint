import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Target, 
  Shield, 
  Sliders, 
  CheckCircle2, 
  Activity, 
  Wind, 
  Flame, 
  Cpu, 
  Crosshair,
  Waves,
  Orbit,
  Radio
} from 'lucide-react';
import { CharacterArchetype } from '../../types/story';

interface Level4GraphicsProps {
  hero: CharacterArchetype | null;
  onSuccess: () => void;
  externalTechnique?: string | null;
}

export const Level4Tactical3DSimulation: React.FC<Level4GraphicsProps> = ({ 
  hero, 
  onSuccess,
  externalTechnique
}) => {
  const heroId = hero?.id || 'hero-naruto';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroImgRef = useRef<HTMLImageElement | null>(null);

  // Active technique mode per hero
  const [activeTechnique, setActiveTechnique] = useState<string>(() => {
    if (heroId === 'hero-naruto') return 'rasengan';
    if (heroId === 'hero-goku') return 'kamehameha';
    if (heroId === 'hero-po') return 'dragon';
    return 'unibeam';
  });

  // Switch default technique when hero changes
  useEffect(() => {
    if (heroId === 'hero-naruto') setActiveTechnique('rasengan');
    else if (heroId === 'hero-goku') setActiveTechnique('kamehameha');
    else if (heroId === 'hero-po') setActiveTechnique('dragon');
    else if (heroId === 'hero-ironman') setActiveTechnique('unibeam');
  }, [heroId]);

  // Interactive Sliders for all characters
  // NARUTO
  const [dragonHeight, setDragonHeight] = useState(2.2); // 0.5 to 3.5m (Lifts dragon!)
  const [rasenScale, setRasenScale] = useState(1.4); // 0.8 to 2.5x
  const [chakraBalance, setChakraBalance] = useState(75); // 0 to 100%
  const [lightningPower, setLightningPower] = useState(80); // 10 to 100%

  // GOKU
  const [gokuElevation, setGokuElevation] = useState(1.8); // 0.5 to 3.5m
  const [beamWidth, setBeamWidth] = useState(1.6); // 0.5 to 3.0x
  const [kiCharge, setKiCharge] = useState(75); // 10 to 100%

  // PO
  const [dragonRise, setDragonRise] = useState(2.2); // 0.5 to 3.5m
  const [innerPeace, setInnerPeace] = useState(75); // 0 to 100%
  const [taiChiAngle, setTaiChiAngle] = useState(90); // 0 to 360 deg

  // IRON MAN
  const [arcPower, setArcPower] = useState(120); // 50 to 200%
  const [empRadius, setEmpRadius] = useState(3.2); // 1.0 to 5.0m
  const [beamAngle, setBeamAngle] = useState(0); // -40 to 40 deg

  const [isHarmonized, setIsHarmonized] = useState(false);
  const [hasNotifiedSuccess, setHasNotifiedSuccess] = useState(false);

  // Calculate live tuning score per character (0 to 100)
  let currentTuningScore = 0;
  if (heroId === 'hero-naruto') {
    currentTuningScore = activeTechnique === 'chidori'
      ? Math.min(100, Math.round((chakraBalance * 0.45) + ((dragonHeight / 3.5) * 35) + ((lightningPower / 100) * 20)))
      : Math.min(100, Math.round((chakraBalance * 0.45) + ((dragonHeight / 3.5) * 35) + (((rasenScale - 0.8) / 1.7) * 20)));
  } else if (heroId === 'hero-goku') {
    currentTuningScore = Math.min(100, Math.round((kiCharge * 0.45) + ((gokuElevation / 3.5) * 35) + ((beamWidth / 3.0) * 20)));
  } else if (heroId === 'hero-po') {
    currentTuningScore = Math.min(100, Math.round((innerPeace * 0.45) + ((dragonRise / 3.5) * 35) + (((taiChiAngle % 360) / 360) * 20)));
  } else {
    currentTuningScore = Math.min(100, Math.round((((arcPower - 50) / 150) * 45) + ((empRadius / 5.0) * 35) + ((1 - Math.abs(beamAngle) / 40) * 20)));
  }

  const isTuned = currentTuningScore >= 70;

  // Preload actual hero image
  useEffect(() => {
    const img = new Image();
    if (heroId === 'hero-naruto') {
      img.src = '/assets/hero_naruto.png';
    } else if (heroId === 'hero-goku') {
      img.src = '/assets/hero_goku.png';
    } else if (heroId === 'hero-po') {
      img.src = '/assets/hero_po.png';
    } else if (heroId === 'hero-ironman') {
      img.src = '/assets/hero_ironman.png';
    } else {
      img.src = hero?.image || '/assets/hero_naruto.png';
    }
    img.onload = () => {
      heroImgRef.current = img;
    };
  }, [heroId, hero]);

  // Sync external soundboard triggers
  useEffect(() => {
    if (externalTechnique) {
      if (heroId === 'hero-naruto') {
        if (externalTechnique === 'rasengan' || externalTechnique === 'dragon-roar') setActiveTechnique('rasengan');
        if (externalTechnique === 'chidori') setActiveTechnique('chidori');
      } else if (heroId === 'hero-goku') {
        if (externalTechnique === 'kamehameha' || externalTechnique === 'aura') setActiveTechnique('kamehameha');
        if (externalTechnique === 'instant-transmission') setActiveTechnique('transmission');
      } else if (heroId === 'hero-po') {
        if (externalTechnique === 'gong' || externalTechnique === 'flute') setActiveTechnique('dragon');
        if (externalTechnique === 'skadoosh') setActiveTechnique('skadoosh');
      } else if (heroId === 'hero-ironman') {
        if (externalTechnique === 'repulsor') setActiveTechnique('unibeam');
        if (externalTechnique === 'arc-reactor' || externalTechnique === 'jarvis-ping') setActiveTechnique('emp');
      }
    }
  }, [externalTechnique, heroId]);

  // Check resonance
  useEffect(() => {
    setIsHarmonized(isTuned);
    if (isTuned && !hasNotifiedSuccess) {
      setHasNotifiedSuccess(true);
      onSuccess();
    }
  }, [isTuned, hasNotifiedSuccess, onSuccess]);

  // ==========================================================================
  // 🎨 MASTER PROCEDURAL GRAPHICS RENDER LOOP FOR ALL 4 CHARACTERS
  // ==========================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;
    let smoothEmergence = (currentTuningScore / 100);

    const render = () => {
      time += 0.035;
      const width = canvas.width;
      const height = canvas.height;

      // Smooth interpolation of tuning emergence factor (0.0 to 1.0)
      const targetEmergence = currentTuningScore / 100;
      smoothEmergence += (targetEmergence - smoothEmergence) * 0.12;

      ctx.clearRect(0, 0, width, height);

      // ── 🌌 CINEMATIC HERO-SPECIFIC BACKGROUNDS ──
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (heroId === 'hero-naruto') {
        if (activeTechnique === 'chidori') {
          bgGrad.addColorStop(0, '#020617');
          bgGrad.addColorStop(0.35, '#1e1b4b');
          bgGrad.addColorStop(0.7, '#0f172a');
          bgGrad.addColorStop(1, '#0284c7');
        } else {
          bgGrad.addColorStop(0, '#020617');
          bgGrad.addColorStop(0.35, '#082f49');
          bgGrad.addColorStop(0.7, '#0369a1');
          bgGrad.addColorStop(1, '#0284c7');
        }
      } else if (heroId === 'hero-goku') {
        // High Gravity Planet / Capsule Corp Arena Sky
        bgGrad.addColorStop(0, '#030712');
        bgGrad.addColorStop(0.4, '#1e1b4b');
        bgGrad.addColorStop(0.8, '#311042');
        bgGrad.addColorStop(1, '#7c2d12');
      } else if (heroId === 'hero-po') {
        // Desolate Spirit Realm Wasteland: Dark Empty Brown & Deep Smoldering Orange Sky
        bgGrad.addColorStop(0, '#1c0d02');
        bgGrad.addColorStop(0.32, '#381604');
        bgGrad.addColorStop(0.62, '#5a2106');
        bgGrad.addColorStop(0.85, '#83320c');
        bgGrad.addColorStop(1, '#240e03');
      } else {
        // Stark Industries High-Tech Quantum Deck
        bgGrad.addColorStop(0, '#020617');
        bgGrad.addColorStop(0.4, '#0f172a');
        bgGrad.addColorStop(0.8, '#1e293b');
        bgGrad.addColorStop(1, '#082f49');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Ambient Mist & Environmental Particle Streaks
      if (heroId === 'hero-naruto') {
        ctx.strokeStyle = activeTechnique === 'chidori' ? 'rgba(254, 240, 138, 0.15)' : 'rgba(224, 242, 254, 0.2)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 12; i++) {
          const x = (i * 55 + (time * 25) % 55);
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x + Math.sin(time + i) * 8, height);
          ctx.stroke();
        }
      } else if (heroId === 'hero-goku') {
        // Floating Anti-Gravity Rubble Stones
        for (let r = 0; r < 9; r++) {
          const rx = (r * 68 + (time * 30) % 68);
          const ry = height * 0.85 - ((time * 35 + r * 35) % (height * 0.75));
          ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
          ctx.beginPath();
          ctx.arc(rx, ry, 3 + (r % 4), 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (heroId === 'hero-po') {
        // ── 🏯 1. PROCEDURAL FLYING BROKEN BUILDINGS IN BACKGROUND ──
        // A. Floating Broken Chinese Pagoda Eave (Upper Right Sky)
        const pagodaX = (width * 0.76) + Math.sin(time * 0.5) * 16;
        const pagodaY = (height * 0.22) + Math.cos(time * 0.4) * 10;
        const pagodaRot = -0.18 + Math.sin(time * 0.3) * 0.05;

        ctx.save();
        ctx.translate(pagodaX, pagodaY);
        ctx.rotate(pagodaRot);

        // Ambient dark orange rim glow
        ctx.shadowColor = 'rgba(234, 88, 12, 0.45)';
        ctx.shadowBlur = 18;

        // Main curved pagoda roof eave (dark burnt terracotta)
        ctx.fillStyle = '#451a03';
        ctx.strokeStyle = '#29180c';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-48, 14);
        ctx.quadraticCurveTo(-15, -18, 52, -12); // Sweeping curved ridge
        ctx.lineTo(58, -3);
        ctx.quadraticCurveTo(-5, -5, -44, 22);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Terracotta Roof Tile Ridges with dark orange rim highlights
        for (let t = -38; t <= 44; t += 8) {
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(t, -6);
          ctx.lineTo(t + 4, 15);
          ctx.stroke();

          // Orange edge rim light
          ctx.strokeStyle = '#ea580c';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(t, -6);
          ctx.lineTo(t + 2, -2);
          ctx.stroke();
        }

        // Shattered splintered wooden rafters protruding from broken end
        ctx.fillStyle = '#29180c';
        ctx.strokeStyle = '#180802';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(52, -12); ctx.lineTo(72, -17); ctx.lineTo(67, -9); ctx.lineTo(58, -3); ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(50, -1); ctx.lineTo(64, 4); ctx.lineTo(59, 10); ctx.lineTo(48, 6); ctx.closePath();
        ctx.fill(); ctx.stroke();

        // Weathered Stone Masonry Wall Section beneath eave
        ctx.fillStyle = '#3a1c0b';
        ctx.beginPath();
        ctx.moveTo(-34, 18); ctx.lineTo(36, 7); ctx.lineTo(30, 28); ctx.lineTo(-30, 36);
        ctx.closePath(); ctx.fill();

        // Mortar lines & stone cracks
        ctx.strokeStyle = '#180802';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-32, 26); ctx.lineTo(32, 16);
        ctx.moveTo(-12, 19); ctx.lineTo(-14, 27);
        ctx.moveTo(12, 17); ctx.lineTo(10, 27);
        // Fracture crack line
        ctx.moveTo(-22, 20); ctx.lineTo(-18, 30); ctx.lineTo(-14, 32);
        ctx.stroke();

        // Top sweeping edge bright orange rim highlight
        ctx.strokeStyle = 'rgba(251, 146, 60, 0.75)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-48, 14); ctx.quadraticCurveTo(-15, -18, 52, -12);
        ctx.stroke();
        ctx.restore();

        // B. Broken Ancient Stone Pillar / Paifang Beam (Mid-Left Sky)
        const pillarX = (width * 0.16) + Math.cos(time * 0.45) * 12;
        const pillarY = (height * 0.28) + Math.sin(time * 0.5) * 8;
        const pillarRot = 0.32 + Math.sin(time * 0.25) * 0.04;

        ctx.save();
        ctx.translate(pillarX, pillarY);
        ctx.rotate(pillarRot);

        // Pillar Body (Dark Weathered Stone)
        ctx.fillStyle = '#3a1f0f';
        ctx.strokeStyle = '#1a0903';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-12, -32); ctx.lineTo(12, -35); ctx.lineTo(14, 28); ctx.lineTo(-10, 34);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Shaded side of pillar
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.moveTo(1, -33); ctx.lineTo(12, -35); ctx.lineTo(14, 28); ctx.lineTo(3, 31);
        ctx.closePath(); ctx.fill();

        // Deep jagged stone fracture at top
        ctx.fillStyle = '#241005';
        ctx.beginPath();
        ctx.moveTo(-12, -32); ctx.lineTo(-3, -42); ctx.lineTo(5, -34); ctx.lineTo(12, -35); ctx.lineTo(3, -29);
        ctx.closePath(); ctx.fill();

        // Stone crack fissures etched across pillar
        ctx.strokeStyle = '#120501';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-8, -18); ctx.lineTo(-2, -8); ctx.lineTo(-6, 5); ctx.lineTo(3, 19);
        ctx.moveTo(3, -12); ctx.lineTo(9, -6);
        ctx.stroke();

        // Ancient carved relief band in dark orange
        ctx.strokeStyle = '#c2410c';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-11, -6); ctx.lineTo(13, -9);
        ctx.moveTo(-10, 14); ctx.lineTo(14, 11);
        ctx.stroke();

        // Orange rim highlight
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-12, -32); ctx.lineTo(-3, -42); ctx.lineTo(5, -34);
        ctx.stroke();
        ctx.restore();

        // C. Shattered Temple Arch Fragment (Center-Far Background)
        const archX = (width * 0.48) + Math.sin(time * 0.35 + 1) * 14;
        const archY = (height * 0.16) + Math.cos(time * 0.4 + 1) * 7;
        const archRot = -0.12 + Math.sin(time * 0.2) * 0.03;

        ctx.save();
        ctx.translate(archX, archY);
        ctx.rotate(archRot);
        ctx.fillStyle = '#311608';
        ctx.strokeStyle = '#180802';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 26, -Math.PI * 0.8, -Math.PI * 0.2);
        ctx.lineTo(20, -9);
        ctx.arc(0, 0, 16, -Math.PI * 0.2, -Math.PI * 0.8, true);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        // Masonry block seams
        for (let a = -0.75; a <= -0.25; a += 0.14) {
          const rad = a * Math.PI;
          ctx.strokeStyle = '#140501';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(Math.cos(rad) * 16, Math.sin(rad) * 16);
          ctx.lineTo(Math.cos(rad) * 26, Math.sin(rad) * 26);
          ctx.stroke();
        }
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 26, -Math.PI * 0.8, -Math.PI * 0.2);
        ctx.stroke();
        ctx.restore();

        // ── 🪨 2. FLYING TEXTURED STONES WITH FACETS & CRACKS ──
        const floatingRocks = [
          { bx: width * 0.09, by: height * 0.44, s: 22, rot: 0.25, sp: 0.6, p: 0 },
          { bx: width * 0.33, by: height * 0.18, s: 18, rot: -0.3, sp: 0.8, p: 1.4 },
          { bx: width * 0.60, by: height * 0.28, s: 30, rot: 0.18, sp: 0.5, p: 2.6 },
          { bx: width * 0.88, by: height * 0.38, s: 26, rot: -0.22, sp: 0.7, p: 3.9 },
          { bx: width * 0.44, by: height * 0.48, s: 20, rot: 0.35, sp: 0.9, p: 4.8 },
          { bx: width * 0.92, by: height * 0.68, s: 24, rot: -0.16, sp: 0.65, p: 1.1 },
          { bx: width * 0.06, by: height * 0.74, s: 22, rot: 0.3, sp: 0.75, p: 3.2 },
          { bx: width * 0.66, by: height * 0.66, s: 26, rot: -0.2, sp: 0.55, p: 2.0 },
        ];

        floatingRocks.forEach((rk) => {
          const rx = rk.bx + Math.sin(time * rk.sp + rk.p) * 14;
          const ry = rk.by + Math.cos(time * rk.sp * 0.85 + rk.p) * 10;
          const rRot = time * rk.rot + rk.p;
          const sz = rk.s;

          ctx.save();
          ctx.translate(rx, ry);
          ctx.rotate(rRot);

          // Base Stone Polygon (Multi-Faceted Dark Earthy Rock)
          ctx.fillStyle = '#3a1f0d';
          ctx.strokeStyle = '#180702';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-sz * 0.6, -sz * 0.2);
          ctx.lineTo(-sz * 0.3, -sz * 0.7);
          ctx.lineTo(sz * 0.4, -sz * 0.6);
          ctx.lineTo(sz * 0.7, -sz * 0.1);
          ctx.lineTo(sz * 0.5, sz * 0.6);
          ctx.lineTo(-sz * 0.2, sz * 0.7);
          ctx.lineTo(-sz * 0.7, sz * 0.3);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Shaded Lower Facet
          ctx.fillStyle = '#220e04';
          ctx.beginPath();
          ctx.moveTo(-sz * 0.6, -sz * 0.2);
          ctx.lineTo(0, 0);
          ctx.lineTo(sz * 0.5, sz * 0.6);
          ctx.lineTo(-sz * 0.2, sz * 0.7);
          ctx.lineTo(-sz * 0.7, sz * 0.3);
          ctx.closePath();
          ctx.fill();

          // Highlighted Upper Facet (Catching Dark Orange Sky Light)
          ctx.fillStyle = '#5c2d13';
          ctx.beginPath();
          ctx.moveTo(-sz * 0.6, -sz * 0.2);
          ctx.lineTo(-sz * 0.3, -sz * 0.7);
          ctx.lineTo(sz * 0.4, -sz * 0.6);
          ctx.lineTo(0, 0);
          ctx.closePath();
          ctx.fill();

          // Surface Crack Lines
          ctx.strokeStyle = '#120501';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(-sz * 0.3, -sz * 0.2); ctx.lineTo(-sz * 0.05, 0.1 * sz); ctx.lineTo(sz * 0.3, sz * 0.2);
          ctx.moveTo(0, -sz * 0.4); ctx.lineTo(sz * 0.2, -sz * 0.1);
          ctx.stroke();

          // Fiery Dark Orange Rim Highlight on Top Facet Edges
          ctx.strokeStyle = 'rgba(249, 115, 22, 0.8)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-sz * 0.6, -sz * 0.2);
          ctx.lineTo(-sz * 0.3, -sz * 0.7);
          ctx.lineTo(sz * 0.4, -sz * 0.6);
          ctx.lineTo(sz * 0.7, -sz * 0.1);
          ctx.stroke();

          ctx.restore();
        });

        // ── 🔥 3. RISING FIERY EMBERS & SPIRIT DUST MOTES ──
        for (let emb = 0; emb < 24; emb++) {
          const eLife = (time * 0.8 + emb * 0.45) % 3.5;
          const eProgress = eLife / 3.5;
          const ex = (emb * 26 + Math.sin(time * 2 + emb * 1.5) * 22 + (time * 15)) % width;
          const ey = height - (eProgress * height * 0.95);
          const eAlpha = Math.sin(eProgress * Math.PI) * 0.75;
          const eSize = 1.5 + (emb % 3);

          ctx.fillStyle = emb % 3 === 0
            ? `rgba(251, 146, 60, ${eAlpha})`
            : (emb % 3 === 1 ? `rgba(234, 88, 12, ${eAlpha})` : `rgba(250, 204, 21, ${eAlpha})`);
          ctx.beginPath();
          ctx.arc(ex, ey, eSize, 0, Math.PI * 2);
          ctx.fill();
        }

        // Ambient Dark Orange Mist Bands
        ctx.fillStyle = 'rgba(194, 65, 12, 0.08)';
        ctx.beginPath();
        ctx.ellipse(width * 0.5, height * 0.5, width * 0.6, 60, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Stark Holographic Digital Altitude Grid Lines
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 1.5;
        for (let g = 0; g < 6; g++) {
          const gy = g * 55 + (time * 15) % 55;
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(width, gy);
          ctx.stroke();
        }
      }

      // ======================================================================
      // 🌀 1. NARUTO: WOOD PLANK STAND, WATER DRAGON & ELECTRIC DRAGON
      // ======================================================================
      if (heroId === 'hero-naruto') {
        const riverY = height - 48;
        ctx.fillStyle = '#0369a1';
        ctx.beginPath();
        ctx.moveTo(0, riverY);
        for (let x = 0; x <= width; x += 12) {
          ctx.lineTo(x, riverY + Math.sin(time * 3 + x * 0.04) * 8);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, riverY - 2);
        for (let x = 0; x <= width; x += 12) {
          ctx.lineTo(x, riverY - 2 + Math.sin(time * 3 + x * 0.04) * 8);
        }
        ctx.stroke();

        const narutoX = width * 0.22;
        const plankY = riverY - 14;
        const balanceTilt = (1 - chakraBalance / 100) * Math.sin(time * 4) * 0.15;

        ctx.save();
        ctx.translate(narutoX, plankY);
        ctx.rotate(balanceTilt);

        // Solid floating wood plank
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.roundRect(-52, 0, 104, 16, [6, 6, 4, 4]);
        ctx.fill();

        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-42, 5); ctx.lineTo(42, 5);
        ctx.moveTo(-34, 10); ctx.lineTo(34, 10);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(0, 14, 62, 8, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = activeTechnique === 'chidori' ? '#fde047' : '#00f5ff';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = activeTechnique === 'chidori' ? '#fde047' : '#00f5ff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.ellipse(0, 2, 38, 8, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Draw Full-Body Naruto
        if (heroImgRef.current && heroImgRef.current.complete) {
          ctx.save();
          ctx.shadowColor = activeTechnique === 'chidori' ? '#fde047' : (isTuned ? '#00f5ff' : '#38bdf8');
          ctx.shadowBlur = isTuned ? 35 : 18;
          const hW = 88;
          const hH = 112;
          ctx.drawImage(heroImgRef.current, -hW / 2, -hH, hW, hH);
          ctx.restore();
        }
        ctx.restore();

        // ── 🐉 WATER DRAGON (Rasengan Mode) ──
        if (activeTechnique === 'rasengan') {
          const maxRiseY = riverY - (dragonHeight * 58) - (smoothEmergence * 40);
          const submergedY = riverY + 30;
          const currentDragonY = submergedY - (smoothEmergence * (submergedY - maxRiseY));
          const dragonBaseX = width * 0.72;

          if (smoothEmergence < 0.65) {
            ctx.save();
            ctx.shadowColor = '#00f5ff';
            ctx.shadowBlur = 30;
            ctx.fillStyle = 'rgba(0, 245, 255, 0.25)';
            ctx.beginPath();
            ctx.ellipse(dragonBaseX, riverY + 18, 75 + Math.sin(time * 3) * 15, 22, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          const bodySegments = 14;
          const spineCoords: { x: number; y: number }[] = [];

          ctx.save();
          const dragonAlpha = Math.max(0.15, Math.min(1.0, smoothEmergence * 1.3));
          ctx.globalAlpha = dragonAlpha;
          ctx.shadowColor = '#00f5ff';
          ctx.shadowBlur = isTuned ? 35 : 15;

          for (let i = 0; i < bodySegments; i++) {
            const segX = dragonBaseX - Math.sin(time * 2.2 + i * 0.55) * (35 + i * 9) - (i * 14);
            const segY = currentDragonY + (i * 20) + Math.cos(time * 2.2 + i * 0.5) * 12;
            spineCoords.push({ x: segX, y: segY });
          }

          ctx.strokeStyle = isTuned ? 'rgba(14, 165, 233, 0.95)' : 'rgba(14, 165, 233, 0.5)';
          ctx.lineWidth = 36 * Math.max(0.5, smoothEmergence);
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(spineCoords[0].x, spineCoords[0].y);
          for (let i = 1; i < spineCoords.length; i++) ctx.lineTo(spineCoords[i].x, spineCoords[i].y);
          ctx.stroke();

          ctx.strokeStyle = '#00f5ff';
          ctx.lineWidth = 16 * Math.max(0.4, smoothEmergence);
          ctx.beginPath();
          ctx.moveTo(spineCoords[0].x, spineCoords[0].y);
          for (let i = 1; i < spineCoords.length; i++) ctx.lineTo(spineCoords[i].x, spineCoords[i].y);
          ctx.stroke();

          for (let i = 1; i < spineCoords.length - 1; i += 2) {
            const pt = spineCoords[i];
            ctx.fillStyle = '#7dd3fc';
            ctx.beginPath();
            ctx.moveTo(pt.x + 10, pt.y - 10);
            ctx.lineTo(pt.x + 35 * smoothEmergence, pt.y - 28 * smoothEmergence);
            ctx.lineTo(pt.x + 8, pt.y + 8);
            ctx.closePath();
            ctx.fill();
          }

          const headX = spineCoords[0].x;
          const headY = spineCoords[0].y;
          const headRot = -0.25 + Math.sin(time * 2.2) * 0.12;

          ctx.save();
          ctx.translate(headX, headY);
          ctx.rotate(headRot);

          ctx.fillStyle = '#0284c7';
          ctx.beginPath();
          ctx.moveTo(-15, -12); ctx.bezierCurveTo(10, -25, 35, -30, 52, -18); ctx.lineTo(56, -14);
          ctx.bezierCurveTo(45, -5, 25, 2, 0, 4); ctx.closePath(); ctx.fill();

          ctx.beginPath();
          ctx.moveTo(4, 4); ctx.bezierCurveTo(20, 14, 35, 28, 48, 26);
          ctx.bezierCurveTo(32, 16, 15, 10, -8, 8); ctx.closePath(); ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.moveTo(28, -5); ctx.lineTo(31, 8); ctx.lineTo(25, -5); ctx.fill();
          ctx.beginPath(); ctx.moveTo(40, -15); ctx.lineTo(44, -3); ctx.lineTo(36, -15); ctx.fill();

          ctx.fillStyle = '#38bdf8';
          ctx.beginPath(); ctx.moveTo(-10, -20); ctx.bezierCurveTo(-25, -42, -35, -55, -42, -58);
          ctx.bezierCurveTo(-30, -38, -20, -28, -12, -20); ctx.closePath(); ctx.fill();

          ctx.strokeStyle = '#00f5ff';
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(42, -14);
          ctx.bezierCurveTo(75, -25 + Math.sin(time * 4) * 25, 110, 10 + Math.cos(time * 3) * 35, 135, -15);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#00f5ff';
          ctx.shadowBlur = isTuned ? 28 : 12;
          ctx.beginPath(); ctx.ellipse(14, -14, 8, 4, -0.2, 0, Math.PI * 2); ctx.fill();

          if (isTuned) {
            ctx.strokeStyle = 'rgba(0, 245, 255, 0.85)';
            ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.moveTo(14, -14); ctx.lineTo(-40, -25); ctx.stroke();
          }
          ctx.restore();
          ctx.restore();

          // Swirling Rasengan
          const rX = narutoX + 35;
          const rY = plankY - 50;
          const rRadius = rasenScale * 26;

          ctx.save();
          ctx.translate(rX, rY);
          const rasenGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, rRadius * 1.6);
          rasenGrad.addColorStop(0, '#ffffff'); rasenGrad.addColorStop(0.35, '#00f5ff');
          rasenGrad.addColorStop(0.7, 'rgba(14, 165, 233, 0.5)'); rasenGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
          ctx.fillStyle = rasenGrad; ctx.beginPath(); ctx.arc(0, 0, rRadius * 1.6, 0, Math.PI * 2); ctx.fill();

          ctx.lineWidth = 2.5;
          for (let i = 0; i < 28; i++) {
            const angle = (i * Math.PI) / 14 + (time * 9);
            ctx.strokeStyle = i % 2 === 0 ? '#ffffff' : '#67e8f9';
            ctx.beginPath(); ctx.arc(0, 0, rRadius * (0.35 + (i % 5) * 0.14), angle, angle + Math.PI / 1.7); ctx.stroke();
          }

          if (smoothEmergence >= 0.65) {
            ctx.strokeStyle = 'rgba(0, 245, 255, 0.85)';
            ctx.lineWidth = 4.5;
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(130, -60, headX - rX, headY - rY); ctx.stroke();
          }
          ctx.restore();

          if (isTuned) {
            ctx.save();
            ctx.fillStyle = 'rgba(8, 47, 73, 0.85)'; ctx.strokeStyle = '#00f5ff'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.roundRect(width * 0.52, 18, width * 0.44, 32, [8, 8, 8, 8]); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 12px monospace';
            ctx.fillText('🐉 WATER DRAGON AWAKENED!', width * 0.54, 39);
            ctx.restore();
          }
        }

        // ── ⚡ ELECTRIC DRAGON (Chidori Mode) ──
        if (activeTechnique === 'chidori') {
          const maxRiseY = riverY - (dragonHeight * 58) - (smoothEmergence * 40);
          const submergedY = riverY + 30;
          const currentDragonY = submergedY - (smoothEmergence * (submergedY - maxRiseY));
          const eDragonBaseX = width * 0.72;

          const eSegments = 14;
          const eSpineCoords: { x: number; y: number }[] = [];

          ctx.save();
          const eDragonAlpha = Math.max(0.15, Math.min(1.0, smoothEmergence * 1.3));
          ctx.globalAlpha = eDragonAlpha;
          ctx.shadowColor = '#fde047';
          ctx.shadowBlur = isTuned ? 35 : 15;

          for (let i = 0; i < eSegments; i++) {
            const segX = eDragonBaseX - Math.sin(time * 3 + i * 0.6) * (35 + i * 9) - (i * 14);
            const segY = currentDragonY + (i * 20) + Math.cos(time * 3 + i * 0.5) * 14;
            eSpineCoords.push({ x: segX, y: segY });
          }

          ctx.strokeStyle = isTuned ? 'rgba(250, 204, 21, 0.95)' : 'rgba(250, 204, 21, 0.5)';
          ctx.lineWidth = 34 * Math.max(0.5, smoothEmergence);
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(eSpineCoords[0].x, eSpineCoords[0].y);
          for (let i = 1; i < eSpineCoords.length; i++) ctx.lineTo(eSpineCoords[i].x, eSpineCoords[i].y);
          ctx.stroke();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 14 * Math.max(0.4, smoothEmergence);
          ctx.beginPath();
          ctx.moveTo(eSpineCoords[0].x, eSpineCoords[0].y);
          for (let i = 1; i < eSpineCoords.length; i++) ctx.lineTo(eSpineCoords[i].x, eSpineCoords[i].y);
          ctx.stroke();

          const eHeadX = eSpineCoords[0].x;
          const eHeadY = eSpineCoords[0].y;
          const eHeadRot = -0.25 + Math.sin(time * 3) * 0.15;

          ctx.save();
          ctx.translate(eHeadX, eHeadY);
          ctx.rotate(eHeadRot);

          ctx.fillStyle = '#eab308';
          ctx.beginPath();
          ctx.moveTo(-15, -12); ctx.bezierCurveTo(10, -25, 35, -30, 54, -18); ctx.lineTo(58, -14);
          ctx.bezierCurveTo(45, -5, 25, 2, 0, 4); ctx.closePath(); ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#facc15'; ctx.shadowBlur = isTuned ? 30 : 14;
          ctx.beginPath(); ctx.ellipse(14, -14, 8, 4, -0.2, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          ctx.restore();

          // Chidori Arcs
          const chidoriX = narutoX + 32;
          const chidoriY = plankY - 45;
          ctx.save();
          ctx.translate(chidoriX, chidoriY);
          ctx.fillStyle = '#ffffff'; ctx.shadowColor = '#00f5ff'; ctx.shadowBlur = 35;
          ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          for (let b = 0; b < 10; b++) {
            const baseAngle = (b * Math.PI) / 5 + Math.sin(time * 18 + b) * 0.35;
            let curX = 0; let curY = 0;
            ctx.beginPath(); ctx.moveTo(0, 0);
            const steps = 7;
            const dist = (lightningPower / 100) * 105 + 30;
            for (let s = 1; s <= steps; s++) {
              const segDist = (dist / steps) * s;
              const jitter = (Math.random() - 0.5) * 26;
              curX = Math.cos(baseAngle) * segDist + jitter;
              curY = Math.sin(baseAngle) * segDist + jitter;
              ctx.lineTo(curX, curY);
            }
            ctx.stroke();
          }

          if (smoothEmergence >= 0.65) {
            ctx.strokeStyle = '#fde047'; ctx.lineWidth = 4.5;
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(120, -50, eHeadX - chidoriX, eHeadY - chidoriY); ctx.stroke();
          }
          ctx.restore();

          if (isTuned) {
            ctx.save();
            ctx.fillStyle = 'rgba(30, 27, 75, 0.85)'; ctx.strokeStyle = '#fde047'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.roundRect(width * 0.48, 18, width * 0.48, 32, [8, 8, 8, 8]); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 12px monospace';
            ctx.fillText('⚡ KIRIN ELECTRIC DRAGON SUMMONED!', width * 0.50, 39);
            ctx.restore();
          }
        }
      }

      // ======================================================================
      // 💥 2. GOKU: FLYING NIMBUS, 10x KAMEHAMEHA & SUPER SPIRIT BOMB
      // ======================================================================
      else if (heroId === 'hero-goku') {
        const gokuX = width * 0.24;
        const gokuY = height * 0.68 - (gokuElevation * 28);

        // 1. FLYING NIMBUS CLOUD (KINTO'UN) & LEVITATION SHOCKWAVES
        ctx.save();
        ctx.translate(gokuX, gokuY + 6);
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 25;
        ctx.fillStyle = '#fde047'; // Golden Nimbus Cloud
        
        // Dynamic Cloud Puffs
        ctx.beginPath();
        ctx.arc(-24, 0, 18 + Math.sin(time * 4) * 2, 0, Math.PI * 2);
        ctx.arc(0, -6, 22 + Math.cos(time * 3) * 2, 0, Math.PI * 2);
        ctx.arc(24, 0, 18 + Math.sin(time * 4 + 1) * 2, 0, Math.PI * 2);
        ctx.arc(-12, 10, 15, 0, Math.PI * 2);
        ctx.arc(12, 10, 15, 0, Math.PI * 2);
        ctx.fill();

        // Speed trailing wisps
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.7)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-35, 5); ctx.lineTo(-65 - Math.sin(time * 6) * 12, 5);
        ctx.moveTo(-25, 14); ctx.lineTo(-50 - Math.cos(time * 5) * 10, 14);
        ctx.stroke();
        ctx.restore();

        // 2. ROARING SUPER SAIYAN FLAME AURA & KI LIGHTNING
        ctx.save();
        ctx.translate(gokuX, gokuY);
        const auraAlpha = Math.max(0.3, smoothEmergence * 0.85);
        ctx.shadowColor = activeTechnique === 'transmission' ? '#38bdf8' : '#facc15';
        ctx.shadowBlur = isTuned ? 45 : 20;

        // Golden Super Saiyan Flame Spires
        ctx.fillStyle = activeTechnique === 'transmission' ? `rgba(56, 189, 248, ${auraAlpha})` : `rgba(250, 204, 21, ${auraAlpha})`;
        ctx.beginPath();
        ctx.moveTo(-45, 0);
        ctx.quadraticCurveTo(-60 + Math.sin(time * 8) * 12, -45, -30, -95 + Math.cos(time * 7) * 10);
        ctx.quadraticCurveTo(0, -115 + Math.sin(time * 9) * 12, 30, -95 + Math.sin(time * 7) * 10);
        ctx.quadraticCurveTo(60 + Math.cos(time * 8) * 12, -45, 45, 0);
        ctx.closePath();
        ctx.fill();

        // Crackling Ki Lightning Spikes jumping around Goku
        if (smoothEmergence >= 0.5) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          for (let k = 0; k < 4; k++) {
            const kAngle = k * (Math.PI / 2) + time * 3;
            const kDist = 42 + Math.random() * 20;
            ctx.beginPath();
            ctx.moveTo(Math.cos(kAngle) * 20, Math.sin(kAngle) * 20 - 40);
            ctx.lineTo(Math.cos(kAngle) * kDist, Math.sin(kAngle) * kDist - 40);
            ctx.stroke();
          }
        }

        // Draw Full-Body Goku Standing / Levitating on Nimbus
        if (heroImgRef.current && heroImgRef.current.complete) {
          const gW = 92;
          const gH = 118;
          ctx.drawImage(heroImgRef.current, -gW / 2, -gH, gW, gH);
        }
        ctx.restore();

        // ── MODE 1: 10x SUPER SAIYAN KAMEHAMEHA SURGE ──
        if (activeTechnique === 'kamehameha') {
          const beamStartX = gokuX + 38;
          const beamStartY = gokuY - 48;
          const bRadius = beamWidth * 26 * Math.max(0.4, smoothEmergence);

          ctx.save();
          // Cupped Hand Charge Core
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = isTuned ? 40 : 20;
          ctx.beginPath();
          ctx.arc(beamStartX, beamStartY, bRadius * 0.9, 0, Math.PI * 2);
          ctx.fill();

          // Multi-layer Massive Kamehameha Forward Beam
          const beamGrad = ctx.createLinearGradient(beamStartX, beamStartY - bRadius, beamStartX, beamStartY + bRadius);
          beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0.1)');
          beamGrad.addColorStop(0.25, '#38bdf8');
          beamGrad.addColorStop(0.5, '#ffffff');
          beamGrad.addColorStop(0.75, '#38bdf8');
          beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0.1)');

          ctx.fillStyle = beamGrad;
          ctx.fillRect(beamStartX, beamStartY - bRadius, width - beamStartX - 25, bRadius * 2);

          // Swirling Spiral Energy Ribbons around the beam
          ctx.lineWidth = 3;
          for (let i = 0; i < 6; i++) {
            const rx = beamStartX + (i * 65 + (time * 160) % 65);
            ctx.strokeStyle = i % 2 === 0 ? '#ffffff' : '#fde047';
            ctx.beginPath();
            ctx.ellipse(rx, beamStartY, 16, bRadius * 1.25, 0, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Target Nebula & Shattering Barrier Impact at screen right
          const impactX = width - 35;
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 35;
          ctx.beginPath();
          ctx.arc(impactX, beamStartY, bRadius * 1.4, 0, Math.PI * 2);
          ctx.fill();

          // Exploding barrier shards
          for (let s = 0; s < 8; s++) {
            const sAngle = (s * Math.PI) / 4 + time * 4;
            const sDist = bRadius * 1.5 + Math.sin(time * 8 + s) * 15;
            ctx.fillStyle = '#67e8f9';
            ctx.beginPath();
            ctx.arc(impactX + Math.cos(sAngle) * sDist, beamStartY + Math.sin(sAngle) * sDist, 3.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          // On-Canvas Kamehameha Banner when tuned!
          if (isTuned) {
            ctx.save();
            ctx.fillStyle = 'rgba(67, 20, 7, 0.85)';
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(width * 0.48, 18, width * 0.48, 32, [8, 8, 8, 8]);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px monospace';
            ctx.fillText('💥 10x KAMEHAMEHA FULL SURGE!', width * 0.50, 39);
            ctx.restore();
          }
        }

        // ── MODE 2: SUPER SPIRIT BOMB (GENKI DAMA) & INSTANT TRANSMISSION ──
        if (activeTechnique === 'transmission') {
          const sphereX = gokuX + 110;
          const sphereY = height * 0.32;
          const sphereRadius = 38 + (smoothEmergence * 32);

          ctx.save();
          // Pulsing Celestial Spirit Bomb Sphere
          const spiritGrad = ctx.createRadialGradient(sphereX, sphereY, 8, sphereX, sphereY, sphereRadius * 1.3);
          spiritGrad.addColorStop(0, '#ffffff');
          spiritGrad.addColorStop(0.4, '#38bdf8');
          spiritGrad.addColorStop(0.8, '#0284c7');
          spiritGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');

          ctx.fillStyle = spiritGrad;
          ctx.shadowColor = '#00f5ff';
          ctx.shadowBlur = isTuned ? 50 : 25;
          ctx.beginPath();
          ctx.arc(sphereX, sphereY, sphereRadius * 1.3, 0, Math.PI * 2);
          ctx.fill();

          // 24 Blue Cosmic Spirit Particles flying from all screen edges into the Spirit Bomb!
          ctx.fillStyle = '#ffffff';
          for (let p = 0; p < 24; p++) {
            const pAngle = (p * Math.PI) / 12 + (time * 2);
            const pDist = sphereRadius * (1.6 + ((time * 3 + p * 0.5) % 2.5));
            const px = sphereX + Math.cos(pAngle) * pDist;
            const py = sphereY + Math.sin(pAngle) * pDist;
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Connecting Ki Conduit from Goku's raised hands to Spirit Bomb
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(gokuX, gokuY - 95);
          ctx.lineTo(sphereX, sphereY + sphereRadius * 0.8);
          ctx.stroke();
          ctx.restore();

          // On-Canvas Spirit Bomb Banner
          if (isTuned) {
            ctx.save();
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(width * 0.46, 18, width * 0.50, 32, [8, 8, 8, 8]);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px monospace';
            ctx.fillText('🌐 SUPER SPIRIT BOMB CONVERGENCE!', width * 0.48, 39);
            ctx.restore();
          }
        }
      }

      // ======================================================================
      // 🐉 3. PO: OOGWAY'S JADE STAFF, GOLDEN CHI DRAGON & JADE PORTAL
      // ======================================================================
      else if (heroId === 'hero-po') {
        const poX = width * 0.25;
        const poY = height * 0.68;

        // Shattered Ancient Rock Plateau Ground for Po & Oogway Staff
        ctx.save();
        ctx.translate(poX - 25, poY + 14);
        
        // Base Rock Silhouette
        ctx.fillStyle = '#2c1407';
        ctx.strokeStyle = '#180702';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-90, 0);
        ctx.lineTo(-75, -6);
        ctx.lineTo(60, -4);
        ctx.lineTo(85, 4);
        ctx.lineTo(70, 18);
        ctx.lineTo(-65, 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Shaded rock underside
        ctx.fillStyle = '#160802';
        ctx.beginPath();
        ctx.moveTo(-90, 0);
        ctx.lineTo(-65, 20);
        ctx.lineTo(70, 18);
        ctx.lineTo(85, 4);
        ctx.lineTo(55, 6);
        ctx.lineTo(-60, 8);
        ctx.closePath();
        ctx.fill();

        // Glowing orange/amber chi fissures in rock cracks
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.65)';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(-55, -2); ctx.lineTo(-30, 6); ctx.lineTo(10, 2); ctx.lineTo(45, 8);
        ctx.moveTo(-15, 6); ctx.lineTo(-10, 14);
        ctx.moveTo(25, 4); ctx.lineTo(30, 12);
        ctx.stroke();

        // Orange rim highlight on top stone ledge
        ctx.strokeStyle = 'rgba(251, 146, 60, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(-90, 0); ctx.lineTo(-75, -6); ctx.lineTo(60, -4); ctx.lineTo(85, 4);
        ctx.stroke();
        ctx.restore();

        // 1. OOGWAY'S JADE STAFF (Left side, next to Po)
        const staffX = poX - 52;
        const staffBaseY = poY + 10;
        const staffTopY = poY - 130;
        const staffRotation = (taiChiAngle * Math.PI) / 180;

        ctx.save();
        ctx.translate(staffX, staffBaseY);

        // Jade Staff Shaft - ornate carved bamboo
        const staffGrad = ctx.createLinearGradient(0, 0, 0, staffTopY - staffBaseY);
        staffGrad.addColorStop(0, '#065f46');
        staffGrad.addColorStop(0.3, '#10b981');
        staffGrad.addColorStop(0.5, '#34d399');
        staffGrad.addColorStop(0.7, '#10b981');
        staffGrad.addColorStop(1, '#065f46');
        ctx.strokeStyle = staffGrad;
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = isTuned ? 22 : 8;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, staffTopY - staffBaseY);
        ctx.stroke();

        // Gold ornamental bands on the shaft
        for (let b = 0; b < 4; b++) {
          const bandY = (staffTopY - staffBaseY) * (0.2 + b * 0.22);
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(-6, bandY);
          ctx.lineTo(6, bandY);
          ctx.stroke();
        }

        // Jade Orb Cradle (forked top)
        const cradleY = staffTopY - staffBaseY;
        ctx.strokeStyle = '#065f46';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(-2, cradleY + 12);
        ctx.bezierCurveTo(-14, cradleY - 2, -14, cradleY - 18, -6, cradleY - 22);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(2, cradleY + 12);
        ctx.bezierCurveTo(14, cradleY - 2, 14, cradleY - 18, 6, cradleY - 22);
        ctx.stroke();

        // Glowing Jade Orb at the top of the staff
        ctx.save();
        ctx.translate(0, cradleY - 12);
        ctx.rotate(staffRotation + time * 0.8);
        const orbGlow = ctx.createRadialGradient(0, 0, 2, 0, 0, 16);
        orbGlow.addColorStop(0, '#ffffff');
        orbGlow.addColorStop(0.3, '#6ee7b7');
        orbGlow.addColorStop(0.6, '#10b981');
        orbGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = orbGlow;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = isTuned ? 40 : 16;
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();

        // Yin-Yang symbol inside the orb
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 9, 0, Math.PI);
        ctx.fill();
        ctx.fillStyle = '#064e3b';
        ctx.beginPath();
        ctx.arc(0, 0, 9, Math.PI, Math.PI * 2);
        ctx.fill();
        // Small dots
        ctx.fillStyle = '#064e3b';
        ctx.beginPath(); ctx.arc(-3, 0, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(3, 0, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // Chi particles floating up from staff
        for (let p = 0; p < 6; p++) {
          const pTime = (time * 1.2 + p * 1.1) % 3;
          const pY = cradleY - 12 - pTime * 22;
          const pX = Math.sin(time * 2 + p * 1.5) * 14;
          const pAlpha = Math.max(0, 1 - pTime / 3);
          ctx.fillStyle = `rgba(110, 231, 183, ${pAlpha * 0.7})`;
          ctx.beginPath();
          ctx.arc(pX, pY, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // 2. DRAW PO USING LOADED IMAGE (transparent background panda)
        ctx.save();
        ctx.translate(poX, poY);

        // Ground shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(0, 12, 42, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // ─── GOLDEN CHI AURA (grows with tuning) ───
        const auraIntensity = smoothEmergence;
        if (auraIntensity > 0.15) {
          // Outer golden radial aura
          const auraGrad = ctx.createRadialGradient(0, -50, 15, 0, -50, 60 + auraIntensity * 50);
          auraGrad.addColorStop(0, `rgba(250, 204, 21, ${auraIntensity * 0.6})`);
          auraGrad.addColorStop(0.4, `rgba(234, 179, 8, ${auraIntensity * 0.35})`);
          auraGrad.addColorStop(0.7, `rgba(253, 224, 71, ${auraIntensity * 0.15})`);
          auraGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(0, -50, 60 + auraIntensity * 50, 0, Math.PI * 2);
          ctx.fill();

          // Swirling golden chi wisps around Po
          for (let w = 0; w < 8; w++) {
            const wAngle = time * 2.2 + w * (Math.PI / 4);
            const wDist = 40 + Math.sin(time * 1.5 + w) * 18;
            const wx = Math.cos(wAngle) * wDist;
            const wy = -50 + Math.sin(wAngle) * wDist * 0.6;
            const wAlpha = auraIntensity * 0.6 * (0.5 + Math.sin(time * 3 + w) * 0.5);
            ctx.fillStyle = `rgba(253, 224, 71, ${wAlpha})`;
            ctx.beginPath();
            ctx.arc(wx, wy, 3 + auraIntensity * 3, 0, Math.PI * 2);
            ctx.fill();
          }

          // Rising golden sparks
          for (let s = 0; s < 6; s++) {
            const sparkTime = (time * 1.8 + s * 0.9) % 2.5;
            const sparkY = -50 - sparkTime * 40;
            const sparkX = Math.sin(time * 2.5 + s * 1.3) * (20 + auraIntensity * 15);
            const sparkAlpha = Math.max(0, 1 - sparkTime / 2.5) * auraIntensity;
            ctx.fillStyle = `rgba(255, 255, 255, ${sparkAlpha * 0.8})`;
            ctx.beginPath();
            ctx.arc(sparkX, sparkY, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // ─── PO CHARACTER IMAGE ───
        if (heroImgRef.current && heroImgRef.current.complete) {
          ctx.shadowColor = isTuned ? '#facc15' : '#10b981';
          ctx.shadowBlur = isTuned ? 30 : 12;
          const pW = 120;
          const pH = 140;
          ctx.drawImage(heroImgRef.current, -pW / 2, -pH + 10, pW, pH);
        }

        ctx.restore();

        // ── MODE 1: GRAND GOLDEN CELESTIAL CHI DRAGON (appears when golden aura is strong) ──
        if (activeTechnique === 'dragon' && smoothEmergence > 0.4) {
          const maxRiseY = height * 0.22;
          const submergedY = height * 0.72;
          const dragonFactor = (smoothEmergence - 0.4) / 0.6; // 0 to 1 range after threshold
          const currentDragonY = submergedY - (dragonFactor * (submergedY - maxRiseY));
          const dragonBaseX = width * 0.74;

          // Serpentine Golden Dragon Spine
          const bodySegments = 14;
          const spineCoords: { x: number; y: number }[] = [];

          ctx.save();
          const dragonAlpha = Math.max(0.1, Math.min(1.0, dragonFactor * 1.5));
          ctx.globalAlpha = dragonAlpha;
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = isTuned ? 40 : 18;

          for (let i = 0; i < bodySegments; i++) {
            const segX = dragonBaseX - Math.sin(time * 2.5 + i * 0.55) * (38 + i * 8) - (i * 12);
            const segY = currentDragonY + (i * 18) + Math.cos(time * 2.5 + i * 0.5) * 12;
            spineCoords.push({ x: segX, y: segY });
          }

          // Outer Radiant Gold Dragon Body
          ctx.strokeStyle = isTuned ? 'rgba(250, 204, 21, 0.95)' : 'rgba(250, 204, 21, 0.45)';
          ctx.lineWidth = 36 * Math.max(0.5, dragonFactor);
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(spineCoords[0].x, spineCoords[0].y);
          for (let i = 1; i < spineCoords.length; i++) ctx.lineTo(spineCoords[i].x, spineCoords[i].y);
          ctx.stroke();

          // White-Gold Inner Chi Core
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 15 * Math.max(0.4, dragonFactor);
          ctx.beginPath();
          ctx.moveTo(spineCoords[0].x, spineCoords[0].y);
          for (let i = 1; i < spineCoords.length; i++) ctx.lineTo(spineCoords[i].x, spineCoords[i].y);
          ctx.stroke();

          // Golden Spinal Flame Spines
          for (let i = 1; i < spineCoords.length - 1; i += 2) {
            const pt = spineCoords[i];
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.moveTo(pt.x + 10, pt.y - 10);
            ctx.lineTo(pt.x + 36 * dragonFactor, pt.y - 26 * dragonFactor);
            ctx.lineTo(pt.x + 8, pt.y + 8);
            ctx.closePath();
            ctx.fill();
          }

          // GOLDEN DRAGON HEAD
          const headX = spineCoords[0].x;
          const headY = spineCoords[0].y;
          const headRot = -0.22 + Math.sin(time * 2.5) * 0.12;

          ctx.save();
          ctx.translate(headX, headY);
          ctx.rotate(headRot);

          ctx.fillStyle = '#eab308';
          ctx.beginPath();
          ctx.moveTo(-15, -12); ctx.bezierCurveTo(10, -25, 35, -30, 52, -18); ctx.lineTo(56, -14);
          ctx.bezierCurveTo(45, -5, 25, 2, 0, 4); ctx.closePath(); ctx.fill();

          // Glowing Golden Chi Pearl in Jaws
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#facc15'; ctx.shadowBlur = 25;
          ctx.beginPath(); ctx.arc(28, 4, 10, 0, Math.PI * 2); ctx.fill();

          // Golden Whiskers
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(42, -14);
          ctx.bezierCurveTo(75, -25 + Math.sin(time * 5) * 25, 110, 10 + Math.cos(time * 4) * 35, 135, -15);
          ctx.stroke();

          // Glowing Piercing Golden Eye
          ctx.fillStyle = '#ffffff'; ctx.shadowColor = '#facc15'; ctx.shadowBlur = isTuned ? 30 : 12;
          ctx.beginPath(); ctx.ellipse(14, -14, 8, 4, -0.2, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          ctx.restore();

          // Golden Chi Connection Ribbon from Po to Dragon
          if (dragonFactor >= 0.5) {
            ctx.save();
            ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
            ctx.lineWidth = 4;
            ctx.shadowColor = '#facc15'; ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.moveTo(poX + 35, poY - 50);
            ctx.quadraticCurveTo(width * 0.48, height * 0.35, headX, headY);
            ctx.stroke();
            ctx.restore();
          }

          if (isTuned) {
            ctx.save();
            ctx.fillStyle = 'rgba(6, 78, 59, 0.85)';
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(width * 0.44, 18, width * 0.52, 32, [8, 8, 8, 8]);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px monospace';
            ctx.fillText('🐉 GOLDEN CELESTIAL CHI DRAGON AWAKENED!', width * 0.46, 39);
            ctx.restore();
          }
        }

        // ── MODE 2: OOGWAY'S JADE STAFF PORTAL ACTIVATION ──
        if (activeTechnique === 'skadoosh') {
          const portalCX = width * 0.62;
          const portalCY = height * 0.42;
          const portalProgress = smoothEmergence;
          const staffSpin = time * 3.5 * (0.5 + portalProgress * 1.5);

          // Staff energy beam connecting to portal center
          ctx.save();
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.3 + portalProgress * 0.6})`;
          ctx.lineWidth = 3 + portalProgress * 4;
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.moveTo(staffX, staffBaseY + (staffTopY - staffBaseY) - 12);
          ctx.quadraticCurveTo(width * 0.42, height * 0.2, portalCX, portalCY);
          ctx.stroke();
          ctx.restore();

          // Swirling Portal Vortex
          ctx.save();
          ctx.translate(portalCX, portalCY);

          // Outer portal ring glow
          const portalRadius = 40 + portalProgress * 55;
          for (let ring = 0; ring < 4; ring++) {
            const rRad = portalRadius - ring * 10;
            if (rRad <= 0) continue;
            const rAlpha = (0.15 + portalProgress * 0.25) * (1 - ring * 0.2);
            ctx.strokeStyle = ring % 2 === 0
              ? `rgba(16, 185, 129, ${rAlpha})`
              : `rgba(250, 204, 21, ${rAlpha})`;
            ctx.lineWidth = 4 - ring;
            ctx.beginPath();
            ctx.arc(0, 0, rRad, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Swirling vortex arms
          for (let arm = 0; arm < 6; arm++) {
            const armAngle = staffSpin + (arm * Math.PI * 2) / 6;
            const armLen = portalRadius * 0.9;
            ctx.save();
            ctx.rotate(armAngle);
            const spiralGrad = ctx.createLinearGradient(0, 0, armLen, 0);
            spiralGrad.addColorStop(0, `rgba(255, 255, 255, ${0.7 * portalProgress})`);
            spiralGrad.addColorStop(0.5, `rgba(52, 211, 153, ${0.5 * portalProgress})`);
            spiralGrad.addColorStop(1, `rgba(16, 185, 129, 0)`);
            ctx.strokeStyle = spiralGrad;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(8, 0);
            ctx.quadraticCurveTo(armLen * 0.5, -12 * portalProgress, armLen, -6);
            ctx.stroke();
            ctx.restore();
          }

          // Central portal eye - bright jade core
          const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 18 * portalProgress);
          coreGrad.addColorStop(0, '#ffffff');
          coreGrad.addColorStop(0.3, '#6ee7b7');
          coreGrad.addColorStop(0.6, '#10b981');
          coreGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
          ctx.fillStyle = coreGrad;
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = isTuned ? 50 : 20;
          ctx.beginPath();
          ctx.arc(0, 0, 18 * portalProgress, 0, Math.PI * 2);
          ctx.fill();

          // Floating spirit wisps emerging from portal
          if (portalProgress > 0.5) {
            for (let w = 0; w < 8; w++) {
              const wAngle = time * 1.5 + w * 0.8;
              const wDist = portalRadius * 0.3 + (time * 20 + w * 18) % (portalRadius * 1.2);
              const wAlpha = Math.max(0, 1 - wDist / (portalRadius * 1.4)) * portalProgress;
              const wx = Math.cos(wAngle) * wDist;
              const wy = Math.sin(wAngle) * wDist;
              ctx.fillStyle = `rgba(250, 204, 21, ${wAlpha * 0.6})`;
              ctx.beginPath();
              ctx.arc(wx, wy, 3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          ctx.restore();

          if (isTuned) {
            ctx.save();
            ctx.fillStyle = 'rgba(6, 78, 59, 0.85)';
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(width * 0.48, 18, width * 0.48, 32, [8, 8, 8, 8]);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px monospace';
            ctx.fillText('✨ JADE STAFF SPIRIT PORTAL OPENED!', width * 0.50, 39);
            ctx.restore();
          }
        }
      }

      // ======================================================================
      // 🦾 4. IRON MAN: HOLOGRAPHIC LAUNCH PLATFORM, UNI-BEAM & EMP SHIELD
      // ======================================================================
      else {
        const starkX = width * 0.24;
        const starkY = height * 0.68;

        // 1. STARK HOLOGRAPHIC HEX-GRID LAUNCH DECK
        ctx.save();
        ctx.translate(starkX, starkY + 12);
        
        // Titanium Base Deck
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(0, 0, 72, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        // Glowing Blue Circuit Traces & Arc Core Ring
        ctx.strokeStyle = '#00f5ff';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00f5ff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.ellipse(0, 0, 60, 16, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Repulsor boot landing pads
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.ellipse(-18, 0, 10, 4, 0, 0, Math.PI * 2);
        ctx.ellipse(18, 0, 10, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 2. DRAW FULL-BODY IRON MAN
        if (heroImgRef.current && heroImgRef.current.complete) {
          ctx.save();
          ctx.translate(starkX, starkY);
          ctx.shadowColor = '#00f5ff';
          ctx.shadowBlur = isTuned ? 35 : 18;
          const iW = 86;
          const iH = 118;
          ctx.drawImage(heroImgRef.current, -iW / 2, -iH, iW, iH);
          ctx.restore();
        }

        // Precise palm repulsor coordinates (raised right/front hand)
        const uX = starkX + 21;
        const uY = starkY - 96;

        // ── MODE 1: MAXIMUM OUTPUT REPULSOR HAND BEAM & TARGET BLAST ──
        if (activeTechnique === 'unibeam') {
          // 3 Stark Tactical Target Drones with Hover Movement
          const drones = [
            { id: 1, label: 'TARGET_01', baseX: width * 0.70, baseY: height * 0.24, phase: 0 },
            { id: 2, label: 'TARGET_02', baseX: width * 0.80, baseY: height * 0.50, phase: 1.2 },
            { id: 3, label: 'TARGET_03', baseX: width * 0.70, baseY: height * 0.76, phase: 2.4 },
          ];

          const dronePositions = drones.map(d => ({
            ...d,
            x: d.baseX,
            y: d.baseY + Math.sin(time * 3 + d.phase) * 8
          }));

          // Compute aiming trajectory line from hand
          const angleRad = (beamAngle * Math.PI) / 180;
          const targetZoneX = width * 0.75;
          const aimY = uY + Math.tan(angleRad) * (targetZoneX - uX);

          // Find closest drone to the aim trajectory
          let lockedDroneIdx = 0;
          let minDiff = 99999;
          dronePositions.forEach((dp, idx) => {
            const rayYAtDrone = uY + Math.tan(angleRad) * (dp.x - uX);
            const diff = Math.abs(rayYAtDrone - dp.y);
            if (diff < minDiff) {
              minDiff = diff;
              lockedDroneIdx = idx;
            }
          });

          const isLocked = minDiff < 45 || isTuned;
          const targetDrone = isLocked ? dronePositions[lockedDroneIdx] : null;
          const hitX = targetDrone ? targetDrone.x : (uX + Math.cos(angleRad) * (width - 40 - uX));
          const hitY = targetDrone ? targetDrone.y : (uY + Math.sin(angleRad) * (width - 40 - uX));

          const beamFiring = smoothEmergence >= 0.35; // Don't shoot until threshold is reached!

          ctx.save();

          // ── A. DRAW TARGET DRONES FIRST ──
          dronePositions.forEach((dp, idx) => {
            const isThisTarget = targetDrone && targetDrone.id === dp.id && beamFiring;
            const isAimTarget = lockedDroneIdx === idx;

            ctx.save();
            // Drone Shake on Direct Hit
            const shakeX = isThisTarget ? (Math.sin(time * 35) * 6 * smoothEmergence) : 0;
            const shakeY = isThisTarget ? (Math.cos(time * 30) * 5 * smoothEmergence) : 0;
            ctx.translate(dp.x + shakeX, dp.y + shakeY);

            // Drone Hull
            ctx.fillStyle = isThisTarget ? '#7f1d1d' : '#1e293b';
            ctx.strokeStyle = isThisTarget ? '#ef4444' : (isAimTarget ? '#38bdf8' : '#64748b');
            ctx.lineWidth = isThisTarget ? 3 : 2;
            ctx.beginPath();
            ctx.roundRect(-18, -12, 36, 24, [4, 4, 4, 4]);
            ctx.fill();
            ctx.stroke();

            // Drone Optical Core
            ctx.fillStyle = isThisTarget ? '#ffffff' : '#ef4444';
            ctx.shadowColor = isThisTarget ? '#ef4444' : '#f87171';
            ctx.shadowBlur = isThisTarget ? 20 : 6;
            ctx.beginPath();
            ctx.arc(0, 0, isThisTarget ? 6 : 4, 0, Math.PI * 2);
            ctx.fill();

            // HUD Lock Reticle & Brackets
            ctx.strokeStyle = isThisTarget ? '#ef4444' : (isAimTarget ? '#00f5ff' : '#475569');
            ctx.lineWidth = isThisTarget ? 2.5 : 1.5;
            ctx.strokeRect(-24, -18, 48, 36);

            // Reticle corner ticks
            const cLen = 6;
            ctx.beginPath();
            ctx.moveTo(-28, -18); ctx.lineTo(-28 + cLen, -18);
            ctx.moveTo(28 - cLen, -18); ctx.lineTo(28, -18);
            ctx.moveTo(-28, 18); ctx.lineTo(-28 + cLen, 18);
            ctx.moveTo(28 - cLen, 18); ctx.lineTo(28, 18);
            ctx.stroke();

            // Target Text Tag
            ctx.fillStyle = isThisTarget ? '#fca5a5' : (isAimTarget ? '#38bdf8' : '#94a3b8');
            ctx.font = 'bold 9px monospace';
            const statusLabel = isThisTarget ? '💥 IMPACT OVERLOAD' : (isAimTarget ? '🎯 LOCKED' : 'STANDBY');
            ctx.fillText(`${dp.label} [${statusLabel}]`, -34, -22);

            // Electric Arcs over Drone if Hit
            if (isThisTarget) {
              ctx.strokeStyle = '#67e8f9';
              ctx.lineWidth = 1.5;
              for (let a = 0; a < 4; a++) {
                const aAng = time * 8 + a * (Math.PI / 2);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(aAng) * 22, Math.sin(aAng) * 16);
                ctx.stroke();
              }
            }
            ctx.restore();
          });

          // ── B. HAND REPULSOR NODE & CHARGE PARTICLES ──
          // Glowing Palm Node
          const palmGlowRadius = 10 + smoothEmergence * 14;
          const palmGrad = ctx.createRadialGradient(uX, uY, 2, uX, uY, palmGlowRadius);
          palmGrad.addColorStop(0, '#ffffff');
          palmGrad.addColorStop(0.4, '#00f5ff');
          palmGrad.addColorStop(0.8, 'rgba(14, 165, 233, 0.5)');
          palmGrad.addColorStop(1, 'rgba(0, 245, 255, 0)');
          ctx.fillStyle = palmGrad;
          ctx.shadowColor = '#00f5ff';
          ctx.shadowBlur = isTuned ? 45 : 20;
          ctx.beginPath();
          ctx.arc(uX, uY, palmGlowRadius, 0, Math.PI * 2);
          ctx.fill();

          // Charging / Swirling Energy Particles into Hand (Before & during firing)
          for (let p = 0; p < 8; p++) {
            const pAng = time * 4 + p * (Math.PI / 4);
            const pDist = 18 + Math.sin(time * 3 + p) * 10;
            const px = uX + Math.cos(pAng) * pDist;
            const py = uY + Math.sin(pAng) * pDist;
            ctx.fillStyle = p % 2 === 0 ? '#ffffff' : '#38bdf8';
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fill();
          }

          // ── C. CHARGING / AIMING STATE (Before firing threshold) ──
          if (!beamFiring) {
            // Holographic Thin Aiming Laser Guide Line
            ctx.save();
            ctx.strokeStyle = 'rgba(0, 245, 255, 0.45)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([6, 6]);
            ctx.beginPath();
            ctx.moveTo(uX, uY);
            ctx.lineTo(hitX, hitY);
            ctx.stroke();

            // Aiming Laser Dot at target
            ctx.setLineDash([]);
            ctx.fillStyle = '#ef4444';
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(hitX, hitY, 4, 0, Math.PI * 2);
            ctx.fill();

            // Calibration Arc at hand
            ctx.strokeStyle = '#00f5ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(uX, uY, 14, angleRad - 0.4, angleRad + 0.4);
            ctx.stroke();
            ctx.restore();
          }

          // ── D. PROPER SHOOTING BEAM & BLAST (When threshold is reached!) ──
          else {
            const beamPower = Math.min(1.0, (smoothEmergence - 0.35) / 0.65);
            const bThickness = (10 + beamPower * 14);

            // 1. Broad Outer Atmospheric Ionization Glow
            ctx.strokeStyle = 'rgba(0, 245, 255, 0.35)';
            ctx.lineWidth = bThickness * 2.8;
            ctx.shadowColor = '#00f5ff';
            ctx.shadowBlur = isTuned ? 45 : 25;
            ctx.beginPath();
            ctx.moveTo(uX, uY);
            ctx.lineTo(hitX, hitY);
            ctx.stroke();

            // 2. High-Voltage Electric Body Stream
            ctx.strokeStyle = '#00f5ff';
            ctx.lineWidth = bThickness * 1.5;
            ctx.beginPath();
            ctx.moveTo(uX, uY);
            ctx.lineTo(hitX, hitY);
            ctx.stroke();

            // 3. Ultra-Dense Laser Core
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = bThickness * 0.7;
            ctx.beginPath();
            ctx.moveTo(uX, uY);
            ctx.lineTo(hitX, hitY);
            ctx.stroke();

            // 4. Spiraling Lightning Arc Tendrils around the Beam
            const beamDist = Math.hypot(hitX - uX, hitY - uY);
            const beamSegments = Math.floor(beamDist / 20);
            ctx.strokeStyle = '#e0f2fe';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let s = 0; s <= beamSegments; s++) {
              const t = s / beamSegments;
              const bx = uX + t * (hitX - uX);
              const by = uY + t * (hitY - uY);
              const perpX = -Math.sin(angleRad);
              const perpY = Math.cos(angleRad);
              const offset = Math.sin(time * 12 + s * 0.9) * (8 * beamPower);
              const px = bx + perpX * offset;
              const py = by + perpY * offset;
              if (s === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.stroke();

            // 5. Spaced Rotating Magnetic Confinement Rings
            const ringCount = Math.floor(beamDist / 60);
            for (let m = 1; m < ringCount; m++) {
              const t = m / ringCount;
              const mx = uX + t * (hitX - uX);
              const my = uY + t * (hitY - uY);
              ctx.strokeStyle = m % 2 === 0 ? '#67e8f9' : '#ffffff';
              ctx.lineWidth = 2.5;
              ctx.beginPath();
              ctx.ellipse(mx, my, 8, 22 * beamPower, angleRad, 0, Math.PI * 2);
              ctx.stroke();
            }

            // 6. Forward-Surging Energy Packets down the Beam
            for (let pulse = 0; pulse < 3; pulse++) {
              const pulseT = ((time * 2.5 + pulse * 0.33) % 1);
              const px = uX + pulseT * (hitX - uX);
              const py = uY + pulseT * (hitY - uY);
              ctx.fillStyle = '#ffffff';
              ctx.shadowColor = '#00f5ff';
              ctx.shadowBlur = 15;
              ctx.beginPath();
              ctx.arc(px, py, 6 * beamPower, 0, Math.PI * 2);
              ctx.fill();
            }

            // ── 💥 MASSIVE IMPACT BLAST & EXPLOSION AT HIT POINT ──
            // 1. Blinding Center Flash
            const blastRadius = 26 + beamPower * 32;
            const blastGrad = ctx.createRadialGradient(hitX, hitY, 3, hitX, hitY, blastRadius);
            blastGrad.addColorStop(0, '#ffffff');
            blastGrad.addColorStop(0.3, '#38bdf8');
            blastGrad.addColorStop(0.6, '#00f5ff');
            blastGrad.addColorStop(0.85, 'rgba(245, 158, 11, 0.6)');
            blastGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
            ctx.fillStyle = blastGrad;
            ctx.shadowColor = '#00f5ff';
            ctx.shadowBlur = 40;
            ctx.beginPath();
            ctx.arc(hitX, hitY, blastRadius, 0, Math.PI * 2);
            ctx.fill();

            // 2. Expanding Concentric Shockwave Rings
            for (let sw = 0; sw < 3; sw++) {
              const swPhase = (time * 30 + sw * 22) % 55;
              const swAlpha = Math.max(0, 1 - swPhase / 55) * beamPower;
              ctx.strokeStyle = sw % 2 === 0 ? `rgba(0, 245, 255, ${swAlpha})` : `rgba(254, 240, 138, ${swAlpha})`;
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.arc(hitX, hitY, swPhase + 10, 0, Math.PI * 2);
              ctx.stroke();
            }

            // 3. Exploding Spark Particles & Plasma Debris
            const sparkCount = 18;
            for (let sp = 0; sp < sparkCount; sp++) {
              const spAngle = (sp * Math.PI * 2) / sparkCount + (time * 3);
              const spDist = 18 + ((time * 65 + sp * 14) % (42 * beamPower));
              const spAlpha = Math.max(0, 1 - spDist / 45);
              const sx = hitX + Math.cos(spAngle) * spDist;
              const sy = hitY + Math.sin(spAngle) * spDist;
              ctx.fillStyle = sp % 3 === 0 ? `rgba(255, 255, 255, ${spAlpha})` : (sp % 3 === 1 ? `rgba(0, 245, 255, ${spAlpha})` : `rgba(251, 191, 36, ${spAlpha})`);
              ctx.beginPath();
              ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          ctx.restore();

          if (isTuned) {
            ctx.save();
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.strokeStyle = '#00f5ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(width * 0.44, 18, width * 0.52, 32, [8, 8, 8, 8]);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px monospace';
            ctx.fillText('🦾 MAXIMUM OUTPUT REPULSOR BEAM & BLAST!', width * 0.46, 39);
            ctx.restore();
          }
        }

        // ── MODE 2: HOLOGRAPHIC ARC EMP SHIELD & MICRO-DRONES ──
        if (activeTechnique === 'emp') {
          const shieldX = starkX + 15;
          const shieldY = starkY - 50;
          const shieldR = empRadius * 24 * Math.max(0.5, smoothEmergence);

          ctx.save();
          // Geodesic Hexagonal EMP Shield Dome
          ctx.strokeStyle = 'rgba(0, 245, 255, 0.85)';
          ctx.lineWidth = 3;
          ctx.shadowColor = '#00f5ff';
          ctx.shadowBlur = 25;
          ctx.fillStyle = 'rgba(14, 165, 233, 0.18)';
          ctx.beginPath();
          ctx.arc(shieldX, shieldY, shieldR, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Hexagonal Mesh Lines inside Dome
          for (let h = 0; h < 6; h++) {
            const hAngle = h * (Math.PI / 3) + time;
            ctx.beginPath();
            ctx.moveTo(shieldX, shieldY);
            ctx.lineTo(shieldX + Math.cos(hAngle) * shieldR, shieldY + Math.sin(hAngle) * shieldR);
            ctx.stroke();
          }

          // 4 Orbiting Stark Micro-Defense Drones
          for (let od = 0; od < 4; od++) {
            const odAngle = od * (Math.PI / 2) + (time * 2);
            const odX = shieldX + Math.cos(odAngle) * (shieldR + 32);
            const odY = shieldY + Math.sin(odAngle) * (shieldR * 0.65);

            ctx.fillStyle = '#0284c7';
            ctx.strokeStyle = '#00f5ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(odX, odY, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Laser Sight Target Beam from Micro-Drone
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(odX, odY);
            ctx.lineTo(width - 40, height * 0.3 + od * 45);
            ctx.stroke();
          }
          ctx.restore();

          if (isTuned) {
            ctx.save();
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            ctx.strokeStyle = '#00f5ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(width * 0.44, 18, width * 0.52, 32, [8, 8, 8, 8]);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px monospace';
            ctx.fillText('🛡️ STARK HOLOGRAPHIC DEFENSE ARRAY!', width * 0.46, 39);
            ctx.restore();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    heroId,
    activeTechnique,
    dragonHeight,
    rasenScale,
    chakraBalance,
    lightningPower,
    currentTuningScore,
    isTuned,
    beamWidth,
    gokuElevation,
    kiCharge,
    dragonRise,
    innerPeace,
    taiChiAngle,
    arcPower,
    empRadius,
    beamAngle,
  ]);

  // Auto-Tune assist for all characters
  const handleAutoTune = () => {
    if (heroId === 'hero-naruto') {
      setChakraBalance(90);
      setDragonHeight(2.8);
      if (activeTechnique === 'chidori') {
        setLightningPower(90);
      } else {
        setRasenScale(2.0);
      }
    } else if (heroId === 'hero-goku') {
      setKiCharge(95);
      setGokuElevation(2.6);
      setBeamWidth(2.4);
    } else if (heroId === 'hero-po') {
      setInnerPeace(90);
      setDragonRise(2.8);
      setTaiChiAngle(270);
    } else if (heroId === 'hero-ironman') {
      setArcPower(160);
      setEmpRadius(4.2);
      setBeamAngle(0);
    }
  };

  // Technique Buttons Config for All 4 Characters
  const techniquesList = {
    'hero-naruto': [
      { id: 'rasengan', label: 'Rasengan Vortex (Water Dragon)', icon: Wind, color: 'from-cyan-500 to-blue-600' },
      { id: 'chidori', label: 'Lightning Blade (Electric Dragon)', icon: Zap, color: 'from-amber-500 to-yellow-600' },
    ],
    'hero-goku': [
      { id: 'kamehameha', label: '10x Kamehameha Wave', icon: Flame, color: 'from-blue-500 to-indigo-600' },
      { id: 'transmission', label: 'Super Spirit Bomb & Instant Warp', icon: Orbit, color: 'from-amber-500 to-yellow-600' },
    ],
    'hero-po': [
      { id: 'dragon', label: 'Golden Celestial Chi Dragon', icon: Target, color: 'from-amber-500 to-yellow-600' },
      { id: 'skadoosh', label: "Oogway's Jade Staff Portal", icon: Orbit, color: 'from-emerald-500 to-teal-600' },
    ],
    'hero-ironman': [
      { id: 'unibeam', label: 'Repulsor Uni-Beam Maximum Output', icon: Zap, color: 'from-red-500 to-orange-600' },
      { id: 'emp', label: 'Arc EMP Shield & Micro-Drones', icon: Cpu, color: 'from-cyan-500 to-blue-600' },
    ],
  }[heroId] || [
    { id: 'rasengan', label: 'Vortex Blast', icon: Wind, color: 'from-cyan-500 to-blue-600' },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950 rounded-3xl p-6 text-white border-3 border-cyan-400 shadow-2xl space-y-5 flex flex-col justify-between">
      
      {/* Header & Technique Tabs */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-nunito font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            Tactical Action Studio
          </span>
          {isHarmonized ? (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-nunito font-black text-xs flex items-center gap-1 shadow-md animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Resonance Locked! (Full Power Manifested)
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-nunito font-bold text-xs flex items-center gap-1">
              <Waves className="w-3 h-3 animate-spin" />
              Tune Controls to Awaken Power ({currentTuningScore}%)
            </span>
          )}
        </div>

        <h3 className="font-display font-black text-2xl text-white mt-1">
          {heroId === 'hero-naruto' && (activeTechnique === 'chidori' ? 'Lightning Blade & Electric Kirin Dragon' : 'Rasengan Vortex & Water Dragon Ascent')}
          {heroId === 'hero-goku' && (activeTechnique === 'transmission' ? 'Super Spirit Bomb & Instant Transmission' : 'Super Saiyan 10x Kamehameha Surge')}
          {heroId === 'hero-po' && (activeTechnique === 'skadoosh' ? "Oogway's Jade Staff Portal Activation" : 'Grand Golden Celestial Chi Dragon')}
          {heroId === 'hero-ironman' && (activeTechnique === 'emp' ? 'Stark Holographic EMP Shield & Drones' : 'Maximum Output Repulsor Hand Beam & Blast')}
        </h3>

        {/* 2 Technique Switcher Tabs */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          {techniquesList.map((t) => {
            const Icon = t.icon;
            const isActive = activeTechnique === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTechnique(t.id)}
                className={`py-2 px-3 rounded-xl font-display font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  isActive
                    ? `bg-gradient-to-r ${t.color} text-white ring-2 ring-white scale-102`
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main High-Fidelity Animated Canvas Graphics Viewport */}
      <div className="relative h-80 rounded-2xl bg-black border-2 border-cyan-500/50 overflow-hidden shadow-2xl flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={320}
          className="w-full h-full object-cover"
        />

        {/* Real-time Dynamic Telemetry HUD */}
        <div className="absolute top-2 left-3 text-[10px] font-mono text-cyan-300 pointer-events-none bg-slate-900/90 px-2.5 py-1 rounded-md border border-cyan-500/40 flex items-center gap-2">
          <span>MODE: {activeTechnique.toUpperCase()}</span>
          <span>|</span>
          <span className={isHarmonized ? 'text-emerald-400 font-bold' : 'text-amber-300'}>
            TUNING: {currentTuningScore}%
          </span>
        </div>

        {/* Status Badge Overlay */}
        <div className="absolute bottom-2 right-3 text-[10px] font-mono pointer-events-none bg-slate-950/85 px-2.5 py-1 rounded-md border border-cyan-500/30">
          {isTuned ? (
            <span className="text-emerald-300 font-bold">
              ✨ MANIFESTATION: 100% MAXIMUM RESONANCE
            </span>
          ) : (
            <span className="text-amber-400">
              ⚡ CALIBRATING HARMONICS (Tune Sliders & Power)
            </span>
          )}
        </div>
      </div>

      {/* Dynamic Interactive Sliders */}
      <div className="space-y-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
        <div className="flex items-center justify-between">
          <span className="text-xs font-nunito font-bold text-slate-200 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-300" />
            Active Transformation Sliders:
          </span>
          <button
            type="button"
            onClick={handleAutoTune}
            className="px-2.5 py-1 rounded-lg bg-cyan-500/30 hover:bg-cyan-500/50 border border-cyan-400 text-cyan-200 font-nunito font-bold text-[11px] transition-all cursor-pointer"
          >
            ⚡ Auto-Tune Resonance
          </button>
        </div>

        {/* NARUTO CONTROLS */}
        {heroId === 'hero-naruto' && (
          <>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-nunito font-bold">
                <span className="text-cyan-300 font-black">
                  {activeTechnique === 'chidori' ? 'Electric Dragon Kirin Ascent' : 'Water Dragon Vortex Ascent'}
                </span>
                <span className="text-cyan-200">{dragonHeight.toFixed(1)} m</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={3.5}
                step={0.1}
                value={dragonHeight}
                onChange={(e) => setDragonHeight(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-nunito font-bold">
                <span className="text-slate-300">
                  {activeTechnique === 'chidori' ? 'Lightning Discharge Voltage' : 'Rasengan Vortex Swirl Scale'}
                </span>
                <span className="text-cyan-300">
                  {activeTechnique === 'chidori' ? `${lightningPower}%` : `${rasenScale.toFixed(1)}x`}
                </span>
              </div>
              <input
                type="range"
                min={activeTechnique === 'chidori' ? 10 : 0.8}
                max={activeTechnique === 'chidori' ? 100 : 2.5}
                step={activeTechnique === 'chidori' ? 1 : 0.1}
                value={activeTechnique === 'chidori' ? lightningPower : rasenScale}
                onChange={(e) => activeTechnique === 'chidori' ? setLightningPower(Number(e.target.value)) : setRasenScale(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-nunito font-bold">
                <span className="text-slate-300">Foot-Chakra Wood Plank Balance</span>
                <span className="text-cyan-300">{chakraBalance}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={chakraBalance}
                onChange={(e) => setChakraBalance(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </>
        )}

        {/* GOKU CONTROLS */}
        {heroId === 'hero-goku' && (
          <>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-nunito font-bold">
                <span className="text-amber-300 font-black">Saiyan Nimbus & Gravity Lift</span>
                <span className="text-amber-200">{gokuElevation.toFixed(1)} m</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={3.5}
                step={0.1}
                value={gokuElevation}
                onChange={(e) => setGokuElevation(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-nunito font-bold">
                <span className="text-slate-300">
                  {activeTechnique === 'transmission' ? 'Spirit Bomb Cosmic Energy Gathering' : 'Kamehameha Blast Beam Width'}
                </span>
                <span className="text-amber-300">{beamWidth.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={3.0}
                step={0.1}
                value={beamWidth}
                onChange={(e) => setBeamWidth(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-nunito font-bold">
                <span className="text-slate-300">Super Saiyan Ki Output</span>
                <span className="text-amber-300">{kiCharge}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={1}
                value={kiCharge}
                onChange={(e) => setKiCharge(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </>
        )}

        {/* PO CONTROLS */}
        {heroId === 'hero-po' && (
          <>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-nunito font-bold">
                <span className="text-emerald-300 font-black">
                  {activeTechnique === 'skadoosh' ? 'Jade Staff Portal Intensity' : 'Golden Celestial Chi Dragon Rise'}
                </span>
                <span className="text-emerald-200">{dragonRise.toFixed(1)} m</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={3.5}
                step={0.1}
                value={dragonRise}
                onChange={(e) => setDragonRise(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-nunito font-bold">
                <span className="text-slate-300">
                  {activeTechnique === 'skadoosh' ? 'Staff Orb Spin Velocity' : 'Jade Orb Rotation Alignment'}
                </span>
                <span className="text-emerald-300">{taiChiAngle}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                step={5}
                value={taiChiAngle}
                onChange={(e) => setTaiChiAngle(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-nunito font-bold">
                <span className="text-slate-300">Inner Peace Chi Channeling</span>
                <span className="text-emerald-300">{innerPeace}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={innerPeace}
                onChange={(e) => setInnerPeace(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </>
        )}

        {/* IRON MAN CONTROLS */}
        {heroId === 'hero-ironman' && (
          <>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-nunito font-bold">
                <span className="text-red-300 font-black">Arc Reactor Power Overclock</span>
                <span className="text-red-200">{arcPower}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={200}
                step={1}
                value={arcPower}
                onChange={(e) => setArcPower(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-nunito font-bold">
                <span className="text-slate-300">
                  {activeTechnique === 'emp' ? 'Holographic EMP Shield Radius' : 'Targeting Trajectory Sweep Angle'}
                </span>
                <span className="text-cyan-300">
                  {activeTechnique === 'emp' ? `${empRadius.toFixed(1)} m` : `${beamAngle}°`}
                </span>
              </div>
              <input
                type="range"
                min={activeTechnique === 'emp' ? 1.0 : -40}
                max={activeTechnique === 'emp' ? 5.0 : 40}
                step={activeTechnique === 'emp' ? 0.1 : 1}
                value={activeTechnique === 'emp' ? empRadius : beamAngle}
                onChange={(e) => activeTechnique === 'emp' ? setEmpRadius(Number(e.target.value)) : setBeamAngle(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </>
        )}
      </div>

      {/* Status Footer */}
      <div className="text-center">
        <span className="font-display font-black text-sm text-cyan-300">
          {isHarmonized
            ? '🎉 HARMONIC RESONANCE LOCKED! The tactical path is cleared with maximum power!'
            : 'Slide controls to tune harmonics and unleash full hero manifestation!'}
        </span>
      </div>

    </div>
  );
};


