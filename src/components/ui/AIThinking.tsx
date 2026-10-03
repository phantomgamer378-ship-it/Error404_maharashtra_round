import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Cpu, CheckCircle } from 'lucide-react';

interface AIThinkingProps {
  steps?: string[];
  durationMs?: number; // total duration
  onComplete?: () => void;
  className?: string;
  compact?: boolean;
}

export const DEFAULT_TREND_THINKING_STEPS = [
  'Comparing topic momentum & search spikes...',
  'Matching creator history & audience DNA...',
  'Finding underserved content gaps...',
  'Synthesizing opportunity evidence...'
];

export const DEFAULT_SCRIPT_THINKING_STEPS = [
  'Injecting Creator DNA tone (Educational + Humorous)...',
  'Crafting 3 curiosity hook angles...',
  'Timing 30-45s short-form script pacing...',
  'Assembling B-roll shot recommendations...'
];

export const AIThinking: React.FC<AIThinkingProps> = ({
  steps = DEFAULT_TREND_THINKING_STEPS,
  durationMs = 1400,
  onComplete,
  className = '',
  compact = false
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const stepInterval = Math.max(250, Math.floor(durationMs / steps.length));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          if (onComplete) {
            setTimeout(onComplete, 200);
          }
          return prev;
        }
      });
    }, stepInterval);

    return () => clearInterval(timer);
  }, [steps, stepInterval, onComplete]);

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 ${className}`}>
        <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
        <span className="font-mono text-[11px] truncate max-w-[240px]">{steps[currentStepIndex]}</span>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl glass-panel-l3 p-6 border border-indigo-500/30 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center ${className}`}>
      {/* Background ambient glow */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Animated Orb / Core */}
      <div className="relative mb-5">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.08, 1] }}
          transition={{ rotate: { duration: 6, repeat: Infinity, ease: 'linear' }, scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[2px] shadow-glow-primary flex items-center justify-center"
        >
          <div className="w-full h-full rounded-full bg-[#090b14] flex items-center justify-center">
            <Brain className="w-6 h-6 text-indigo-300 animate-pulse" />
          </div>
        </motion.div>
        {/* Pulsing ring */}
        <div className="absolute inset-0 rounded-full border border-indigo-400/40 animate-ping pointer-events-none" />
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-1.5 mb-3">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentStepIndex
                ? 'w-6 bg-indigo-400 shadow-glow-primary'
                : i < currentStepIndex
                ? 'w-2 bg-indigo-500/60'
                : 'w-2 bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* Current Step Text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="space-y-1"
        >
          <p className="text-sm font-semibold text-white tracking-wide">
            {steps[currentStepIndex]}
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            CreatorAi Reasoning Engine • Step {currentStepIndex + 1} of {steps.length}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
