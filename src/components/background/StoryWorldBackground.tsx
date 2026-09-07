import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useStoryState } from '../../context/StoryStateContext';
import { useAudio } from '../../context/AudioContext';
import { LevelId } from '../../types/story';

/* ═══════════════════════════════════════════════════════════════
   TOON MATERIAL GRADIENT RAMP
   ═══════════════════════════════════════════════════════════════ */
const toonTexture = (() => {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 1;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 4, 0);
  grad.addColorStop(0, '#555555');
  grad.addColorStop(0.5, '#aaaaaa');
  grad.addColorStop(1, '#ffffff');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 4, 1);
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  return texture;
})();

/* ═══════════════════════════════════════════════════════════════
   SMOOTH CAMERA WITH FULL-ISLAND FRAMING & MOUSE PARALLAX
   ═══════════════════════════════════════════════════════════════ */
function SmoothParallaxCamera() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useFrame(() => {
    current.current.x += (mouse.current.x - current.current.x) * 0.03;
    current.current.y += (mouse.current.y - current.current.y) * 0.03;
    camera.position.x = current.current.x * 3.2;
    camera.position.y = 24 + current.current.y * 1.5;
    camera.position.z = 20 - current.current.y * 1.0;
    camera.lookAt(0, 0.8, -1.0);
  });

  return null;
}

/* ═══════════════════════════════════════════════════════════════
   RECTANGULAR PARCHMENT SCROLL NAME TAG (INSP. BY GAME MAPS)
   ═══════════════════════════════════════════════════════════════ */
