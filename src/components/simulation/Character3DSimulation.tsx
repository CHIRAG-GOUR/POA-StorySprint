import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, Torus, Cylinder, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { CharacterArchetype } from '../../types/story';

// ── 🌀 1. NARUTO: 3D Sage Chakra & Rasengan Core Simulation (Pure Electric Blue) ──
interface Naruto3DProps {
  spinSpeed: number;
  senjutsuRatio: number;
  gateAngle: number;
  isBalanced: boolean;
}

const NarutoChakraCore: React.FC<Naruto3DProps> = ({ spinSpeed, senjutsuRatio, gateAngle, isBalanced }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const outerSwirlRef = useRef<THREE.Mesh>(null);
  const ringGroup1Ref = useRef<THREE.Group>(null);
  const ringGroup2Ref = useRef<THREE.Group>(null);
  const ringGroup3Ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const speedMult = 1 + (spinSpeed / 100) * 4.5;
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 3 * speedMult;
      coreRef.current.rotation.x += delta * 2 * speedMult;
    }
    if (outerSwirlRef.current) {
      outerSwirlRef.current.rotation.y -= delta * 4 * speedMult;
      outerSwirlRef.current.rotation.z += delta * 2.5 * speedMult;
    }
    if (ringGroup1Ref.current) {
      ringGroup1Ref.current.rotation.z += delta * 3.2 * speedMult;
      ringGroup1Ref.current.rotation.x += delta * 1.5 * speedMult;
    }
    if (ringGroup2Ref.current) {
      ringGroup2Ref.current.rotation.y -= delta * 2.8 * speedMult;
      ringGroup2Ref.current.rotation.z -= delta * 2.1 * speedMult;
    }
    if (ringGroup3Ref.current) {
      ringGroup3Ref.current.rotation.x += delta * 3.5 * speedMult;
      ringGroup3Ref.current.rotation.y += delta * 2.0 * speedMult;
    }
  });

  // Pure Blue & Cyan Rasengan Palette
  const blueCoreColor = '#00f0ff';
  const blueEmissive = isBalanced ? '#00f0ff' : '#0284c7';

  // 12 Orbital Chakra Swirl Line Angles
  const ringAngles = [
    { rot: [gateAngle * (Math.PI / 180), 0, 0], rad: 1.4, tube: 0.02, col: '#00f0ff', em: '#38bdf8' },
    { rot: [0, (gateAngle + 45) * (Math.PI / 180), 0], rad: 1.55, tube: 0.022, col: '#38bdf8', em: '#0284c7' },
    { rot: [0, 0, (gateAngle + 90) * (Math.PI / 180)], rad: 1.7, tube: 0.02, col: '#67e8f9', em: '#00f0ff' },
    { rot: [(gateAngle + 30) * (Math.PI / 180), (gateAngle + 60) * (Math.PI / 180), 0], rad: 1.85, tube: 0.025, col: '#0284c7', em: '#38bdf8' },
    { rot: [-(gateAngle + 60) * (Math.PI / 180), 0, (gateAngle + 120) * (Math.PI / 180)], rad: 2.0, tube: 0.02, col: '#00f0ff', em: '#7dd3fc' },
    { rot: [0, -(gateAngle + 75) * (Math.PI / 180), (gateAngle + 30) * (Math.PI / 180)], rad: 2.15, tube: 0.024, col: '#38bdf8', em: '#0284c7' },
    { rot: [(gateAngle + 105) * (Math.PI / 180), 0, -(gateAngle + 45) * (Math.PI / 180)], rad: 2.3, tube: 0.018, col: '#67e8f9', em: '#00f0ff' },
    { rot: [-(gateAngle + 40) * (Math.PI / 180), (gateAngle + 110) * (Math.PI / 180), 0], rad: 2.45, tube: 0.022, col: '#00f0ff', em: '#38bdf8' }
  ];

  return (
    <group>
      {/* Central High-Density Rasengan Energy Core */}
      <Sphere ref={coreRef} args={[1.05, 32, 32]}>
        <meshStandardMaterial
          color={blueCoreColor}
          emissive={blueEmissive}
          emissiveIntensity={isBalanced ? 3.5 : 2.0}
          roughness={0.05}
          metalness={0.1}
          wireframe={!isBalanced}
        />
      </Sphere>

      {/* Innermost Glowing White-Cyan Sphere */}
      <Sphere args={[0.7, 24, 24]}>
        <meshBasicMaterial color="#e0f7ff" />
      </Sphere>

      {/* Rapid Swirling Outer Wireframe Chakra Filament Shell */}
      <Sphere ref={outerSwirlRef} args={[1.25, 24, 24]}>
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#38bdf8"
          emissiveIntensity={2.5}
          wireframe
          transparent
          opacity={0.85}
        />
      </Sphere>

      {/* Group 1: High-Speed Inner Swirling Chakra Rings */}
      <group ref={ringGroup1Ref}>
        {ringAngles.slice(0, 3).map((r, i) => (
          <Torus key={`r1-${i}`} args={[r.rad, r.tube, 16, 64]} rotation={r.rot as [number, number, number]}>
            <meshStandardMaterial color={r.col} emissive={r.em} emissiveIntensity={isBalanced ? 3.2 : 2.0} />
          </Torus>
        ))}
      </group>

      {/* Group 2: Cross-Axial Swirling Vortex Lines */}
      <group ref={ringGroup2Ref}>
        {ringAngles.slice(3, 6).map((r, i) => (
          <Torus key={`r2-${i}`} args={[r.rad, r.tube, 16, 64]} rotation={r.rot as [number, number, number]}>
            <meshStandardMaterial color={r.col} emissive={r.em} emissiveIntensity={isBalanced ? 3.0 : 1.8} />
          </Torus>
        ))}
      </group>

      {/* Group 3: Outer Orbital Spiral Chakra Ribbons */}
      <group ref={ringGroup3Ref}>
        {ringAngles.slice(6).map((r, i) => (
          <Torus key={`r3-${i}`} args={[r.rad, r.tube, 16, 64]} rotation={r.rot as [number, number, number]}>
            <meshStandardMaterial color={r.col} emissive={r.em} emissiveIntensity={isBalanced ? 2.8 : 1.6} />
          </Torus>
        ))}
      </group>

      {/* 3 Pure Blue Sage Convergence Gate Pillars */}
      {[0, 120, 240].map((deg, i) => {
        const rad = (deg + gateAngle) * (Math.PI / 180);
        const x = Math.cos(rad) * 2.5;
        const z = Math.sin(rad) * 2.5;
        return (
          <group key={i} position={[x, 0, z]}>
            <Cylinder args={[0.07, 0.11, 0.95, 16]}>
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.15} />
            </Cylinder>
            <Sphere args={[0.18, 16, 16]} position={[0, 0.58, 0]}>
              <meshStandardMaterial
                color="#00f0ff"
                emissive="#0284c7"
                emissiveIntensity={3.5}
              />
            </Sphere>
          </group>
        );
      })}

    </group>
  );
};

