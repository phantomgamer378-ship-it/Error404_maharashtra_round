import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Target, 
  Layers, 
  TrendingUp, 
  UserCheck, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Calculator
} from 'lucide-react';
import { ScoredOpportunity } from '../../features/opportunity-engine/types';
import { DemoDataBadge } from '../ui/DemoDataBadge';

interface WhyNowPanelProps {
  opportunity: ScoredOpportunity;
}

export const WhyNowPanel: React.FC<WhyNowPanelProps> = ({ opportunity }) => {
  const [showFormulaBreakdown, setShowFormulaBreakdown] = useState(false);
  const { evidence, factors } = opportunity;
  const breakdown = evidence.breakdown;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. WHY NOW: Temporal signals & market timing */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Why Now? Temporal Signals
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Confidence: <strong className="text-emerald-400 font-bold">{breakdown.confidence}%</strong>
          </span>
        </div>

        <div className="space-y-2">
          {evidence.whyNow.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. SUPPORTING SIGNALS LIST (With Demo badges) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            Supporting Signal Evidence
          </span>
          <DemoDataBadge />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {evidence.supportingSignals.map((sig) => (
            <div key={sig.id} className="p-2.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs">
              <div className="flex items-center justify-between text-[10px] text-indigo-300 font-mono">
                <span className="truncate max-w-[160px]">{sig.source}</span>
                <span className="text-emerald-400 font-bold">{sig.change}</span>
              </div>
              <p className="font-semibold text-white mt-1">{sig.label}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{sig.metric}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. WHY YOU: Creator DNA match */}
      <div className="rounded-2xl bg-purple-950/20 border border-purple-500/20 p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Why You? Creator DNA Alignment
            </h4>
          </div>
          <span className="text-[10px] text-purple-300 font-mono">
            Creator Fit: <strong className="text-white font-bold">{opportunity.creatorFit}%</strong>
          </span>
        </div>

        <div className="space-y-2 text-xs text-slate-200">
          {evidence.whyYou.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. CONTENT GAP ADVANTAGE & UNCERTAINTY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Content Gap */}
        <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-1.5">
          <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Target className="w-3.5 h-3.5" />
            <span>Content Gap Angle</span>
          </div>
          <p className="text-xs text-white font-semibold">{evidence.contentGap.potentialGap}</p>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
            <span>Audience Req: <strong className="text-emerald-400">{evidence.contentGap.audienceRelevance}</strong></span>
            <span>Your Coverage: <strong className="text-amber-400">{evidence.contentGap.creatorCoverage}</strong></span>
          </div>
        </div>

        {/* Signal Uncertainty Penalty */}
        <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Uncertainty Factor</span>
          </div>
          <p className="text-xs text-white">
            {factors.uncertaintyScore < 20 
              ? 'High signal stability across multi-source crawl.'
              : 'Moderate volatility; conservative score penalty applied.'}
          </p>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
            <span>Uncertainty: <strong className="text-amber-400">{factors.uncertaintyScore}%</strong></span>
            <span>Est. Stability: <strong className="text-white">{100 - factors.uncertaintyScore}%</strong></span>
          </div>
        </div>
      </div>

      {/* 5. VISIBLE SCORE BREAKDOWN (INTERPRETABLE MATHEMATICAL FORMULA) */}
      <div className="rounded-2xl bg-[#090b14] border border-white/10 p-4 space-y-3">
        <button
          onClick={() => setShowFormulaBreakdown(!showFormulaBreakdown)}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-400" />
            <div>
              <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                Interpretable Opportunity Formula Breakdown
              </p>
              <p className="text-[10px] text-slate-400">
                Transparent weighted math (no black-box scoring)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-300">
              = {breakdown.finalScore} / 100
            </span>
            {showFormulaBreakdown ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </button>

        {showFormulaBreakdown && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono"
          >
            {breakdown.terms.map((term, i) => (
              <div 
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5"
              >
                <div className="flex flex-col">
                  <span className="text-white font-medium">{term.label}</span>
                  <span className="text-[10px] text-slate-400 font-sans">{term.explanation}</span>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className={`font-bold ${term.isPenalty ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {term.contribution > 0 ? `+${term.contribution}` : term.contribution} pts
                  </span>
                  <div className="text-[9px] text-slate-500">
                    factor: {term.factorValue} × {term.weight}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold">
              <span className="text-indigo-200">Final Clamped Score</span>
              <span className="text-indigo-400">{breakdown.finalScore} / 100</span>
            </div>
          </motion.div>
        )}
      </div>

      <p className="text-[11px] text-slate-500 italic text-center">
        * Opportunity estimates calculated from available open signals & calibrated against Sarth's Creator DNA. Not guaranteed virality.
      </p>
    </div>
  );
};
