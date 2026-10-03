import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Zap, TrendingUp, Sparkles } from 'lucide-react';
import { ScoredOpportunity } from '../../features/opportunity-engine/types';

interface TrendRadarProps {
  opportunities: ScoredOpportunity[];
  selectedId: string;
  onSelectOpportunity: (opp: ScoredOpportunity) => void;
}

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

  // Determine active related topic IDs
  const relatedIds = activeHoverOrSelect ? activeHoverOrSelect.relatedTopicIds : [];

  return (
    <div className="rounded-3xl glass-panel-l3 p-6 border border-white/10 relative overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-indigo-400 animate-pulse" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              TREND RADAR NETWORK
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30">
              Live Topology
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive multi-node signal network mapped to your creator niche. Hover to reveal connected clusters.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/5 self-start sm:self-auto">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Rising
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 font-medium text-[11px]">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Stable
          </span>
          <span className="flex items-center gap-1.5 text-rose-400 font-medium text-[11px]">
            <span className="w-2 h-2 rounded-full bg-rose-400" /> Saturated
          </span>
        </div>
      </div>

      {/* Radar Canvas Display */}
      <div className="relative w-full h-[360px] rounded-2xl bg-[#080911]/90 border border-white/10 overflow-hidden flex items-center justify-center select-none">
        
        {/* Subtle Radar sweep animation */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, rgba(99, 102, 241, 0.18) 0deg, transparent 60deg, transparent 360deg)',
            animation: 'spin 12s linear infinite'
          }}
        />

        {/* Concentric rings & coordinates */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[120px] h-[120px] rounded-full border border-indigo-500/80" />
          <div className="w-[220px] h-[220px] rounded-full border border-indigo-500/60 absolute" />
          <div className="w-[320px] h-[320px] rounded-full border border-indigo-500/40 absolute" />
          <div className="w-full h-[1px] bg-indigo-500/30 absolute" />
          <div className="h-full w-[1px] bg-indigo-500/30 absolute" />
        </div>

        {/* Center Origin Beacon */}
        <div className="absolute z-0 pointer-events-none flex flex-col items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400/80 shadow-glow-primary" />
          <span className="text-[9px] font-mono text-indigo-300/40 mt-1 uppercase tracking-widest">Creator DNA Core</span>
        </div>

        {/* SVG connection lines between related topics */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {opportunities.map(node => {
            return (node.relatedTopicIds || []).map(relId => {
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
                  stroke={isHighlighted ? '#818CF8' : 'rgba(255,255,255,0.1)'}
                  strokeWidth={isHighlighted ? 2.5 : 1}
                  strokeDasharray={isHighlighted ? 'none' : '4 4'}
                  className="transition-all duration-300"
                  style={{
                    filter: isHighlighted ? 'drop-shadow(0 0 6px rgba(129, 140, 248, 0.8))' : 'none'
                  }}
                />
              );
            });
          })}
        </svg>

        {/* Interactive Nodes */}
        {opportunities.map(opp => {
          const isSelected = opp.id === selectedId;
          const isHovered = opp.id === hoveredId;
          const isRelated = relatedIds.includes(opp.id);

          const statusColor = 
            opp.trendDirection === 'Rising' ? '#10B981' :
            opp.trendDirection === 'Stable' ? '#F59E0B' :
            opp.trendDirection === 'Saturated' ? '#F43F5E' : '#64748B';

          return (
            <motion.div
              key={opp.id}
              style={{ left: `${opp.radarPos.x}%`, top: `${opp.radarPos.y}%` }}
              whileHover={{ scale: 1.12 }}
              onMouseEnter={() => setHoveredId(opp.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectOpportunity(opp)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer p-2.5 sm:p-3 rounded-2xl backdrop-blur-xl border transition-all select-none z-10 ${
                isSelected
                  ? 'glass-panel-l4 border-indigo-400 ring-2 ring-indigo-500/40 shadow-glow-primary z-30 scale-105'
                  : isRelated
                  ? 'glass-panel-l3 border-indigo-500/50 shadow-glow-subtle z-20'
                  : 'glass-panel-l2 border-white/10 hover:border-white/30'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {/* Node Status Indicator */}
                <div className="relative">
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: opp.radarPos.color || statusColor }}
                  />
                  {opp.trendDirection === 'Rising' && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping opacity-75"
                      style={{ backgroundColor: opp.radarPos.color || statusColor }}
                    />
                  )}
                </div>

                {/* Node Info */}
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-white whitespace-nowrap">{opp.topic}</p>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>Opp: <strong className="text-indigo-300 font-bold">{opp.opportunityScore}</strong></span>
                    <span>• {opp.trendVelocity} Vel</span>
                    <span>• {opp.competition} Sat</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Hint */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 px-1">
        <span>Click any topic node to inspect its explainable opportunity breakdown.</span>
        <span className="text-indigo-300 font-medium">
          Selected: <strong className="text-white">{selectedOpp.topic}</strong>
        </span>
      </div>
    </div>
  );
};
