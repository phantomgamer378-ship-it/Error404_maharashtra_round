import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Zap,
  Check,
  ArrowRight,
  BarChart3,
  Target,
  Brain,
  Clock,
  TrendingUp,
  MessageSquare,
  GitBranch,
} from 'lucide-react';
import { repurposeService, WhatIfVariant } from '../../lib/services/RepurposeService';
import { mockCreatorProfile } from '../../data/mockData';

// ─── Signal Score Ring (miniature) ──────────────────────────────────────────
const MiniScoreRing: React.FC<{ value: number; label: string; color: string }> = ({ value, label, color }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width="44" height="44" className="transform -rotate-90">
        <circle cx="22" cy="22" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <circle
          cx="22" cy="22" r={radius} fill="none"
          stroke={color} strokeWidth="3" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-white" style={{ marginTop: '12px' }}>{value}</span>
      <span className="text-[8px] font-mono text-slate-500 uppercase">{label}</span>
    </div>
  );
};

// ─── Props ──────────────────────────────────────────────────────────────────
interface WhatIfVariantEngineProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVariant: (hookText: string, duration: number, tone: string) => void;
  sourceHook?: string;
  sourceTopic?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────
export const WhatIfVariantEngine: React.FC<WhatIfVariantEngineProps> = ({
  isOpen,
  onClose,
  onApplyVariant,
  sourceHook = "If your mom calls asking for $500, STOP. Ask this 1 safe-word first.",
  sourceTopic = "AI Voice Scams",
}) => {
  const [variants, setVariants] = useState<WhatIfVariant[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const [expandedExplanation, setExpandedExplanation] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && variants.length === 0 && !isGenerating) {
      generateVariants();
    }
  }, [isOpen]);

  const generateVariants = useCallback(async () => {
    setIsGenerating(true);
    try {
      const tree = await repurposeService.generateContentTree(
        'proj-whatif',
        sourceTopic,
        sourceHook,
        '',
        '38s',
        [],
        mockCreatorProfile,
      );
      setVariants(tree.whatIfVariants);
      setSelectedId(tree.whatIfVariants[0]?.id || null);
    } catch (err) {
      console.error('WhatIf error:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [sourceTopic, sourceHook]);

  const handleApply = (variant: WhatIfVariant) => {
    setAppliedId(variant.id);
    onApplyVariant(variant.hookText, variant.duration, variant.tone);
    // Auto-close after brief feedback
    setTimeout(() => onClose(), 1200);
  };

  if (!isOpen) return null;

  const selectedVariant = variants.find(v => v.id === selectedId);

  // Color coding for tone
  const toneColors: Record<string, { bg: string; border: string; text: string }> = {
    'Educational': { bg: 'bg-indigo-500/20', border: 'border-indigo-500/30', text: 'text-indigo-300' },
    'Storytelling': { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-300' },
    'Humorous': { bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-300' },
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/70 backdrop-blur-md">
        {/* Backdrop click to close */}
        <div className="absolute inset-0 -z-10" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 30 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl glass-panel-l4 rounded-t-2xl sm:rounded-2xl border border-white/15 overflow-hidden shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh]"
        >
          {/* ─── HEADER ─── */}
          <div className="px-6 py-4 border-b border-white/10 bg-[#080910] flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
                  <Zap className="w-3 h-3" />
                  WHAT-IF ENGINE
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  3 variants • {sourceTopic}
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-white">
                Explore Hook Variants
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Compare 3 alternative hooks side-by-side. Signal-based indicators show estimated performance. Choose one and apply in 2 clicks.
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl glass-button text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ─── LOADING STATE ─── */}
          {isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center py-16 gap-4">
              <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
              <p className="text-amber-300 font-semibold text-sm">Generating 3 alternative hooks with signal analysis...</p>
            </div>
          )}

          {/* ─── VARIANT COMPARISON GRID ─── */}
          {!isGenerating && variants.length > 0 && (
            <div className="flex-1 overflow-y-auto p-6">
              {/* 3-Column Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {variants.map((v, idx) => {
                  const isSelected = selectedId === v.id;
                  const isApplied = appliedId === v.id;
                  const tone = toneColors[v.tone] || toneColors['Educational'];
                  const labels = ['A', 'B', 'C'];

                  return (
                    <motion.div
                      key={v.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.3 }}
                      onClick={() => setSelectedId(v.id)}
                      className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-3 ${
                        isApplied
                          ? 'border-emerald-400 bg-emerald-950/30 ring-2 ring-emerald-400/50 scale-[1.02]'
                          : isSelected
                          ? 'border-amber-400 bg-amber-950/20 ring-2 ring-amber-400/30'
                          : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                      }`}
                    >
                      {/* Applied badge */}
                      {isApplied && (
                        <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center gap-1 shadow-lg">
                          <Check className="w-3 h-3" /> Applied
                        </div>
                      )}

                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className={`w-6 h-6 rounded-lg ${tone.bg} ${tone.border} border flex items-center justify-center text-[10px] font-mono font-bold ${tone.text}`}>
                            {labels[idx]}
                          </span>
                          {v.label.split(' — ')[1] || v.label}
                        </span>
                        <div className={`px-2 py-0.5 rounded-full ${tone.bg} ${tone.border} border text-[9px] font-mono font-bold ${tone.text}`}>
                          {v.tone}
                        </div>
                      </div>

                      {/* Hook Text */}
                      <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                        <p className="text-white text-xs font-bold leading-snug">{v.hookText}</p>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{v.duration}s</span>
                      </div>

                      {/* Signal Scores */}
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="p-2 rounded-lg bg-white/[0.04] border border-white/5 flex items-center justify-between">
                          <span className="text-slate-400">Curiosity</span>
                          <span className="font-bold text-amber-300">{v.curiosityScore}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white/[0.04] border border-white/5 flex items-center justify-between">
                          <span className="text-slate-400">Audience Fit</span>
                          <span className="font-bold text-cyan-300">{v.audienceFitScore}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white/[0.04] border border-white/5 flex items-center justify-between">
                          <span className="text-slate-400">Creator Fit</span>
                          <span className="font-bold text-indigo-300">{v.creatorFitScore}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white/[0.04] border border-white/5 flex items-center justify-between">
                          <span className="text-slate-400">Est. Opportunity</span>
                          <span className="font-bold text-emerald-300">{v.estimatedOpportunityScore}</span>
                        </div>
                      </div>

                      {/* Expand Explanation */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedExplanation(expandedExplanation === v.id ? null : v.id);
                        }}
                        className="w-full text-left text-[10px] text-slate-400 hover:text-white flex items-center gap-1 group"
                      >
                        <Brain className="w-3 h-3 text-slate-500 group-hover:text-indigo-400" />
                        <span className="underline decoration-dotted">Why this estimate?</span>
                      </button>

                      {expandedExplanation === v.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-2 text-[10px]"
                        >
                          <p className="text-slate-300 leading-relaxed">{v.explanation}</p>
                          <p className="text-indigo-400/80 font-mono leading-relaxed">{v.basisNote}</p>
                          <p className="text-indigo-300/60 font-mono italic">{v.dnaInfluence}</p>
                        </motion.div>
                      )}

                      {/* Apply Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApply(v);
                        }}
                        disabled={isApplied}
                        className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          isApplied
                            ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                            : 'glass-button-primary text-white shadow-glow-primary hover:scale-[1.02]'
                        }`}
                      >
                        {isApplied ? (
                          <><Check className="w-3.5 h-3.5" /> Applied to Editor</>
                        ) : (
                          <><ArrowRight className="w-3.5 h-3.5" /> Apply This Hook</>
                        )}
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Comparison Legend */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Signal scores use "estimated" metrics based on available performance data.</span>
                <span className="text-slate-600">No guarantees implied. Audience response varies.</span>
              </div>
            </div>
          )}

          {/* ─── FOOTER ─── */}
          <div className="px-6 py-3 border-t border-white/10 bg-[#080910] flex items-center justify-between shrink-0">
            <button onClick={onClose} className="px-4 py-2 rounded-xl glass-button text-xs font-semibold text-slate-400">
              Close
            </button>
            <div className="flex items-center gap-2">
              {!isGenerating && (
                <button
                  onClick={generateVariants}
                  className="px-4 py-2 rounded-xl glass-button text-xs font-semibold text-amber-300 hover:text-white flex items-center gap-1.5"
                >
                  <Zap className="w-3 h-3" />
                  Regenerate Variants
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
