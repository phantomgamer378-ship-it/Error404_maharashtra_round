import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  TrendingUp, 
  Layers, 
  Radio,
  Sliders,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { ScoredOpportunity } from '../../features/opportunity-engine/types';
import { ScoreRing } from '../ui/ScoreRing';
import { WhyNowPanel } from './WhyNowPanel';
import { DemoDataBadge } from '../ui/DemoDataBadge';

interface OpportunityCardProps {
  opportunity: ScoredOpportunity;
  onOpenCreate: (opportunity: ScoredOpportunity) => void;
  isInitialExpanded?: boolean;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onOpenCreate,
  isInitialExpanded = true,
}) => {
  const [isWhyNowExpanded, setIsWhyNowExpanded] = useState(isInitialExpanded);

  const stateBadgeClass = 
    opportunity.trendDirection === 'Rising' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
    opportunity.trendDirection === 'Stable' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
    opportunity.trendDirection === 'Saturated' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
    'bg-slate-500/20 text-slate-300 border-slate-500/30';

  return (
    <div className="rounded-3xl glass-panel-l3 p-6 sm:p-8 border border-indigo-500/30 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header: Topic Title, State Badge, Demo Data Badge, Opportunity Score Ring */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border font-mono ${stateBadgeClass}`}>
              {opportunity.trendDirection} ↑
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[10px] font-mono">
              {opportunity.category}
            </span>
            {opportunity.isLearnedReRank && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold animate-pulse shadow-sm">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>⚡ Updated from your latest performance</span>
              </span>
            )}
            {opportunity.source === 'demo' && <DemoDataBadge />}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{opportunity.topic}</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            {opportunity.summary}
          </p>
        </div>

        {/* Opportunity Score Ring */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0 bg-white/[0.02] sm:bg-transparent p-3 sm:p-0 rounded-2xl border border-white/5 sm:border-0">
          <div className="sm:text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-semibold block">
              Estimated Opportunity
            </span>
            <span className="text-[11px] text-indigo-300/80 font-mono">
              {opportunity.isLearnedReRank ? '⚡ Re-ranked via Learning Loop' : 'Based on available signals'}
            </span>
          </div>

          <ScoreRing
            score={opportunity.opportunityScore}
            size={76}
            strokeWidth={6}
            label="OPP"
          />
        </div>
      </div>

      {/* Four Sub-scores Grid with Visual Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Trend Velocity */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Trend Velocity</span>
            <span className="text-white font-mono font-bold">{opportunity.trendVelocity}</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-400 rounded-full" 
              style={{ width: `${opportunity.trendVelocity}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">Speed of search volume growth</span>
        </div>

        {/* Audience Fit */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Audience Fit</span>
            <span className="text-emerald-400 font-mono font-bold">{opportunity.audienceFit}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-400 rounded-full" 
              style={{ width: `${opportunity.audienceFit}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">Tech-savvy students & pros affinity</span>
        </div>

        {/* Creator Fit */}
        <div className={`p-3.5 rounded-2xl border space-y-2 transition-all ${
          opportunity.isLearnedReRank 
            ? 'bg-emerald-950/25 border-emerald-500/40 shadow-glow-emerald' 
            : 'bg-white/[0.03] border-white/5'
        }`}>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Creator Fit</span>
            <div className="flex items-center gap-1.5">
              {opportunity.isLearnedReRank && (
                <span className="text-[9px] font-mono text-emerald-300 font-bold bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.2 rounded">
                  +15 Learned
                </span>
              )}
              <span className="text-purple-400 font-mono font-bold">{opportunity.creatorFit}%</span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${opportunity.isLearnedReRank ? 'bg-gradient-to-r from-purple-400 to-emerald-400' : 'bg-purple-400'}`} 
              style={{ width: `${opportunity.creatorFit}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">
            {opportunity.isLearnedReRank ? 'Boosted: Matches Question hook pattern' : "Calibrated from Sarth's DNA"}
          </span>
        </div>

        {/* Competition */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Competition</span>
            <span className={`font-mono font-bold ${
              opportunity.competition === 'Low' ? 'text-emerald-400' :
              opportunity.competition === 'Medium' ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {opportunity.competition}
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                opportunity.competition === 'Low' ? 'bg-emerald-400' :
                opportunity.competition === 'Medium' ? 'bg-amber-400' : 'bg-rose-400'
              }`}
              style={{ width: `${opportunity.competitionScore}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">Saturation index: {opportunity.competitionScore}/100</span>
        </div>
      </div>

      {/* Suggested Angle & Execution Strategy */}
      <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
            Suggested Creative Angle:
          </span>
          <p className="text-white font-medium">
            "{opportunity.evidence.suggestedAngle}"
          </p>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono pt-1">
            <span>Platform: <strong className="text-indigo-300">{opportunity.evidence.platform}</strong></span>
            <span>• Format: <strong className="text-slate-200">{opportunity.evidence.format}</strong></span>
          </div>
        </div>

        <button
          onClick={() => onOpenCreate(opportunity)}
          className="px-4 py-2 rounded-xl glass-button-primary font-bold text-xs text-white flex items-center gap-2 shadow-glow-primary shrink-0 self-stretch sm:self-auto justify-center"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>Create Content</span>
        </button>
      </div>

      {/* Expandable "Why Now?" Button & Panel */}
      <div className="border-t border-white/10 pt-4">
        <button
          onClick={() => setIsWhyNowExpanded(!isWhyNowExpanded)}
          className="w-full flex items-center justify-between py-2 text-xs font-bold text-white hover:text-indigo-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="uppercase tracking-wider">
              {isWhyNowExpanded ? 'Hide Intelligence Reasoning' : 'Inspect "Why Now?" & Score Breakdown'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <span>{isWhyNowExpanded ? 'Collapse' : 'Expand deep evidence'}</span>
            {isWhyNowExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        <AnimatePresence>
          {isWhyNowExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-4"
            >
              <WhyNowPanel opportunity={opportunity} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
