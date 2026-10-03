import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ScoredOpportunity } from '../../features/opportunity-engine/types';

interface TrendRadarProps {
  opportunities: ScoredOpportunity[];
  selectedId: string;
  onSelectOpportunity: (opp: ScoredOpportunity) => void;
}

/* Small sparkline component for momentum movers */
const MiniSparkline: React.FC<{ values: number[] }> = ({ values }) => {
  if (!values.length) return null;
  const min = Math.min(...values);
  const max = Math.max(...values) || 1;
  const h = 24;
  const w = 64;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
    return `${x},${y}`;
  });
  const pathD = pts.reduce((acc, p, i) => (i === 0 ? `M ${p}` : `${acc} L ${p}`), '');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <path d={pathD} fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export const TrendRadar: React.FC<TrendRadarProps> = ({
  opportunities,
  selectedId,
  onSelectOpportunity,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const selectedOpp = opportunities.find(o => o.id === selectedId) || opportunities[0];
  const activeHoverOrSelect = hoveredId
    ? opportunities.find(o => o.id === hoveredId)
    : selectedOpp;

  const relatedIds = activeHoverOrSelect ? activeHoverOrSelect.relatedTopicIds : [];

  // Top momentum movers sorted by velocity
  const momentumMovers = useMemo(() => {
    return [...opportunities]
      .filter(o => o.trendDirection === 'Rising')
      .sort((a, b) => b.trendVelocity - a.trendVelocity)
      .slice(0, 4);
  }, [opportunities]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
      {/* Left: Trend Radar */}
      <div className="lg:col-span-9 rounded-3xl lg:rounded-r-none glass-panel-l3 p-6 border border-white/10 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white tracking-tight">Trend radar</h3>
          <span className="text-[11px] text-slate-500">Hover to connect · click to inspect</span>
        </div>

        {/* Radar Canvas */}
        <div className="relative w-full h-[380px] rounded-2xl bg-[#080911]/80 overflow-hidden flex items-center justify-center select-none">
          {/* Concentric rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
            <div className="w-[100px] h-[100px] rounded-full border border-slate-500/80" />
            <div className="w-[200px] h-[200px] rounded-full border border-slate-500/60 absolute" />
            <div className="w-[300px] h-[300px] rounded-full border border-slate-500/40 absolute" />
            <div className="w-full h-[1px] bg-slate-500/20 absolute" />
            <div className="h-full w-[1px] bg-slate-500/20 absolute" />
          </div>

          {/* SVG connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {opportunities.map(node =>
              (node.relatedTopicIds || []).map(relId => {
                const target = opportunities.find(o => o.id === relId);
                if (!target) return null;

                const isHighlighted =
                  (activeHoverOrSelect?.id === node.id && relatedIds.includes(target.id)) ||
                  (activeHoverOrSelect?.id === target.id && relatedIds.includes(node.id));

                return (
                  <line
                    key={`${node.id}-${target.id}`}
                    x1={`${node.radarPos.x}%`}
                    y1={`${node.radarPos.y}%`}
                    x2={`${target.radarPos.x}%`}
                    y2={`${target.radarPos.y}%`}
                    stroke={isHighlighted ? '#818CF8' : 'rgba(255,255,255,0.08)'}
                    strokeWidth={isHighlighted ? 2 : 1}
                    strokeDasharray={isHighlighted ? 'none' : '4 4'}
                    className="transition-all duration-300"
                    style={{
                      filter: isHighlighted ? 'drop-shadow(0 0 4px rgba(129, 140, 248, 0.6))' : 'none'
                    }}
                  />
                );
              })
            )}
          </svg>

          {/* Interactive Nodes */}
          {opportunities.map(opp => {
            const isSelected = opp.id === selectedId;
            const isHovered = opp.id === hoveredId;
            const isRelated = relatedIds.includes(opp.id);

            const statusColor =
              opp.trendDirection === 'Rising' ? '#10B981' :
              opp.trendDirection === 'Stable' ? '#6366F1' :
              opp.trendDirection === 'Saturated' ? '#F59E0B' : '#64748B';

            return (
              <motion.div
                key={opp.id}
                style={{ left: `${opp.radarPos.x}%`, top: `${opp.radarPos.y}%` }}
                whileHover={{ scale: 1.08 }}
                onMouseEnter={() => setHoveredId(opp.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectOpportunity(opp)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 flex flex-col items-center gap-1 transition-all select-none`}
              >
                {/* Node circle */}
                <div className="relative">
                  <div
                    className={`rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'w-14 h-14 ring-2 ring-indigo-400/60 shadow-lg'
                        : isRelated
                        ? 'w-10 h-10 ring-1 ring-indigo-500/30'
                        : 'w-8 h-8'
                    }`}
                    style={{
                      backgroundColor: isSelected ? `${statusColor}22` : `${statusColor}15`,
                      border: `2px solid ${isSelected ? statusColor : `${statusColor}60`}`,
                    }}
                  >
                    {isSelected && (
                      <span className="text-[10px] font-bold text-white font-mono">
                        v{opp.trendVelocity}
                      </span>
                    )}
                  </div>
                  {opp.trendDirection === 'Rising' && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping opacity-30"
                      style={{ backgroundColor: statusColor }}
                    />
                  )}
                </div>

                {/* Topic label */}
                <span className={`text-[10px] font-medium whitespace-nowrap transition-colors ${
                  isSelected ? 'text-white' : isRelated ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  {opp.topic}
                </span>

                {/* Score for non-selected */}
                {!isSelected && (
                  <span className="text-[9px] text-slate-600 font-mono">v{opp.trendVelocity}</span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Rising
          </span>
          <span className="flex items-center gap-1.5 text-indigo-400">
            <span className="w-2 h-2 rounded-full bg-indigo-400" /> Stable
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Saturated
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-400" /> Declining
          </span>
        </div>
      </div>

      {/* Right: Momentum Movers */}
      <div className="lg:col-span-3 rounded-3xl lg:rounded-l-none glass-panel-l3 p-5 border border-white/10 lg:border-l-0">
        <h3 className="text-sm font-bold text-white mb-5">Momentum movers</h3>

        <div className="space-y-5">
          {momentumMovers.map((opp) => {
            // Generate sparkline values from trajectory
            const sparkValues = opp.trajectory?.map(t => t.interest) || [40, 55, 60, 72, 85, 92];
            const momentum = Math.round(opp.trendVelocity * 0.4);

            return (
              <div
                key={opp.id}
                className="flex items-center justify-between gap-3 cursor-pointer group"
                onClick={() => onSelectOpportunity(opp)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium group-hover:text-indigo-300 transition-colors truncate">
                      {opp.topic}
                    </p>
                    <p className="text-xs text-emerald-400 font-medium">
                      +{momentum}% momentum
                    </p>
                  </div>
                </div>
                <MiniSparkline values={sparkValues} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
