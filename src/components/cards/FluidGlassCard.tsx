import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface FluidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  blobColor1?: string;
  blobColor2?: string;
  blobColor3?: string;
}

export default function FluidGlassCard({
  children,
  className = '',
  blobColor1 = 'bg-purple-300',
  blobColor2 = 'bg-amber-300',
  blobColor3 = 'bg-pink-300'
}: FluidGlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth magnetic spring physics
  const springConfig = { damping: 26, stiffness: 140 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-[2.5rem] p-1.5 shadow-[0_20px_45px_-12px_rgba(100,50,200,0.18)] ${className}`}
    >
      {/* 1st Organic Blur Blob */}
      <motion.div
        className={`absolute w-80 h-80 ${blobColor1} rounded-[40%_60%_70%_30%] mix-blend-multiply opacity-70 blur-[60px] pointer-events-none`}
        style={{
          x: useTransform(smoothX, x => x * 0.75),
          y: useTransform(smoothY, y => y * 0.75),
          left: 'calc(50% - 10rem)',
          top: 'calc(50% - 10rem)',
        }}
        animate={{ rotate: 360, scale: [1, 1.15, 1] }}
        transition={{ rotate: { duration: 22, repeat: Infinity, ease: "linear" }, scale: { duration: 9, repeat: Infinity, ease: "easeInOut" } }}
      />

      {/* 2nd Organic Blur Blob */}
      <motion.div
        className={`absolute w-96 h-96 ${blobColor2} rounded-[60%_40%_30%_70%] mix-blend-multiply opacity-65 blur-[70px] pointer-events-none`}
        style={{
          x: useTransform(smoothX, x => x * -0.55),
          y: useTransform(smoothY, y => y * -0.55),
          left: 'calc(50% - 12rem)',
          top: 'calc(50% - 12rem)',
        }}
        animate={{ rotate: -360, scale: [1, 1.25, 1] }}
        transition={{ rotate: { duration: 26, repeat: Infinity, ease: "linear" }, scale: { duration: 11, repeat: Infinity, ease: "easeInOut" } }}
      />

      {/* 3rd Organic Blur Blob */}
      <motion.div
        className={`absolute w-72 h-72 ${blobColor3} rounded-[50%_50%_60%_40%] mix-blend-multiply opacity-65 blur-[55px] pointer-events-none`}
        style={{
          x: useTransform(smoothX, x => x * 0.35),
          y: useTransform(smoothY, y => y * 0.35),
          left: 'calc(50% - 9rem)',
          top: 'calc(50% - 9rem)',
        }}
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ rotate: { duration: 18, repeat: Infinity, ease: "linear" }, scale: { duration: 13, repeat: Infinity, ease: "easeInOut" } }}
      />

      {/* Front Glass Surface */}
      <div className="relative h-full w-full bg-white/70 backdrop-blur-[35px] border-[2.5px] border-white/80 rounded-[2.2rem] z-10 p-6 md:p-8 shadow-[inset_0_0_20px_rgba(255,255,255,0.7)] flex flex-col">
        {children}
      </div>
    </div>
  );
}