// ── 🐉 2. GOKU: 3D Capsule Corp Ki Matrix & 4-Star Dragon Ball ──
interface Goku3DProps {
  gravityLevel: number;
  kiPulseFreq: number;
  harmonicAngle: number;
  isBalanced: boolean;
}

const GokuDragonBallKi: React.FC<Goku3DProps> = ({ gravityLevel, kiPulseFreq, harmonicAngle, isBalanced }) => {
  const ballRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const speed = 1 + (kiPulseFreq / 100) * 3;
    if (ballRef.current) {
      ballRef.current.rotation.y += delta * 0.8 * speed;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 1.5 * speed;
      ringRef.current.rotation.x += delta * 0.5;
    }
  });

  return (
    <group>
      {/* 4-Star Dragon Ball with Translucent Shell */}
      <group ref={ballRef}>
        <Sphere args={[1.3, 32, 32]}>
          <meshPhysicalMaterial
            color="#f97316"
            emissive="#ea580c"
            emissiveIntensity={isBalanced ? 1.8 : 0.6}
            roughness={0.05}
            transmission={0.65}
            thickness={1.2}
            ior={1.45}
            transparent
            opacity={0.92}
          />
        </Sphere>

        {/* 4 Internal Glowing Red Stars */}
        {[
          [-0.3, 0.3, 0.2],
          [0.3, 0.3, -0.2],
          [-0.3, -0.3, -0.2],
          [0.3, -0.3, 0.2]
        ].map((pos, idx) => (
          <Sphere key={idx} args={[0.13, 12, 12]} position={pos as [number, number, number]}>
            <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={4} />
          </Sphere>
        ))}
      </group>

      {/* Super Saiyan Golden Ki Orbit Rings */}
      <Torus ref={ringRef} args={[1.9, 0.05, 16, 64]} rotation={[harmonicAngle * (Math.PI / 180), 0, 0]}>
        <meshStandardMaterial color="#facc15" emissive="#fbbf24" emissiveIntensity={isBalanced ? 3 : 1.5} />
      </Torus>

      {/* Gravity Chamber Sensor Ring */}
      <Ring args={[2.3, 2.5, 32]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#3b82f6" emissive="#60a5fa" emissiveIntensity={1} side={THREE.DoubleSide} />
      </Ring>

    </group>
  );
};

