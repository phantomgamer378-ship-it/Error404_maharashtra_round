import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { ScoredOpportunity } from '../../features/opportunity-engine/types';
import { WhyNowPanel } from './WhyNowPanel';

interface OpportunityCardProps {
  opportunity: ScoredOpportunity;
  isSelected?: boolean;
  onSelect?: () => void;
  onOpenCreate: (opportunity: ScoredOpportunity) => void;
  isInitialExpanded?: boolean;
}

/* Inline score ring for horizontal card */
const InlineScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const radius = 32;
  const stroke = 4;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center shrink-0">
      <svg width="76" height="76" viewBox="0 0 76 76">
        {/* Background ring */}
        <circle
          cx="38" cy="38" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        {/* Progress ring */}
        <circle
          cx="38" cy="38" r={radius}
          fill="none"
          stroke="#818CF8"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference - progress}`}
          strokeDashoffset={circumference * 0.25}
          style={{ filter: 'drop-shadow(0 0 4px rgba(129, 140, 248, 0.4))' }}
        />
        {/* Score text */}
        <text x="38" y="35" textAnchor="middle" className="fill-white text-xl font-bold" fontSize="20">
          {score}
        </text>
        <text x="38" y="50" textAnchor="middle" className="fill-slate-500 text-[9px] font-mono uppercase tracking-wider" fontSize="9">
          SCORE
        </text>
      </svg>
      <span className="text-[9px] text-slate-600 font-mono mt-0.5 text-center leading-tight">
        Estimated<br />from available signals
      </span>
    </div>
  );
};

/* Metric bar row */
const MetricBar: React.FC<{ label: string; value: number; color?: string }> = ({
  label,
  value,
  color = '#818CF8',
}) => (
  <div className="flex items-center gap-3">
    <span className="text-[11px] text-slate-500 w-24 shrink-0">{label}</span>
    <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
    <span className="text-[11px] text-white font-mono font-semibold w-6 text-right">{value}</span>
  </div>
);

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  isSelected = false,
  onSelect,
  onOpenCreate,
  isInitialExpanded = false,
}) => {
  const [isWhyNowExpanded, setIsWhyNowExpanded] = useState(isInitialExpanded);

  const stateBadgeClass =
    opportunity.trendDirection === 'Rising' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
    opportunity.trendDirection === 'Stable' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
    opportunity.trendDirection === 'Saturated' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
    'bg-slate-500/20 text-slate-300 border-slate-500/30';

  const hasContentGap = opportunity.evidence?.contentGap?.creatorCoverage === 'LOW';

  const competitionValue =
    opportunity.competition === 'Low' ? opportunity.competitionScore :
    opportunity.competition === 'Medium' ? opportunity.competitionScore :
    opportunity.competitionScore;

  return (
    <div
      onClick={() => onSelect?.()}
      className={`p-5 rounded-2xl border transition-all cursor-pointer ${
        isSelected
          ? 'border-indigo-500/50 bg-indigo-500/[0.05] shadow-lg shadow-indigo-500/10'
          : 'border-white/[0.06] hover:bg-white/[0.02] hover:border-white/10'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-5">
        {/* Left: Badges + Topic info */}
        <div className="lg:w-[280px] shrink-0 space-y-2">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border font-mono ${stateBadgeClass}`}>
              {opportunity.trendDirection} {opportunity.trendDirection === 'Rising' ? '↑' : opportunity.trendDirection === 'Declining' ? '↓' : '→'}
            </span>
            {hasContentGap && (
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-mono">
                Content gap · LOW coverage
              </span>
            )}
            {isSelected && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                Active Trajectory
              </span>
            )}
          </div>

          {/* Topic title */}
          <h3 className="text-base font-bold text-white leading-snug">
            {opportunity.topic}
          </h3>

          {/* Summary */}
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
            {opportunity.summary}
          </p>

          {/* Format line */}
          <p className="text-[11px] text-slate-600">
            {opportunity.evidence.format} · best on {opportunity.evidence.platform?.toLowerCase() || 'instagram'}
          </p>
        </div>

        {/* Center-left: Score ring */}
        <div className="shrink-0">
          <InlineScoreRing score={opportunity.opportunityScore} />
        </div>

        {/* Center: 4 metric bars */}
        <div className="flex-1 space-y-2.5 min-w-[200px]">
          <MetricBar label="Velocity" value={opportunity.trendVelocity} color="#818CF8" />
          <MetricBar label="Audience fit" value={opportunity.audienceFit} color="#818CF8" />
          <MetricBar label="Creator fit" value={opportunity.creatorFit} color="#818CF8" />
          <MetricBar label="Competition" value={competitionValue} color="#818CF8" />
        </div>

        {/* Right: Inspect Trajectory + Why now? + Create content */}
        <div className="shrink-0 flex flex-col gap-2 lg:w-[170px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
              document.getElementById('trend-trajectory-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`w-full px-3 py-1.5 rounded-xl border text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
              isSelected
                ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-200'
                : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <span>{isSelected ? 'Viewing Trajectory ↓' : 'Inspect Trajectory ↓'}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsWhyNowExpanded(!isWhyNowExpanded);
            }}
            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-medium text-slate-300 hover:bg-white/[0.08] hover:border-white/20 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Why now?</span>
            {isWhyNowExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
              onOpenCreate(opportunity);
            }}
            className="w-full px-3 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-md shadow-sky-600/20"
          >
            Create content
          </button>
        </div>
      </div>

      {/* Expandable Why Now? panel */}
      <AnimatePresence>
        {isWhyNowExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-5 ml-0 lg:ml-4">
              <WhyNowPanel opportunity={opportunity} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
