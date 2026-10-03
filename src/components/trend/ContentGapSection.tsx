import React from 'react';
import { Target, ArrowRight, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ScoredOpportunity } from '../../features/opportunity-engine/types';

interface ContentGapSectionProps {
  opportunity: ScoredOpportunity;
  onTurnGapIntoIdea: (opportunity: ScoredOpportunity) => void;
}

export const ContentGapSection: React.FC<ContentGapSectionProps> = ({
  opportunity,
  onTurnGapIntoIdea,
}) => {
  const gap = opportunity.evidence.contentGap;

  return (
    <div className="rounded-3xl glass-panel-l3 p-6 border border-cyan-500/30 space-y-5 shadow-xl relative overflow-hidden">
      {/* Background cyan glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <Target className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Content Gap Finder</h3>
            <p className="text-[11px] text-slate-400">Underserved angles with high viewer curiosity</p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 font-mono">
          HIGH OPPORTUNITY
        </span>
      </div>

      {/* Comparison: Covered Heavily vs Potential Gap */}
      <div className="space-y-3 text-xs">
        {/* Covered Heavily */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Covered Heavily by Competitors (High Saturation):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {gap.heavilyCovered.map((topic, i) => (
              <span 
                key={i} 
                className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 text-[11px] border border-white/5"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Potential Gap Highlight */}
        <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-cyan-400 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Un-tapped Market Opportunity Gap:
            </span>
            <span className="text-[10px] text-cyan-300 font-mono">
              Topic: {opportunity.topic}
            </span>
          </div>

          <p className="text-white font-bold text-sm leading-snug">
            {gap.potentialGap}
          </p>

          <p className="text-[11px] text-slate-300 italic">
            Recommended approach: {gap.recommendedApproach}
          </p>

          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-cyan-500/20 font-mono">
            <span>
              Audience Relevance: <strong className="text-emerald-400 font-bold">{gap.audienceRelevance}</strong>
            </span>
            <span>
              Your Coverage: <strong className="text-amber-400 font-bold">{gap.creatorCoverage}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <button
        onClick={() => onTurnGapIntoIdea(opportunity)}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 font-bold text-xs text-white transition-all shadow-glow-cyan flex items-center justify-center gap-2 group"
      >
        <span>Turn this gap into an idea</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
