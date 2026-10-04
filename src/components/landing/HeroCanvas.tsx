import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export const HeroCanvas: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
      // Empty for spline
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacityFade = useTransform(scrollY, [0, 600], [1, 0]);

  return (
    <motion.div 
      className="absolute inset-0 z-0 overflow-hidden"
      style={{ y: yParallax, opacity: opacityFade }}
    >
      <div className="absolute inset-0 bg-[#FFFFFF] dark:bg-[#10131A] transition-colors duration-700" />
      
      {/* 3D Spline Scene */}
      <div className="absolute inset-0 flex items-center justify-center opacity-80 mix-blend-luminosity dark:mix-blend-normal">
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-[#356AE6]/20 border-t-[#356AE6] animate-spin" />
          </div>
        }>
          <Spline scene="https://prod.spline.design/hFmF9iUmt1onPuGT/scene.splinecode" />
        </Suspense>
      </div>

      {/* Subtle Interaction Hint (Bottom) */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[10px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="relative flex items-center justify-center w-4 h-4">
          <div className="absolute w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full animate-ping opacity-75" />
          <div className="absolute w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full" />
        </div>
        <span>Interact with Canvas</span>
      </motion.div>
    </motion.div>
  );
};
