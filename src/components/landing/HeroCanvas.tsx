import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export const HeroCanvas: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates from -1 to 1
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacityFade = useTransform(scrollY, [0, 600], [1, 0]);

  return (
    <motion.div 
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      style={{ y: yParallax, opacity: opacityFade }}
    >
      {/* 
        The canvas uses white as the hero background in light mode,
        and deep charcoal (#10131A) in dark mode.
      */}
      <div className="absolute inset-0 bg-[#FFFFFF] dark:bg-[#10131A] transition-colors duration-700" />
      
      {/* Subtle abstract creator visuals */}
      <motion.div 
        className="absolute top-[10%] left-[15%] w-[400px] h-[300px] rounded-[100px] bg-blue-50/60 dark:bg-indigo-900/10 blur-[80px]"
        animate={{ 
          x: mousePosition.x * -20,
          y: mousePosition.y * -20
        }}
        transition={{ type: 'spring', stiffness: 40, damping: 20 }}
      />
      
      <motion.div 
        className="absolute bottom-[20%] right-[10%] w-[500px] h-[400px] rounded-full bg-[#F7F8FA] dark:bg-[#171B24] blur-[100px]"
        animate={{ 
          x: mousePosition.x * 30,
          y: mousePosition.y * 30
        }}
        transition={{ type: 'spring', stiffness: 35, damping: 25 }}
      />
      
      {/* Faint Timeline Fragments */}
      <motion.div 
        className="absolute top-[35%] right-[25%] opacity-20 dark:opacity-10"
        animate={{ 
          x: mousePosition.x * 40,
          y: mousePosition.y * 15
        }}
        transition={{ type: 'spring', stiffness: 20, damping: 30 }}
      >
        <div className="flex flex-col gap-2">
          <div className="h-1 w-32 bg-slate-300 dark:bg-slate-600 rounded-full" />
          <div className="h-1 w-48 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div className="h-1 w-24 bg-[#356AE6]/30 dark:bg-[#78A1FF]/30 rounded-full" />
        </div>
      </motion.div>

      {/* Soft Waveform Shape */}
      <motion.div 
        className="absolute bottom-[25%] left-[20%] opacity-[0.15] dark:opacity-[0.05]"
        animate={{ 
          x: mousePosition.x * -30,
          y: mousePosition.y * 25
        }}
        transition={{ type: 'spring', stiffness: 25, damping: 25 }}
      >
        <div className="flex items-end gap-1.5 h-12">
          {[40, 70, 45, 90, 60, 30, 80].map((h, i) => (
            <div 
              key={i} 
              className="w-1.5 bg-[#356AE6] dark:bg-[#78A1FF] rounded-full"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </motion.div>

      {/* Abstract Content Frame */}
      <motion.div 
        className="absolute top-[20%] left-[60%] w-64 h-36 border border-slate-200/50 dark:border-slate-700/30 rounded-2xl opacity-40 backdrop-blur-[2px]"
        animate={{ 
          x: mousePosition.x * 15,
          y: mousePosition.y * -10,
          rotate: mousePosition.x * 2
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 30 }}
      >
        <div className="absolute top-4 left-4 flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
      </motion.div>

      {/* Subtle Interaction Hint (Bottom) */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[10px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="relative flex items-center justify-center w-4 h-4">
          <div className="absolute w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full animate-ping opacity-75" />
          <div className="absolute w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full" />
        </div>
        <span>Explore the canvas</span>
      </motion.div>
    </motion.div>
  );
};
