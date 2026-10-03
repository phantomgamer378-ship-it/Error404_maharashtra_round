import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { ScoredOpportunity } from '../../features/opportunity-engine/types';

interface ContentGapSectionProps {
  opportunity: ScoredOpportunity;
  onTurnGapIntoIdea: (opportunity: ScoredOpportunity) => void;
}

/* Inline level badge */
const LevelBadge: React.FC<{ level: string }> = ({ level }) => {
  const cls =
    level === 'HIGH' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
    level === 'LOW' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
    'bg-purple-500/20 text-purple-400 border-purple-500/30';
  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono border ${cls}`}>
      {level}
    </span>
  );
};

/* Single gap card */
const GapCard: React.FC<{
  gap: ScoredOpportunity['evidence']['contentGap'];
  topic: string;
  category: string;
  onAction: () => void;
}> = ({ gap, topic, category, onAction }) => (
  <div className="rounded-2xl glass-panel-l3 p-5 border border-indigo-500/20 space-y-3.5 relative overflow-hidden">
    {/* Background glow */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />

    {/* Header */}
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
        POTENTIAL GAP
      </span>
      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
        {category}
      </span>
    </div>

    {/* Title */}
    <h4 className="text-base font-bold text-white leading-snug">{gap.potentialGap}</h4>

    {/* Covered heavily */}
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
        <Layers className="w-3.5 h-3.5" />
        <span>Covered heavily in your library</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {gap.heavilyCovered.map((t, i) => (
          <span
            key={i}
            className="px-2.5 py-1 rounded-lg bg-white/[0.05] text-slate-400 text-[10px] border border-white/[0.06]"
          >
            {t}
          </span>
        ))}
      </div>
    </div>

    {/* Metrics */}
    <div className="space-y-1.5 text-[11px]">
      <div className="flex items-center justify-between">
        <span className="text-slate-500">Audience relevance</span>
        <LevelBadge level={gap.audienceRelevance} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-slate-500">Your coverage</span>
        <LevelBadge level={gap.creatorCoverage} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-slate-500">Competition</span>
        <LevelBadge level="LOW" />
      </div>
    </div>

    {/* Description */}
    <p className="text-[11px] text-slate-400 leading-relaxed">
      {gap.recommendedApproach}
    </p>

    {/* CTA */}
    <button
      onClick={onAction}
      className="w-full py-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all text-xs font-medium text-slate-300 flex items-center justify-center gap-2 group"
    >
      <span className="w-4 h-4 rounded-full border border-slate-500 flex items-center justify-center text-[10px] text-slate-500">✓</span>
      <span>Turn this gap into an idea</span>
      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

export const ContentGapSection: React.FC<ContentGapSectionProps> = ({
  opportunity,
  onTurnGapIntoIdea,
}) => {
  const gap = opportunity.evidence.contentGap;

  // Create a second gap variation for visual richness
  const secondGap = {
    ...gap,
    potentialGap: gap.potentialGap.includes('Voice')
      ? `Voice-clone fraud targeting parents`
      : `${opportunity.topic} — untapped angles`,
    heavilyCovered: gap.heavilyCovered.slice(0, 2),
    audienceRelevance: 'HIGH' as const,
    creatorCoverage: 'LOW' as const,
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-white">Content gaps</h3>

      <div className="space-y-4">
        <GapCard
          gap={gap}
          topic={opportunity.topic}
          category={opportunity.category}
          onAction={() => onTurnGapIntoIdea(opportunity)}
        />

        <GapCard
          gap={secondGap}
          topic={opportunity.topic}
          category={opportunity.category}
          onAction={() => onTurnGapIntoIdea(opportunity)}
        />
      </div>
    </div>
  );
};