// ── 🥢 3. PO (KUNG FU PANDA): 3D Oogway's Jade Staff & Spirit Portal ──
interface Po3DProps {
  waterStillness: number;
  chiBalance: number;
  mirrorAngle: number;
  isBalanced: boolean;
}

const PoJadeStaff: React.FC<Po3DProps> = ({ waterStillness, chiBalance, mirrorAngle, isBalanced }) => {
  const staffRef = useRef<THREE.Group>(null);
  const orbRef = useRef<THREE.Mesh>(null);
  const portalRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const spinSpeed = 0.5 + (mirrorAngle / 100) * 3;
    if (orbRef.current) {
      orbRef.current.rotation.y += delta * spinSpeed;
      orbRef.current.rotation.z += delta * 0.3;
    }
    if (portalRef.current) {
      portalRef.current.rotation.z -= delta * 1.5 * spinSpeed;
    }
    if (staffRef.current) {
      staffRef.current.rotation.y += delta * 0.15;
    }
  });

  const portalScale = isBalanced ? 1.0 : Math.max(0.2, chiBalance / 100);

  return (
    <group ref={staffRef} scale={[0.65, 0.65, 0.65]} position={[0, -0.6, 0]}>
      {/* Jade Staff Shaft */}
      <Cylinder args={[0.08, 0.1, 4.5, 12]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#065f46"
          emissive="#10b981"
          emissiveIntensity={isBalanced ? 1.2 : 0.3}
          roughness={0.25}
          metalness={0.6}
        />
      </Cylinder>

      {/* Gold ornamental bands on shaft */}
      {[-1.2, -0.2, 0.8, 1.6].map((y, i) => (
        <Torus key={i} args={[0.12, 0.03, 8, 16]} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial
            color="#facc15"
            emissive="#eab308"
            emissiveIntensity={isBalanced ? 2 : 0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </Torus>
      ))}

      {/* Forked cradle at the top */}
      <Cylinder args={[0.04, 0.06, 0.6, 8]} position={[-0.15, 2.5, 0]} rotation={[0, 0, 0.3]}>
        <meshStandardMaterial color="#065f46" emissive="#059669" emissiveIntensity={0.5} roughness={0.3} metalness={0.7} />
      </Cylinder>
      <Cylinder args={[0.04, 0.06, 0.6, 8]} position={[0.15, 2.5, 0]} rotation={[0, 0, -0.3]}>
        <meshStandardMaterial color="#065f46" emissive="#059669" emissiveIntensity={0.5} roughness={0.3} metalness={0.7} />
      </Cylinder>

      {/* Glowing Jade Orb at the top of staff */}
      <Sphere ref={orbRef} args={[0.35, 32, 32]} position={[0, 2.7, 0]}>
        <meshPhysicalMaterial
          color={isBalanced ? '#6ee7b7' : '#10b981'}
          emissive={isBalanced ? '#34d399' : '#059669'}
          emissiveIntensity={isBalanced ? 3.5 : 1.2}
          roughness={0.05}
          transmission={0.5}
          thickness={0.8}
          ior={1.5}
          transparent
          opacity={0.95}
        />
      </Sphere>

      {/* Yin-Yang disc inside the orb */}
      <Ring args={[0, 0.2, 32]} position={[0, 2.7, 0.2]} rotation={[0, 0, mirrorAngle * Math.PI / 180]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={isBalanced ? 2 : 0.5}
          side={THREE.DoubleSide}
        />
      </Ring>

      {/* Spirit Portal Vortex (appears as tuning improves) */}
      <group ref={portalRef} position={[1.8, 1.2, 0]} scale={[portalScale, portalScale, portalScale]}>
        {/* Portal outer rings */}
        {[0, 1, 2].map((i) => (
          <Torus key={i} args={[1.2 - i * 0.25, 0.04, 16, 48]} rotation={[Math.PI / 2 + i * 0.2, i * 0.3, 0]}>
            <meshStandardMaterial
              color={i % 2 === 0 ? '#10b981' : '#facc15'}
              emissive={i % 2 === 0 ? '#34d399' : '#fbbf24'}
              emissiveIntensity={isBalanced ? 3 : 1}
              transparent
              opacity={0.6 + portalScale * 0.4}
            />
          </Torus>
        ))}

        {/* Portal core */}
        <Sphere args={[0.3, 24, 24]}>
          <meshStandardMaterial
            color="#ffffff"
            emissive="#6ee7b7"
            emissiveIntensity={isBalanced ? 5 : 2}
            transparent
            opacity={0.8}
          />
        </Sphere>
      </group>

    </group>
  );
};

// ── 🦾 4. IRON MAN: 3D Stark Industries Advanced Nanotech Arc Reactor ──
interface IronMan3DProps {
  magneticTesla: number;
  plasmaFlux: number;
  nanotechFreq: number;
  isBalanced: boolean;
}

const IronManArcReactor: React.FC<IronMan3DProps> = ({ magneticTesla, plasmaFlux, nanotechFreq, isBalanced }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Group>(null);
  const hudRingRef = useRef<THREE.Mesh>(null);
  const nanoShellRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const speed = 1 + (plasmaFlux / 100) * 4;
    if (coreRef.current) {
      coreRef.current.rotation.z += delta * 3 * speed;
      coreRef.current.rotation.y += delta * 1.5;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= delta * 2.5 * speed;
      innerRingRef.current.rotation.x += delta * 0.8;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 1.2 * speed;
      outerRingRef.current.rotation.y -= delta * 0.5;
    }
    if (hudRingRef.current) {
      hudRingRef.current.rotation.z += delta * 0.8;
      hudRingRef.current.rotation.x += delta * 0.4;
    }
    if (nanoShellRef.current) {
      nanoShellRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group>
      {/* Outer Nanotech Titanium-Gold Shell */}
      <Sphere ref={nanoShellRef} args={[2.2, 16, 16]}>
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.95}
          roughness={0.1}
          wireframe
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* Inner Titanium Chassis Ring */}
      <Cylinder args={[1.9, 2.0, 0.35, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.1} />
      </Cylinder>

      {/* Red-Gold Outer Armor Ring */}
      <Torus args={[1.95, 0.08, 8, 48]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="#dc2626"
          emissive="#ef4444"
          emissiveIntensity={isBalanced ? 2 : 0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </Torus>

      {/* Bright Cyan Plasma Core */}
      <Cylinder ref={coreRef} args={[0.7, 0.7, 0.5, 24]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhysicalMaterial
          color="#06b6d4"
          emissive="#22d3ee"
          emissiveIntensity={isBalanced ? 6 : 2.5}
          roughness={0.05}
          transmission={0.4}
          thickness={0.5}
          ior={1.3}
          transparent
          opacity={0.95}
        />
      </Cylinder>

      {/* Inner White-hot Core Sphere */}
      <Sphere args={[0.3, 24, 24]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#67e8f9"
          emissiveIntensity={isBalanced ? 8 : 3}
        />
      </Sphere>

      {/* 10 Copper-Gold Electromagnetic Coils (inner ring) */}
      <group ref={innerRingRef}>
        {Array.from({ length: 10 }).map((_, i) => {
          const deg = (i * 36 * Math.PI) / 180;
          const x = Math.cos(deg) * 1.35;
          const y = Math.sin(deg) * 1.35;
          return (
            <mesh key={i} position={[x, y, 0]} rotation={[0, 0, deg]}>
              <boxGeometry args={[0.2, 0.3, 0.4]} />
              <meshStandardMaterial
                color="#facc15"
                emissive="#eab308"
                emissiveIntensity={isBalanced ? 2 : 0.6}
                metalness={0.9}
                roughness={0.15}
              />
            </mesh>
          );
        })}
      </group>

      {/* 6 Outer Repulsor Nodes (red) */}
      <group ref={outerRingRef}>
        {Array.from({ length: 6 }).map((_, i) => {
          const deg = (i * 60 * Math.PI) / 180;
          const x = Math.cos(deg) * 1.75;
          const y = Math.sin(deg) * 1.75;
          return (
            <Sphere key={i} args={[0.12, 12, 12]} position={[x, y, 0]}>
              <meshStandardMaterial
                color="#dc2626"
                emissive="#ef4444"
                emissiveIntensity={isBalanced ? 4 : 1.5}
              />
            </Sphere>
          );
        })}
      </group>

      {/* Holographic HUD Target Ring */}
      <Ring ref={hudRingRef} args={[2.3, 2.35, 48]}>
        <meshBasicMaterial color={isBalanced ? '#22d3ee' : '#38bdf8'} wireframe side={THREE.DoubleSide} />
      </Ring>

      {/* Second angled HUD ring */}
      <Ring args={[2.0, 2.05, 48]} rotation={[Math.PI / 4, 0, 0]}>
        <meshBasicMaterial color="#f87171" wireframe side={THREE.DoubleSide} transparent opacity={0.5} />
      </Ring>

    </group>
  );
};

// ── 🌟 MAIN HERO 3D SIMULATION CONTAINER ──
interface Character3DSimulationProps {
  hero: CharacterArchetype;
  onSuccess: () => void;
  isUnlocked: boolean;
}

export const Character3DSimulation: React.FC<Character3DSimulationProps> = ({ hero, onSuccess, isUnlocked }) => {
  // Slider states tailored to character
  const [param1, setParam1] = useState(40); // Naruto: Spin, Goku: Gravity, Po: Stillness, IronMan: Magnetic
  const [param2, setParam2] = useState(30); // Naruto: Sage, Goku: Ki Pulse, Po: Chi Balance, IronMan: Plasma
  const [param3, setParam3] = useState(60); // Naruto: Angle, Goku: Wave, Po: Mirror, IronMan: Frequency

  // Calculate resonance accuracy
  // Target zones: param1 in [70, 95], param2 in [65, 90], param3 in [75, 100]
  const p1Score = Math.max(0, 100 - Math.abs(param1 - 85) * 2.2);
  const p2Score = Math.max(0, 100 - Math.abs(param2 - 80) * 2.2);
  const p3Score = Math.max(0, 100 - Math.abs(param3 - 88) * 2.2);
  const overallStability = Math.round((p1Score + p2Score + p3Score) / 3);

  const isBalanced = isUnlocked || overallStability >= 85;

  useEffect(() => {
    if (isBalanced && !isUnlocked) {
      onSuccess();
    }
  }, [isBalanced, isUnlocked, onSuccess]);

  const handleAutoAlign = () => {
    setParam1(85);
    setParam2(80);
    setParam3(88);
  };

  // Hero labels and colors
  const heroId = hero.id;

  const simMetadata = {
    'hero-naruto': {
      title: '🌀 Sage Chakra Matrix & Rasengan Weaver',
      subtitle: 'Balance Spiritual Energy, Physical Energy, and Natural Sage Senjutsu to forge the Sacred Scroll!',
      param1Label: 'Chakra Spiral Velocity',
      param2Label: 'Sage Senjutsu Ratio',
      param3Label: 'Chakra Gate Convergence Angle',
      accentColor: 'from-cyan-500 to-blue-600',
      meterColor: 'bg-cyan-400',
      unit1: 'rpm',
      unit2: '%',
      unit3: '°'
    },
    'hero-goku': {
      title: '🐉 Capsule Corp 100x Gravity Ki Harmonizer',
      subtitle: 'Calibrate Saiyan Ki Frequencies & Gravity Multipliers to locate and awaken the 4-Star Dragon Ball!',
      param1Label: 'Gravity Multiplier',
      param2Label: 'Kaio-ken Ki Pulse Rate',
      param3Label: 'Super Saiyan Harmonic Wave',
      accentColor: 'from-orange-500 to-blue-600',
      meterColor: 'bg-orange-500',
      unit1: 'G',
      unit2: 'Hz',
      unit3: '°'
    },
    'hero-po': {
      title: '🥢 Oogway\'s Jade Staff & Spirit Portal',
      subtitle: 'Channel Inner Peace through the Sacred Staff to open the Spirit Realm Portal and summon the Dragon Scroll!',
      param1Label: 'Inner Peace Chi Flow',
      param2Label: 'Staff Jade Orb Energy',
      param3Label: 'Portal Vortex Alignment',
      accentColor: 'from-emerald-500 to-amber-500',
      meterColor: 'bg-emerald-400',
      unit1: '%',
      unit2: 'Chi',
      unit3: '°'
    },
    'hero-ironman': {
      title: '🦾 Stark Holographic Arc Reactor Quantum Grid',
      subtitle: 'Synchronize the Magnetic Containment Coils and Plasma Flux to achieve 100% Clean Fusion!',
      param1Label: 'Magnetic Confinement Field',
      param2Label: 'Plasma Core Flux Rate',
      param3Label: 'Nanotech Harmonic Frequency',
      accentColor: 'from-red-500 to-amber-500',
      meterColor: 'bg-cyan-400',
      unit1: 'T',
      unit2: 'MW',
      unit3: 'GHz'
    }
  }[heroId] || {
    title: '⚡ Hero Relic Calibration Lab',
    subtitle: 'Tune the energy matrix parameters to unlock the legendary artifact.',
    param1Label: 'Primary Energy Flux',
    param2Label: 'Resonance Harmonic',
    param3Label: 'Vector Convergence',
    accentColor: 'from-purple-500 to-indigo-600',
    meterColor: 'bg-purple-400',
    unit1: '%',
    unit2: '%',
    unit3: '°'
  };

  return (
    <div className="flex flex-col gap-5 w-full bg-slate-950/90 rounded-3xl p-5 sm:p-7 border-2 border-slate-700/80 backdrop-blur-xl shadow-2xl text-white">
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/15">
        <div>
          <span className="text-[11px] font-nunito font-black uppercase tracking-widest text-amber-400 block">
            3D Physical Simulation Lab
          </span>
          <h3 className="font-display font-black text-xl sm:text-2xl text-white drop-shadow-md">
            {simMetadata.title}
          </h3>
          <p className="font-nunito text-xs text-slate-300 max-w-2xl mt-0.5">
            {simMetadata.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={handleAutoAlign}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-black text-xs shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>⚡ Auto-Align Simulation</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Stage */}
      <div className="relative w-full h-72 sm:h-84 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-slate-700 shadow-inner">
        <Canvas camera={{ position: [0, 1.5, 5], fov: 48 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 5]} intensity={1.5} />
          <pointLight position={[-5, -2, -5]} intensity={0.8} color="#38bdf8" />
          
          <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.5}>
            {heroId === 'hero-naruto' && (
              <NarutoChakraCore
                spinSpeed={param1}
                senjutsuRatio={param2}
                gateAngle={param3}
                isBalanced={isBalanced}
              />
            )}
            {heroId === 'hero-goku' && (
              <GokuDragonBallKi
                gravityLevel={param1}
                kiPulseFreq={param2}
                harmonicAngle={param3}
                isBalanced={isBalanced}
              />
            )}
            {heroId === 'hero-po' && (
              <PoJadeStaff
                waterStillness={param1}
                chiBalance={param2}
                mirrorAngle={param3}
                isBalanced={isBalanced}
              />
            )}
            {heroId === 'hero-ironman' && (
              <IronManArcReactor
                magneticTesla={param1}
                plasmaFlux={param2}
                nanotechFreq={param3}
                isBalanced={isBalanced}
              />
            )}
          </Float>

          <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 1.7} minPolarAngle={Math.PI / 3} />
        </Canvas>

        {/* Live Stability Gauge Overlay */}
        <div className="absolute top-3 left-3 px-3.5 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-xs font-nunito font-extrabold text-white flex items-center gap-2 shadow-lg">
          <span className={`w-2.5 h-2.5 rounded-full ${isBalanced ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
          <span>Matrix Stability: <strong className={isBalanced ? 'text-emerald-300 font-black' : 'text-amber-300'}>{overallStability}%</strong></span>
        </div>

        {isBalanced && (
          <div className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-400 text-xs font-nunito font-black text-emerald-200 shadow-xl flex items-center gap-1.5">
            <span>✨ 100% HARMONIC LOCK ACHIEVED</span>
          </div>
        )}
      </div>

      {/* Interactive Calibration Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {/* Param 1 */}
        <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-nunito font-bold">
            <span className="text-slate-300">{simMetadata.param1Label}</span>
            <span className="font-black text-amber-300">{param1} {simMetadata.unit1}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={param1}
            onChange={(e) => setParam1(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-nunito">
            <span>Min</span>
            <span>Optimal (85)</span>
            <span>Max</span>
          </div>
        </div>

        {/* Param 2 */}
        <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-nunito font-bold">
            <span className="text-slate-300">{simMetadata.param2Label}</span>
            <span className="font-black text-cyan-300">{param2} {simMetadata.unit2}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={param2}
            onChange={(e) => setParam2(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-nunito">
            <span>Min</span>
            <span>Optimal (80)</span>
            <span>Max</span>
          </div>
        </div>

        {/* Param 3 */}
        <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-nunito font-bold">
            <span className="text-slate-300">{simMetadata.param3Label}</span>
            <span className="font-black text-emerald-300">{param3} {simMetadata.unit3}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={param3}
            onChange={(e) => setParam3(Number(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-nunito">
            <span>0°</span>
            <span>Optimal (88°)</span>
            <span>360°</span>
          </div>
        </div>
      </div>
    </div>
  );
};