function ChapterNameTag3D({
  pos,
  num,
  icon,
  title,
  levelId
}: {
  pos: [number, number, number];
  num: number;
  icon: string;
  title: string;
  levelId: LevelId;
}) {
  const { currentLevelId, completedLevels, openLevelActivity } = useStoryState();
  const { playLevelSelect, playTap } = useAudio();
  const groupRef = useRef<THREE.Group>(null);

  const LEVEL_ORDER: LevelId[] = ['level-1', 'level-2', 'level-3', 'level-4', 'level-5', 'level-6'];
  const levelIndex = LEVEL_ORDER.indexOf(levelId);
  const isUnlocked = num === 1 || completedLevels.includes(LEVEL_ORDER[levelIndex - 1]) || completedLevels.includes(levelId) || currentLevelId === levelId;
  const isCompleted = completedLevels.includes(levelId);
  const isActive = currentLevelId === levelId;

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = pos[1] + Math.sin(clock.getElapsedTime() * 2.0 + num) * 0.12;
    }
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isUnlocked) {
      playTap();
      alert(`🔒 Chapter ${num} is locked! Complete Chapter ${num - 1} first to advance.`);
      return;
    }
    playLevelSelect();
    openLevelActivity(levelId);
  };

  return (
    <group position={[pos[0], 0, pos[2]]}>
      {/* Floating Rectangular Name Tag */}
      <group ref={groupRef} position={[0, pos[1], 0]}>
        <Html center distanceFactor={28} zIndexRange={[100, 0]}>
          <div className="relative flex flex-col items-center">
            <button
              type="button"
              onClick={handleClick}
              className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-lg border-2 transition-all cursor-pointer select-none shadow-xl hover:scale-110 active:scale-95 whitespace-nowrap ${
                !isUnlocked
                  ? 'bg-[#E2E8F0]/90 border-slate-500 text-slate-500 opacity-75'
                  : isActive
                  ? 'bg-gradient-to-b from-[#FFFDF5] to-[#FEF3C7] border-[#B45309] ring-4 ring-amber-400/50 scale-105 shadow-[0_8px_20px_rgba(245,158,11,0.4)]'
                  : 'bg-gradient-to-b from-[#FFFDF5] to-[#FEF3C7] hover:bg-white border-[#78350F] shadow-[0_6px_14px_rgba(0,0,0,0.3)]'
              }`}
              style={{
                boxShadow: isActive ? '0 8px 24px rgba(217, 119, 6, 0.45)' : '0 4px 12px rgba(0, 0, 0, 0.35)'
              }}
            >
              {/* Left Scroll Roll End */}
              <div className="w-1.5 h-6 bg-[#92400E] rounded-xs border border-[#78350F] -ml-2 shrink-0" />

              {/* Status / Number or Lock */}
              <div className="flex items-center gap-1.5">
                {!isUnlocked ? (
                  <span className="text-xs">🔒</span>
                ) : isCompleted ? (
                  <span className="text-xs">⭐</span>
                ) : (
                  <span className="text-xs">{icon}</span>
                )}

                {/* Chapter Landmark Name */}
                <span className="font-adventure font-black text-xs tracking-wide text-[#451A03] drop-shadow-xs">
                  {title}
                </span>
              </div>

              {/* Right Scroll Roll End */}
              <div className="w-1.5 h-6 bg-[#92400E] rounded-xs border border-[#78350F] -mr-2 shrink-0" />
            </button>
          </div>
        </Html>
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   🐬 ANIMATED JUMPING DOLPHINS IN THE SEA
   ═══════════════════════════════════════════════════════════════ */
function DolphinPod({ basePos, speed = 1.0 }: { basePos: [number, number, number]; speed?: number }) {
  const d1Ref = useRef<THREE.Group>(null);
  const d2Ref = useRef<THREE.Group>(null);
  const splash1Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;

    // Dolphin 1 parabolic leap
    if (d1Ref.current) {
      const cycle = (t * 0.4) % 1.0;
      const leapAngle = cycle * Math.PI; // 0 to PI
      const y = Math.sin(leapAngle) * 2.2 - 0.4;
      const z = Math.cos(t * 0.3) * 2.5 + cycle * 3.5;
      const pitch = Math.cos(leapAngle) * 0.8; // tilts up on rise, down on dive

      d1Ref.current.position.set(basePos[0], y, basePos[2] + z);
      d1Ref.current.rotation.x = -pitch;
      d1Ref.current.visible = y > -0.5;
    }

    // Dolphin 2 slight offset leap
    if (d2Ref.current) {
      const cycle = ((t * 0.4 + 0.3) % 1.0);
      const leapAngle = cycle * Math.PI;
      const y = Math.sin(leapAngle) * 1.8 - 0.4;
      const z = Math.cos(t * 0.3 + 0.5) * 2.0 + cycle * 3.0;
      const pitch = Math.cos(leapAngle) * 0.75;

      d2Ref.current.position.set(basePos[0] + 1.2, y, basePos[2] + z - 0.5);
      d2Ref.current.rotation.x = -pitch;
      d2Ref.current.visible = y > -0.5;
    }

    // Splash ring pulse
    if (splash1Ref.current) {
      const cycle = (t * 0.4) % 1.0;
      const s = 1 + (cycle > 0.8 || cycle < 0.2 ? 0.8 : 0);
      splash1Ref.current.scale.set(s, s, s);
    }
  });

  return (
    <group>
      {/* Dolphin 1 */}
      <group ref={d1Ref} position={basePos} scale={[0.6, 0.6, 0.6]}>
        {/* Torso */}
        <mesh castShadow>
          <capsuleGeometry args={[0.3, 1.2, 8, 12]} />
          <meshToonMaterial color="#38BDF8" gradientMap={toonTexture} />
        </mesh>
        {/* Dorsal fin */}
        <mesh position={[0, 0.35, -0.1]} rotation={[0.4, 0, 0]}>
          <coneGeometry args={[0.15, 0.4, 3]} />
          <meshToonMaterial color="#0284C7" gradientMap={toonTexture} />
        </mesh>
        {/* Flippers */}
        <mesh position={[0.35, -0.1, 0.2]} rotation={[0, 0, -0.6]}>
          <boxGeometry args={[0.4, 0.05, 0.2]} />
          <meshToonMaterial color="#0284C7" gradientMap={toonTexture} />
        </mesh>
        <mesh position={[-0.35, -0.1, 0.2]} rotation={[0, 0, 0.6]}>
          <boxGeometry args={[0.4, 0.05, 0.2]} />
          <meshToonMaterial color="#0284C7" gradientMap={toonTexture} />
        </mesh>
        {/* Tail fluke */}
        <mesh position={[0, -0.05, -0.7]} rotation={[0.5, 0, 0]}>
          <boxGeometry args={[0.6, 0.04, 0.25]} />
          <meshToonMaterial color="#38BDF8" gradientMap={toonTexture} />
        </mesh>
      </group>

      {/* Dolphin 2 */}
      <group ref={d2Ref} position={basePos} scale={[0.48, 0.48, 0.48]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.3, 1.1, 8, 12]} />
          <meshToonMaterial color="#0EA5E9" gradientMap={toonTexture} />
        </mesh>
        <mesh position={[0, 0.35, -0.1]} rotation={[0.4, 0, 0]}>
          <coneGeometry args={[0.15, 0.35, 3]} />
          <meshToonMaterial color="#0369A1" gradientMap={toonTexture} />
        </mesh>
      </group>

      {/* Ocean Splash Ring */}
      <mesh ref={splash1Ref} position={[basePos[0], -0.15, basePos[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.7, 16]} />
        <meshBasicMaterial color="#E0F2FE" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   🐟 SWIMMING FISH SCHOOLS
   ═══════════════════════════════════════════════════════════════ */
function FishSchools({ centerPos, count = 6, radius = 3.5 }: { centerPos: [number, number, number]; count?: number; radius?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.45;
    }
  });

  const fishList = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        x: Math.cos(angle) * (radius + (Math.random() - 0.5) * 0.8),
        y: -0.3 + Math.sin(i) * 0.1,
        z: Math.sin(angle) * (radius + (Math.random() - 0.5) * 0.8),
        rotY: -angle + Math.PI / 2,
        color: i % 3 === 0 ? '#F97316' : i % 3 === 1 ? '#FACC15' : '#EC4899'
      };
    });
  }, [count, radius]);

  return (
    <group position={centerPos}>
      <group ref={groupRef}>
        {fishList.map((f, i) => (
          <group key={i} position={[f.x, f.y, f.z]} rotation={[0, f.rotY, 0]} scale={[0.3, 0.3, 0.3]}>
            {/* Body */}
            <mesh>
              <coneGeometry args={[0.2, 0.7, 5]} />
              <meshBasicMaterial color={f.color} />
            </mesh>
            {/* Tail */}
            <mesh position={[0, 0, -0.45]} rotation={[0, 0, Math.PI / 2]}>
              <coneGeometry args={[0.25, 0.3, 3]} />
              <meshBasicMaterial color={f.color} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   🚢 BIG CONTAINER CARGO SHIPS IN OUTER SEA
   ═══════════════════════════════════════════════════════════════ */
function ContainerCargoShip({ pos, rotY = 0 }: { pos: [number, number, number]; rotY?: number }) {
  const shipRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (shipRef.current) {
      shipRef.current.position.y = pos[1] + Math.sin(t * 1.2) * 0.05;
      shipRef.current.rotation.z = Math.sin(t * 0.9) * 0.02;
    }
  });

  const containers = useMemo(() => [
    { p: [-0.6, 0.65, 0.8], c: '#EF4444' },
    { p: [0, 0.65, 0.8], c: '#3B82F6' },
    { p: [0.6, 0.65, 0.8], c: '#EAB308' },
    { p: [-0.6, 1.05, 0.8], c: '#10B981' },
    { p: [0, 1.05, 0.8], c: '#EF4444' },
    { p: [0.6, 1.05, 0.8], c: '#06B6D4' },
    { p: [-0.6, 0.65, -0.6], c: '#F97316' },
    { p: [0, 0.65, -0.6], c: '#8B5CF6' },
    { p: [0.6, 0.65, -0.6], c: '#10B981' },
    { p: [-0.6, 1.05, -0.6], c: '#3B82F6' },
    { p: [0, 1.05, -0.6], c: '#EAB308' },
  ], []);

  return (
    <group ref={shipRef} position={pos} rotation={[0, rotY, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* Lower Red/Black Steel Hull */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[2.0, 0.75, 5.5]} />
        <meshToonMaterial color="#1E293B" gradientMap={toonTexture} />
      </mesh>
      {/* Red Keel Bottom */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.9, 0.25, 5.4]} />
        <meshBasicMaterial color="#DC2626" />
      </mesh>
      {/* Wedge Bow */}
      <mesh position={[0, 0.35, 3.2]} rotation={[0.4, 0, 0]}>
        <coneGeometry args={[1.0, 1.4, 4]} />
        <meshToonMaterial color="#1E293B" gradientMap={toonTexture} />
      </mesh>

      {/* Cargo Containers Stacks */}
      {containers.map((box, i) => (
        <mesh key={i} position={box.p as [number, number, number]} castShadow>
          <boxGeometry args={[0.55, 0.38, 1.2]} />
          <meshToonMaterial color={box.c} gradientMap={toonTexture} />
        </mesh>
      ))}

      {/* Bridge Deck House (Stern) */}
      <mesh position={[0, 1.1, -2.0]} castShadow>
        <boxGeometry args={[1.6, 1.2, 1.0]} />
        <meshToonMaterial color="#FFFFFF" gradientMap={toonTexture} />
      </mesh>
      {/* Windows Stripe */}
      <mesh position={[0, 1.4, -1.48]}>
        <boxGeometry args={[1.4, 0.15, 0.05]} />
        <meshBasicMaterial color="#0284C7" />
      </mesh>
      {/* Smokestack */}
      <mesh position={[0, 1.8, -2.2]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.7, 8]} />
        <meshToonMaterial color="#DC2626" gradientMap={toonTexture} />
      </mesh>
      {/* Radar Antenna */}
      <mesh position={[0, 2.2, -1.8]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 4]} />
        <meshBasicMaterial color="#94A3B8" />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FLOWING TROPICAL OCEAN
   ═══════════════════════════════════════════════════════════════ */
function FlowingOcean() {
  const waterRef = useRef<THREE.Mesh>(null);
  const causticsRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (waterRef.current) {
      const geo = waterRef.current.geometry as THREE.PlaneGeometry;
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        const wave1 = Math.sin(u * 0.22 + t * 1.6) * 0.16;
        const wave2 = Math.cos(v * 0.28 + t * 1.2) * 0.14;
        const wave3 = Math.sin((u + v) * 0.18 + t * 2.0) * 0.08;
        const ripple = Math.sin(u * 0.8 - t * 3.0) * 0.03;
        pos.setZ(i, wave1 + wave2 + wave3 + ripple);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    }

    if (causticsRef.current) {
      causticsRef.current.rotation.z = t * 0.04;
    }
  });

  return (
    <group>
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]} receiveShadow>
        <planeGeometry args={[110, 110, 75, 75]} />
        <meshStandardMaterial
          color="#06B6D4"
          roughness={0.1}
          metalness={0.15}
          emissive="#0891B2"
          emissiveIntensity={0.25}
        />
      </mesh>
      <mesh ref={causticsRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <ringGeometry args={[6, 45, 32]} />
        <meshBasicMaterial color="#67E8F9" transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
        <planeGeometry args={[160, 160]} />
        <meshBasicMaterial color="#024E76" />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ISLAND TERRAIN
   ═══════════════════════════════════════════════════════════════ */
function IslandTerrain() {
  const foamRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (foamRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.02;
      foamRef.current.scale.set(scale, 1, scale);
    }
  });

  const islandNodes = useMemo(() => [
    { p: [0, 0, 0], r: 9.2, s: 10.2 },
    { p: [2.5, 0, -4.5], r: 5.8, s: 6.5 },
    { p: [6.8, 0, 1.8], r: 4.5, s: 5.2 },
    { p: [-4.8, 0, 4.8], r: 5.2, s: 6.0 },
    { p: [-6.5, 0, -2.0], r: 4.2, s: 5.0 },
    { p: [3.2, 0, 4.2], r: 3.8, s: 4.6 },
    { p: [-2.2, 0, -4.2], r: 3.5, s: 4.2 }
  ], []);

  return (
    <group>
      <group ref={foamRef}>
        {islandNodes.map((n, i) => (
          <mesh key={`foam-${i}`} position={[n.p[0], 0.02, n.p[2]]} receiveShadow>
            <cylinderGeometry args={[n.s + 0.7, n.s + 1.2, 0.08, 28]} />
            <meshBasicMaterial color="#F0FDFA" transparent opacity={0.7} />
          </mesh>
        ))}
      </group>

      {islandNodes.map((n, i) => (
        <mesh key={`beach-${i}`} position={[n.p[0], 0.08, n.p[2]]} receiveShadow>
          <cylinderGeometry args={[n.s + 0.1, n.s + 0.6, 0.22, 28]} />
          <meshToonMaterial color="#FDE047" gradientMap={toonTexture} />
        </mesh>
      ))}

      {islandNodes.map((n, i) => (
        <mesh key={`grass-${i}`} position={[n.p[0], 0.24, n.p[2]]} castShadow receiveShadow>
          <cylinderGeometry args={[n.r, n.s, 0.48, 28]} />
          <meshToonMaterial color="#84CC16" gradientMap={toonTexture} />
        </mesh>
      ))}

      {islandNodes.map((n, i) => (
        <mesh key={`plateau-${i}`} position={[n.p[0], 0.54, n.p[2]]} castShadow receiveShadow>
          <cylinderGeometry args={[n.r * 0.72, n.r * 0.85, 0.25, 24]} />
          <meshToonMaterial color="#4D7C0F" gradientMap={toonTexture} />
        </mesh>
      ))}

      {/* Blue River */}
      {[
        { pos: [-1.4, 0.62, 2.6] as [number, number, number], rot: 0.42, w: 0.75, h: 4.8 },
        { pos: [1.8, 0.62, 0.6] as [number, number, number], rot: -0.32, w: 0.6, h: 4.2 },
        { pos: [-0.6, 0.62, -1.6] as [number, number, number], rot: 0.85, w: 0.55, h: 3.4 }
      ].map((r, i) => (
        <group key={`river-${i}`}>
          <mesh position={r.pos} rotation={[-Math.PI / 2, 0, r.rot]}>
            <planeGeometry args={[r.w, r.h]} />
            <meshBasicMaterial color="#38BDF8" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[r.pos[0], r.pos[1] + 0.01, r.pos[2]]} rotation={[-Math.PI / 2, 0, r.rot]}>
            <planeGeometry args={[r.w * 0.35, r.h]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.75} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VOLCANO WITH CONTINUOUS LAVA & TWISTING SMOKE
   ═══════════════════════════════════════════════════════════════ */
function Volcano() {
  const smokeGroup = useRef<THREE.Group>(null);
  const lavaSparksGroup = useRef<THREE.Group>(null);
  const lavaLightRef = useRef<THREE.PointLight>(null);
  const calderaRef = useRef<THREE.Mesh>(null);

  const sparks = useMemo(() => [
    { angle: 0, speed: 2.2, height: 3.2 },
    { angle: 0.8, speed: 2.8, height: 4.0 },
    { angle: 1.6, speed: 2.4, height: 3.5 },
    { angle: 2.4, speed: 3.0, height: 4.5 },
    { angle: 3.2, speed: 2.1, height: 3.0 },
    { angle: 4.0, speed: 2.7, height: 4.2 },
    { angle: 4.8, speed: 2.3, height: 3.6 },
    { angle: 5.6, speed: 2.9, height: 4.1 },
  ], []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (lavaLightRef.current) {
      lavaLightRef.current.intensity = 6 + Math.sin(t * 8) * 3 + Math.cos(t * 12) * 1.5;
    }
    if (calderaRef.current) {
      const s = 1 + Math.sin(t * 6) * 0.06;
      calderaRef.current.scale.set(s, 1, s);
    }

    if (lavaSparksGroup.current) {
      lavaSparksGroup.current.children.forEach((spark, i) => {
        const config = sparks[i];
        const cycle = ((t * config.speed * 0.4 + i * 0.25) % 1.0);
        const arcY = 5.9 + Math.sin(cycle * Math.PI) * config.height;
        const spreadR = cycle * 1.8;
        const arcX = Math.cos(config.angle + t * 0.3) * spreadR;
        const arcZ = Math.sin(config.angle + t * 0.3) * spreadR;

        spark.position.set(arcX, arcY, arcZ);
        spark.scale.setScalar(0.25 * (1 - cycle * 0.6));
      });
    }

    if (smokeGroup.current) {
      smokeGroup.current.children.forEach((puff, i) => {
        const offset = i * 0.7;
        const progress = ((t * 0.4 + offset) % 4.0) / 4.0;
        const posY = 6.2 + progress * 5.5;
        const swirlX = Math.sin(t * 1.5 + i * 1.2) * (0.3 + progress * 1.5);
        const swirlZ = Math.cos(t * 1.5 + i * 1.2) * (0.3 + progress * 1.5);

        puff.position.set(swirlX, posY, swirlZ);
        puff.scale.setScalar(0.4 + progress * 1.6);
        puff.rotation.y = t * 0.6 + i;

        const mat = (puff as THREE.Mesh).material as THREE.MeshStandardMaterial;
        mat.opacity = Math.max(0, 0.75 * (1 - progress));
      });
    }
  });

  return (
    <group position={[3.5, 0.4, -5.2]}>
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[4.8, 5.8, 1.4, 8]} />
        <meshToonMaterial color="#573010" gradientMap={toonTexture} />
      </mesh>
      <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.4, 4.8, 1.6, 8]} />
        <meshToonMaterial color="#442208" gradientMap={toonTexture} />
      </mesh>
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[3.0, 3.0, 8]} />
        <meshToonMaterial color="#361A06" gradientMap={toonTexture} />
      </mesh>
      <mesh position={[0, 5.0, 0]} castShadow>
        <coneGeometry args={[1.6, 2.0, 8]} />
        <meshToonMaterial color="#241103" gradientMap={toonTexture} />
      </mesh>

      <mesh ref={calderaRef} position={[0, 5.85, 0]}>
        <cylinderGeometry args={[1.05, 1.3, 0.35, 16]} />
        <meshBasicMaterial color="#FF3D00" />
      </mesh>
      <pointLight ref={lavaLightRef} position={[0, 6.4, 0]} color="#FF2200" intensity={8} distance={16} />

      {[
        { p: [0.9, 3.6, 1.9] as [number, number, number], r: 0.6 },
        { p: [-0.7, 3.8, 1.4] as [number, number, number], r: 0.45 },
        { p: [1.4, 2.8, 1.1] as [number, number, number], r: 0.72 }
      ].map((lava, i) => (
        <group key={i} position={lava.p} rotation={[lava.r, 0.2 * i, 0]}>
          <mesh>
            <planeGeometry args={[0.4, 3.6]} />
            <meshBasicMaterial color="#FF4500" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[0.15, 3.2]} />
            <meshBasicMaterial color="#FFD700" side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      <group ref={lavaSparksGroup}>
        {sparks.map((_, i) => (
          <mesh key={`spark-${i}`}>
            <sphereGeometry args={[0.22, 8, 8]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#FFD700' : '#FF4500'} />
          </mesh>
        ))}
      </group>

      <group ref={smokeGroup}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <mesh key={`smoke-${i}`}>
            <dodecahedronGeometry args={[0.75]} />
            <meshStandardMaterial
              color={['#D6D3D1', '#E7E5E4', '#F5F5F4', '#CBD5E1', '#A8A29E', '#E2E8F0'][i]}
              transparent
              opacity={0.7}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHAPTER 4: CRYSTAL WATERFALL & CLIFFS
   ═══════════════════════════════════════════════════════════════ */
function WaterfallCliffs() {
  const splashRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (splashRef.current) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 6) * 0.12;
      splashRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[-7.0, 0.3, -1.8]}>
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 3.4, 2.2]} />
        <meshToonMaterial color="#475569" gradientMap={toonTexture} />
      </mesh>
      <mesh position={[0.3, 3.2, -0.3]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 1.6, 1.8]} />
        <meshToonMaterial color="#64748B" gradientMap={toonTexture} />
      </mesh>
      <mesh position={[-1.7, 1.2, 0.4]} castShadow>
        <boxGeometry args={[1.6, 2.2, 1.4]} />
        <meshToonMaterial color="#334155" gradientMap={toonTexture} />
      </mesh>

      <mesh position={[0.7, 1.8, 0.9]}>
        <boxGeometry args={[0.7, 3.0, 0.18]} />
        <meshBasicMaterial color="#67E8F9" transparent opacity={0.92} />
      </mesh>
      <mesh position={[0.8, 1.8, 0.92]}>
        <boxGeometry args={[0.25, 3.0, 0.14]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.85} />
      </mesh>

      <group ref={splashRef} position={[0.8, 0.25, 1.2]}>
        <mesh position={[-0.3, 0, 0]}>
          <sphereGeometry args={[0.42, 12, 12]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.2, 0.05, 0]}>
          <sphereGeometry args={[0.5, 12, 12]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHAPTER 2: GOLDEN SUN TEMPLE
   ═══════════════════════════════════════════════════════════════ */
function SunTemple() {
  return (
    <group position={[-1.2, 0.4, 2.8]}>
      {[
        { y: 0.22, w: 3.8, h: 0.48, c: '#B45309' },
        { y: 0.65, w: 3.0, h: 0.42, c: '#D97706' },
        { y: 1.05, w: 2.2, h: 0.38, c: '#F59E0B' },
        { y: 1.38, w: 1.4, h: 0.32, c: '#FBBF24' }
      ].map((tier, i) => (
        <mesh key={i} position={[0, tier.y, 0]} castShadow receiveShadow>
          <boxGeometry args={[tier.w, tier.h, tier.w]} />
          <meshToonMaterial color={tier.c} gradientMap={toonTexture} />
        </mesh>
      ))}

      <mesh position={[0, 1.7, 0]} castShadow>
        <boxGeometry args={[1.8, 0.22, 1.8]} />
        <meshToonMaterial color="#FDE047" gradientMap={toonTexture} />
      </mesh>
      <mesh position={[0, 0.5, 1.3]} castShadow>
        <boxGeometry args={[0.8, 0.9, 0.3]} />
        <meshBasicMaterial color="#1C1917" />
      </mesh>

      <Float speed={2.5} floatIntensity={0.6}>
        <mesh position={[0, 2.2, 0]}>
          <octahedronGeometry args={[0.35]} />
          <meshBasicMaterial color="#FEF08A" />
        </mesh>
        <pointLight position={[0, 2.2, 0]} color="#FDE047" intensity={3} distance={6} />
      </Float>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHAPTER 6: PIRATE GALLEON SHIP
   ═══════════════════════════════════════════════════════════════ */
function PirateShip() {
  return (
    <Float speed={1.4} floatIntensity={0.35} rotationIntensity={0.18}>
      <group position={[9.5, -0.1, 3.2]} rotation={[0, 0.65, 0]} scale={[1.35, 1.35, 1.35]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[1.6, 0.85, 3.4]} />
          <meshToonMaterial color="#0F172A" gradientMap={toonTexture} />
        </mesh>
        <mesh position={[0, 0.72, 0]}>
          <boxGeometry args={[1.68, 0.08, 3.45]} />
          <meshBasicMaterial color="#FBBF24" />
        </mesh>
        <mesh position={[0, 0.45, 1.9]} rotation={[0.35, 0, 0]} castShadow>
          <coneGeometry args={[0.85, 1.1, 4]} />
          <meshToonMaterial color="#1E293B" gradientMap={toonTexture} />
        </mesh>

        <mesh position={[0, 2.1, -0.5]} castShadow><cylinderGeometry args={[0.06, 0.07, 3.0, 8]} /><meshToonMaterial color="#451A03" gradientMap={toonTexture} /></mesh>
        <mesh position={[0, 2.4, 0.6]} castShadow><cylinderGeometry args={[0.07, 0.08, 3.4, 8]} /><meshToonMaterial color="#451A03" gradientMap={toonTexture} /></mesh>

        <mesh position={[0, 1.6, 0.6]}><boxGeometry args={[1.5, 0.95, 0.04]} /><meshStandardMaterial color="#FFF7ED" roughness={0.7} /></mesh>
        <mesh position={[0, 2.4, 0.6]}><boxGeometry args={[1.7, 1.15, 0.04]} /><meshStandardMaterial color="#FFF7ED" roughness={0.7} /></mesh>

        <mesh position={[0, 3.8, 0.6]}><boxGeometry args={[0.55, 0.32, 0.02]} /><meshBasicMaterial color="#0F172A" /></mesh>
        <mesh position={[0, 3.8, 0.62]}><sphereGeometry args={[0.07, 8, 8]} /><meshBasicMaterial color="#FFFFFF" /></mesh>
      </group>
    </Float>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LIGHTHOUSE WITH EXPANDING CONE
   ═══════════════════════════════════════════════════════════════ */
function Lighthouse() {
  const beamRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (beamRef.current) {
      beamRef.current.rotation.y = clock.getElapsedTime() * 1.35;
    }
  });

  return (
    <group position={[-9.5, -0.1, -4.8]}>
      <mesh position={[0, 0.06, 0]} receiveShadow><cylinderGeometry args={[1.6, 2.2, 0.24, 24]} /><meshToonMaterial color="#FDE047" gradientMap={toonTexture} /></mesh>
      <mesh position={[0, 0.2, 0]} receiveShadow><cylinderGeometry args={[1.3, 1.6, 0.22, 24]} /><meshToonMaterial color="#4ADE80" gradientMap={toonTexture} /></mesh>

      {['#EF4444', '#FFFFFF', '#EF4444', '#FFFFFF', '#EF4444'].map((c, i) => (
        <mesh key={i} position={[0, 0.6 + i * 0.52, 0]} castShadow>
          <cylinderGeometry args={[0.42 - i * 0.02, 0.45 - i * 0.02, 0.52, 16]} />
          <meshToonMaterial color={c} gradientMap={toonTexture} />
        </mesh>
      ))}

      <mesh position={[0, 3.3, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.38, 14]} />
        <meshBasicMaterial color="#FEF9C3" />
      </mesh>
      <mesh position={[0, 3.6, 0]}>
        <coneGeometry args={[0.5, 0.45, 14]} />
        <meshToonMaterial color="#1E293B" gradientMap={toonTexture} />
      </mesh>

      <group ref={beamRef} position={[0, 3.3, 0]}>
        <mesh position={[3.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[2.5, 0.18, 7.2, 20, 1, true]} />
          <meshBasicMaterial color="#FEF9C3" transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <pointLight position={[1.5, 0, 0]} color="#FEF08A" intensity={3.5} distance={15} />
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SAILING SHIPS ON WESTERN SEA
   ═══════════════════════════════════════════════════════════════ */
function LighthouseSideShips() {
  const ship1Ref = useRef<THREE.Group>(null);
  const ship2Ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ship1Ref.current) {
      ship1Ref.current.position.x = -12.5 + Math.sin(t * 0.4) * 1.5;
      ship1Ref.current.position.z = -1.2 + Math.cos(t * 0.3) * 1.2;
      ship1Ref.current.rotation.z = Math.sin(t * 1.5) * 0.08;
      ship1Ref.current.rotation.y = 0.85 + Math.cos(t * 0.4) * 0.15;
    }
    if (ship2Ref.current) {
      ship2Ref.current.position.x = -8.2 + Math.cos(t * 0.35) * 1.8;
      ship2Ref.current.position.z = -8.8 + Math.sin(t * 0.3) * 1.0;
      ship2Ref.current.rotation.z = Math.cos(t * 1.8) * 0.07;
    }
  });

  return (
    <group>
      <group ref={ship1Ref} position={[-12.5, 0, -1.2]}>
        <mesh position={[0, 0.28, 0]} castShadow><boxGeometry args={[1.0, 0.5, 2.3]} /><meshToonMaterial color="#78350F" gradientMap={toonTexture} /></mesh>
        <mesh position={[0, 0.32, 1.25]} rotation={[0.35, 0, 0]}><coneGeometry args={[0.55, 0.75, 4]} /><meshToonMaterial color="#92400E" gradientMap={toonTexture} /></mesh>
        <mesh position={[0, 1.35, 0.1]}><cylinderGeometry args={[0.04, 0.05, 2.3, 6]} /><meshToonMaterial color="#451A03" gradientMap={toonTexture} /></mesh>
        <mesh position={[0, 1.35, 0.1]}><boxGeometry args={[1.15, 1.45, 0.03]} /><meshStandardMaterial color="#FFFFFF" roughness={0.6} /></mesh>
      </group>

      <group ref={ship2Ref} position={[-8.2, 0, -8.8]} scale={[0.88, 0.88, 0.88]}>
        <mesh position={[0, 0.26, 0]} castShadow><boxGeometry args={[1.1, 0.55, 2.6]} /><meshToonMaterial color="#451A03" gradientMap={toonTexture} /></mesh>
        <mesh position={[0, 1.25, 0.5]}><boxGeometry args={[1.05, 1.25, 0.03]} /><meshStandardMaterial color="#FFFBEB" /></mesh>
        <mesh position={[0, 1.45, -0.4]}><boxGeometry args={[1.25, 1.55, 0.03]} /><meshStandardMaterial color="#FFFBEB" /></mesh>
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHAPTER 1: MOAI HEADS
   ═══════════════════════════════════════════════════════════════ */
function MoaiStatues() {
  return (
    <group position={[-4.2, 0.3, 5.8]}>
      {[
        { x: -1.1, h: 1.7, rot: -0.12, c: '#94A3B8' },
        { x: 0, h: 2.1, rot: 0, c: '#CBD5E1' },
        { x: 1.1, h: 1.6, rot: 0.1, c: '#94A3B8' }
      ].map((m, i) => (
        <group key={i} position={[m.x, 0, i * 0.3]} rotation={[0, m.rot, 0]}>
          <mesh position={[0, m.h * 0.35, 0]} castShadow><boxGeometry args={[0.6, m.h * 0.7, 0.55]} /><meshToonMaterial color={m.c} gradientMap={toonTexture} /></mesh>
          <mesh position={[0, m.h * 0.8, 0]} castShadow><boxGeometry args={[0.65, m.h * 0.4, 0.6]} /><meshToonMaterial color={m.c} gradientMap={toonTexture} /></mesh>
          <mesh position={[0, m.h * 0.7, 0.35]} castShadow><boxGeometry args={[0.18, 0.42, 0.18]} /><meshToonMaterial color="#78350F" gradientMap={toonTexture} /></mesh>
        </group>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SKULL CAVE & ICE SHELF
   ═══════════════════════════════════════════════════════════════ */
function SkullCave() {
  return (
    <group position={[-1.6, 0.4, -4.2]}>
      <mesh position={[0, 1.1, 0]} castShadow><dodecahedronGeometry args={[1.9]} /><meshToonMaterial color="#64748B" gradientMap={toonTexture} /></mesh>
      <mesh position={[-0.48, 1.25, 1.55]}><sphereGeometry args={[0.3, 12, 12]} /><meshBasicMaterial color="#38BDF8" /></mesh>
      <mesh position={[0.48, 1.25, 1.55]}><sphereGeometry args={[0.3, 12, 12]} /><meshBasicMaterial color="#38BDF8" /></mesh>
      <pointLight position={[0, 1.1, 1.7]} color="#38BDF8" intensity={2.5} distance={5} />
      <mesh position={[0, 0.48, 1.45]}><boxGeometry args={[0.85, 0.7, 0.35]} /><meshBasicMaterial color="#0F172A" /></mesh>
    </group>
  );
}

function IceShelfIgloo() {
  return (
    <group position={[9.2, -0.1, -5.8]}>
      <mesh position={[0, 0.12, 0]} receiveShadow><cylinderGeometry args={[2.4, 3.0, 0.42, 5]} /><meshToonMaterial color="#E0F2FE" gradientMap={toonTexture} /></mesh>
      <mesh position={[0, 0.85, 0]} castShadow><sphereGeometry args={[0.95, 18, 18, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshToonMaterial color="#FFFFFF" gradientMap={toonTexture} /></mesh>
      <mesh position={[0, 0.42, 0.9]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.26, 0.26, 0.48, 12]} /><meshBasicMaterial color="#0284C7" /></mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   🌴 COCONUT PALM TREES ON SANDY BEACHES
   ═══════════════════════════════════════════════════════════════ */
function SinglePalmTree({ pos, scale = 1.0, rot = [0, 0, 0] }: { pos: [number, number, number]; scale?: number; rot?: [number, number, number] }) {
  return (
    <group position={pos} rotation={rot} scale={[scale, scale, scale]}>
      {/* Curved Segmented Trunk */}
      <mesh position={[0, 0.6, 0]} rotation={[0.1, 0, 0.15]} castShadow>
        <cylinderGeometry args={[0.07, 0.11, 1.2, 6]} />
        <meshToonMaterial color="#78350F" gradientMap={toonTexture} />
      </mesh>
      <mesh position={[0.16, 1.6, 0.12]} rotation={[0.2, 0, 0.25]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 1.1, 6]} />
        <meshToonMaterial color="#854D0E" gradientMap={toonTexture} />
      </mesh>
      <mesh position={[0.38, 2.4, 0.28]} rotation={[0.25, 0, 0.32]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 0.9, 6]} />
        <meshToonMaterial color="#78350F" gradientMap={toonTexture} />
      </mesh>

      {/* Palm Crown Canopy (6 Radiating Drooping Fronds) */}
      <group position={[0.52, 2.8, 0.42]}>
        {/* 3 Coconuts */}
        <mesh position={[0.06, -0.05, 0.06]} castShadow><sphereGeometry args={[0.08, 6, 6]} /><meshToonMaterial color="#451A03" gradientMap={toonTexture} /></mesh>
        <mesh position={[-0.06, -0.05, 0.05]} castShadow><sphereGeometry args={[0.07, 6, 6]} /><meshToonMaterial color="#361502" gradientMap={toonTexture} /></mesh>
        <mesh position={[0, -0.07, -0.06]} castShadow><sphereGeometry args={[0.08, 6, 6]} /><meshToonMaterial color="#451A03" gradientMap={toonTexture} /></mesh>

        {/* Fronds */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <group key={i} rotation={[0.4, angle, 0.3]}>
              <mesh position={[0, 0.25, 0.6]} rotation={[0.5, 0, 0]} castShadow>
                <boxGeometry args={[0.28, 0.03, 1.3]} />
                <meshToonMaterial color={i % 2 === 0 ? '#16A34A' : '#22C55E'} gradientMap={toonTexture} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

function BeachPalmTrees() {
  const palmList = useMemo(() => [
    { p: [6.8, 0.18, 4.5] as [number, number, number], s: 1.05, r: [0, -0.4, 0] as [number, number, number] },
    { p: [6.2, 0.18, 2.2] as [number, number, number], s: 0.95, r: [0, 0.6, 0] as [number, number, number] },
  ], []);

  return (
    <group>
      {palmList.map((palm, i) => (
        <SinglePalmTree key={i} pos={palm.p} scale={palm.s} rot={palm.r} />
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   🏊 ANIMATED PEOPLE SWIMMING & HAVING FUN ON THE BEACH
   ═══════════════════════════════════════════════════════════════ */
function BeachPeopleAndSwimmers() {
  const swimmer1Ref = useRef<THREE.Group>(null);
  const swimmer2Ref = useRef<THREE.Group>(null);
  const wavingArmRef = useRef<THREE.Mesh>(null);
  const beachBallRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Swimmer 1 in duck tube bobbing
    if (swimmer1Ref.current) {
      swimmer1Ref.current.position.y = -0.05 + Math.sin(t * 2.2) * 0.08;
      swimmer1Ref.current.rotation.z = Math.sin(t * 1.5) * 0.06;
    }

    // Swimmer 2 freestyle stroke
    if (swimmer2Ref.current) {
      swimmer2Ref.current.position.x = 4.5 + Math.sin(t * 0.5) * 0.8;
      swimmer2Ref.current.position.y = -0.08 + Math.sin(t * 3.0) * 0.05;
    }

    // Waving arm on shoreline
    if (wavingArmRef.current) {
      wavingArmRef.current.rotation.z = 0.6 + Math.sin(t * 5.0) * 0.5;
    }

    // Beach ball bouncing between friends
    if (beachBallRef.current) {
      const cycle = (t * 1.5) % 1.0;
      const x = 0.5 + cycle * 1.0;
      const y = 0.35 + Math.sin(cycle * Math.PI) * 0.7;
      beachBallRef.current.position.set(x, y, 6.4);
    }
  });

  return (
    <group>
      {/* 🏊 Swimmer 1 (with Inflatable Yellow/Orange Donut Tube) */}
      <group ref={swimmer1Ref} position={[-5.5, 0, 8.2]}>
        {/* Inflatable Swim Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.32, 0.12, 10, 18]} />
          <meshToonMaterial color="#F97316" gradientMap={toonTexture} />
        </mesh>
        {/* Swimmer Body / Head */}
        <mesh position={[0, 0.22, 0]}>
          <sphereGeometry args={[0.16, 10, 10]} />
          <meshToonMaterial color="#FDBA74" gradientMap={toonTexture} />
        </mesh>
        {/* Sunglasses */}
        <mesh position={[0, 0.24, 0.14]}>
          <boxGeometry args={[0.18, 0.06, 0.04]} />
          <meshBasicMaterial color="#0F172A" />
        </mesh>
        {/* Splashing Arms */}
        <mesh position={[0.3, 0.05, 0.1]} rotation={[0, 0, 0.4]}>
          <capsuleGeometry args={[0.04, 0.22, 4, 8]} />
          <meshToonMaterial color="#FDBA74" gradientMap={toonTexture} />
        </mesh>
        <mesh position={[-0.3, 0.05, 0.1]} rotation={[0, 0, -0.4]}>
          <capsuleGeometry args={[0.04, 0.22, 4, 8]} />
          <meshToonMaterial color="#FDBA74" gradientMap={toonTexture} />
        </mesh>
      </group>

      {/* 🏊 Swimmer 2 (Freestyle Swimmer in Turquoise Bay) */}
      <group ref={swimmer2Ref} position={[4.5, 0, 7.6]}>
        {/* Head */}
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.14, 10, 10]} />
          <meshToonMaterial color="#FBBF24" gradientMap={toonTexture} />
        </mesh>
        {/* Swim Cap */}
        <mesh position={[0, 0.14, -0.02]}>
          <sphereGeometry args={[0.142, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshBasicMaterial color="#EF4444" />
        </mesh>
        {/* Arms */}
        <mesh position={[0.2, 0.08, 0.1]} rotation={[0.4, 0, 0.6]}>
          <capsuleGeometry args={[0.04, 0.25, 4, 8]} />
          <meshToonMaterial color="#FBBF24" gradientMap={toonTexture} />
        </mesh>
      </group>

      {/* 🏖️ Sunbather Relaxing on Striped Towel with Parasol */}
      <group position={[-3.6, 0.32, 6.5]}>
        {/* Striped Beach Towel */}
        <mesh rotation={[-Math.PI / 2, 0, 0.2]}>
          <planeGeometry args={[0.7, 1.3]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
        {/* Lounging Person Body */}
        <mesh position={[0, 0.06, 0]} rotation={[0, 0.2, 0]}>
          <capsuleGeometry args={[0.09, 0.6, 4, 8]} />
          <meshToonMaterial color="#FDBA74" gradientMap={toonTexture} />
        </mesh>
        {/* Head with Sunhat */}
        <mesh position={[-0.05, 0.12, -0.32]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshToonMaterial color="#FDBA74" gradientMap={toonTexture} />
        </mesh>
        <mesh position={[-0.05, 0.18, -0.32]}>
          <cylinderGeometry args={[0.22, 0.22, 0.02, 10]} />
          <meshBasicMaterial color="#FDE047" />
        </mesh>

        {/* Colorful Beach Parasol Umbrella */}
        <group position={[0.5, 0, -0.2]} rotation={[0.15, 0, -0.2]}>
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.02, 0.03, 1.4, 6]} />
            <meshToonMaterial color="#FFFFFF" gradientMap={toonTexture} />
          </mesh>
          <mesh position={[0, 1.35, 0]}>
            <coneGeometry args={[0.75, 0.35, 10]} />
            <meshToonMaterial color="#EC4899" gradientMap={toonTexture} />
          </mesh>
        </group>
      </group>

      {/* 🙋 Shoreline Waving Character */}
      <group position={[2.8, 0.32, 6.2]} rotation={[0, -0.5, 0]}>
        {/* Body (T-shirt & Shorts) */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.26, 0.35, 0.18]} />
          <meshToonMaterial color="#10B981" gradientMap={toonTexture} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.24, 0.2, 0.16]} />
          <meshToonMaterial color="#1E293B" gradientMap={toonTexture} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.68, 0]} castShadow>
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshToonMaterial color="#FDBA74" gradientMap={toonTexture} />
        </mesh>
        {/* Left Arm (Relaxed) */}
        <mesh position={[-0.18, 0.35, 0]}>
          <capsuleGeometry args={[0.04, 0.25, 4, 8]} />
          <meshToonMaterial color="#FDBA74" gradientMap={toonTexture} />
        </mesh>
        {/* Right Arm (Waving!) */}
        <mesh ref={wavingArmRef} position={[0.18, 0.48, 0]}>
          <capsuleGeometry args={[0.04, 0.28, 4, 8]} />
          <meshToonMaterial color="#FDBA74" gradientMap={toonTexture} />
        </mesh>
      </group>

      {/* 🏐 Beach Ball Playful Duo */}
      <group position={[0, 0, 0]}>
        {/* Friend A */}
        <group position={[0.4, 0.32, 6.4]}>
          <mesh position={[0, 0.35, 0]} castShadow><boxGeometry args={[0.24, 0.32, 0.16]} /><meshToonMaterial color="#3B82F6" gradientMap={toonTexture} /></mesh>
          <mesh position={[0, 0.62, 0]} castShadow><sphereGeometry args={[0.11, 8, 8]} /><meshToonMaterial color="#FDBA74" gradientMap={toonTexture} /></mesh>
        </group>
        {/* Friend B */}
        <group position={[1.5, 0.32, 6.4]}>
          <mesh position={[0, 0.35, 0]} castShadow><boxGeometry args={[0.24, 0.32, 0.16]} /><meshToonMaterial color="#EC4899" gradientMap={toonTexture} /></mesh>
          <mesh position={[0, 0.62, 0]} castShadow><sphereGeometry args={[0.11, 8, 8]} /><meshToonMaterial color="#FDBA74" gradientMap={toonTexture} /></mesh>
        </group>
        {/* Bouncing Beach Ball */}
        <mesh ref={beachBallRef} position={[0.9, 0.6, 6.4]} castShadow>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshToonMaterial color="#FACC15" gradientMap={toonTexture} />
        </mesh>
      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COSMIC SKY BODIES
   ═══════════════════════════════════════════════════════════════ */
function CosmicSky() {
  return (
    <group>
      <Stars radius={60} depth={45} count={2000} factor={4.5} saturation={0.9} fade speed={1} />
      <group position={[-15, 19, -26]}>
        <mesh><sphereGeometry args={[2.4, 22, 22]} /><meshToonMaterial color="#CBD5E1" gradientMap={toonTexture} /></mesh>
      </group>
      <group position={[-5.5, 21, -23]} rotation={[0.3, 0.2, 0.15]}>
        <mesh><sphereGeometry args={[2.0, 24, 24]} /><meshToonMaterial color="#EAB308" gradientMap={toonTexture} /></mesh>
        <mesh rotation={[Math.PI / 2.5, 0, 0]}><torusGeometry args={[3.5, 0.28, 4, 32]} /><meshToonMaterial color="#FDE68A" gradientMap={toonTexture} /></mesh>
      </group>
      <Float speed={2.2} floatIntensity={1.1} rotationIntensity={0.35}>
        <group position={[2.5, 20, -19]} scale={[0.75, 0.75, 0.75]}>
          <mesh position={[0, 0.55, 0]}><sphereGeometry args={[0.95, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshBasicMaterial color="#67E8F9" transparent opacity={0.7} /></mesh>
          <mesh position={[0, 0.5, 0]}><sphereGeometry args={[0.32, 12, 12]} /><meshToonMaterial color="#22C55E" gradientMap={toonTexture} /></mesh>
          <mesh><cylinderGeometry args={[1.7, 2.0, 0.32, 24]} /><meshToonMaterial color="#94A3B8" gradientMap={toonTexture} /></mesh>
          <pointLight color="#38BDF8" intensity={2.5} distance={8} />
        </group>
      </Float>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MASTER 3D SCENE WITH SEA LIFE & BIG CARGO SHIPS
   ═══════════════════════════════════════════════════════════════ */
function IslandWorldScene() {
  return (
    <>
      <color attach="background" args={['#071326']} />
      <fog attach="fog" args={['#071326', 28, 68]} />

      <ambientLight intensity={2.2} color="#FFFFFF" />
      <directionalLight castShadow position={[16, 26, 16]} intensity={2.4} color="#FFFBEB" shadow-mapSize={[1024, 1024]} />
      <hemisphereLight args={['#87CEEB', '#22C55E', 0.65]} />

      <SmoothParallaxCamera />
      <CosmicSky />
      <FlowingOcean />

      {/* 🐬 Animated Dolphin Pods Leaping in the Sea */}
      <DolphinPod basePos={[8, 0, 7.5]} speed={1.1} />
      <DolphinPod basePos={[-13.5, 0, 2.5]} speed={0.9} />

      {/* 🐟 Swimming Fish Schools in Clear Ocean Bays */}
      <FishSchools centerPos={[4.5, 0, 6.5]} count={8} radius={3.2} />
      <FishSchools centerPos={[-5.5, 0, 8.5]} count={6} radius={2.8} />

      {/* 🚢 Big Container Cargo Ships Cruising in Deep Outer Sea */}
      <ContainerCargoShip pos={[15.5, 0, -11.5]} rotY={-0.6} />
      <ContainerCargoShip pos={[-16.5, 0, 8.5]} rotY={0.8} />

      {/* Scaled Island Group */}
      <group scale={[0.88, 0.88, 0.88]}>
        <IslandTerrain />
        <BeachPalmTrees />
        <BeachPeopleAndSwimmers />

        {/* 3D Landmarks */}
        <Volcano />
        <WaterfallCliffs />
        <SunTemple />
        <PirateShip />
        <Lighthouse />
        <LighthouseSideShips />
        <MoaiStatues />
        <SkullCave />
        <IceShelfIgloo />

        {/* ══════════════════════════════════════════════════════════
            RECTANGULAR ADVENTURE PARCHMENT NAME TAGS
            ══════════════════════════════════════════════════════════ */}
        {/* Chapter 1: Moai Coast (Bottom-Left) */}
        <ChapterNameTag3D
          pos={[-4.5, 3.8, 5.8]}
          num={1}
          icon="🗿"
          title="Starter Cove"
          levelId="level-1"
        />

        {/* Chapter 2: Sun Temple (Center-Bottom) */}
        <ChapterNameTag3D
          pos={[-1.2, 4.2, 2.8]}
          num={2}
          icon="🏛️"
          title="Sun Temple"
          levelId="level-2"
        />

        {/* Chapter 3: Whispering Jungle (Center) */}
        <ChapterNameTag3D
          pos={[0.2, 4.0, -1.6]}
          num={3}
          icon="🌴"
          title="Whispering Jungle"
          levelId="level-3"
        />

        {/* Chapter 4: Crystal Waterfall (Mid-Left) */}
        <ChapterNameTag3D
          pos={[-7.2, 5.2, -1.8]}
          num={4}
          icon="🌊"
          title="Crystal Waterfall"
          levelId="level-4"
        />

        {/* Chapter 5: Volcano Peak (Center-Top) */}
        <ChapterNameTag3D
          pos={[3.5, 9.8, -5.2]}
          num={5}
          icon="🌋"
          title="Volcano Peak"
          levelId="level-5"
        />

        {/* Chapter 6: Pirate Galleon (Bottom-Right) */}
        <ChapterNameTag3D
          pos={[9.5, 5.4, 3.2]}
          num={6}
          icon="⛵"
          title="Pirate Galleon"
          levelId="level-6"
        />
      </group>
    </>
  );
}

export default function StoryWorldBackground() {
  return (
    <div id="three-bg" className="fixed inset-0 z-0 pointer-events-auto overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 24, 20], fov: 38 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <IslandWorldScene />
      </Canvas>
    </div>
  );
}
