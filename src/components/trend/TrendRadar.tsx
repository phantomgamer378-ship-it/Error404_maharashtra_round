import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';
import { ScoredOpportunity } from '../../features/opportunity-engine/types';

interface TrendRadarProps {
  opportunities: ScoredOpportunity[];
  selectedId: string;
  onSelectOpportunity: (opp: ScoredOpportunity) => void;
}

/* ─── Mini sparkline for momentum sidebar ─── */
const MiniSparkline: React.FC<{ values: number[] }> = ({ values }) => {
  if (!values.length) return null;
  const min = Math.min(...values);
  const max = Math.max(...values) || 1;
  const h = 28;
  const w = 72;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 6) - 3;
    return `${x},${y}`;
  });
  const pathD = pts.reduce((acc, p, i) => (i === 0 ? `M ${p}` : `${acc} L ${p}`), '');
  const areaD = `${pathD} L ${w},${h} L 0,${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818CF8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#sparkGrad)" />
      <path d={pathD} fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

/* ─── Hover tooltip card ─── */
const NodeTooltip: React.FC<{ opp: ScoredOpportunity; position: 'top' | 'bottom' }> = ({ opp, position }) => {
  const stateColor =
    opp.trendDirection === 'Rising' ? 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' :
    opp.trendDirection === 'Stable' ? 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30' :
    opp.trendDirection === 'Saturated' ? 'text-amber-400 bg-amber-500/20 border-amber-500/30' :
    'text-slate-400 bg-slate-500/20 border-slate-500/30';

  const StateIcon = opp.trendDirection === 'Rising' ? TrendingUp :
    opp.trendDirection === 'Declining' ? TrendingDown : Minus;

  // Weekly change estimate
  const weeklyChange = opp.trendDirection === 'Rising'
    ? `+${Math.round(opp.trendVelocity * 0.05)}% wk`
    : opp.trendDirection === 'Declining'
    ? `-${Math.round(opp.trendVelocity * 0.03)}% wk`
    : `~${Math.round(opp.trendVelocity * 0.01)}% wk`;

  return (
    <motion.div
      initial={{ opacity: 0, y: position === 'top' ? 8 : -8, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: position === 'top' ? 8 : -8, scale: 0.92 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`absolute z-50 pointer-events-none ${
        position === 'top' ? 'bottom-full mb-3' : 'top-full mt-3'
      } left-1/2 -translate-x-1/2`}
    >
      <div className="w-[240px] rounded-2xl bg-[#12141f]/95 backdrop-blur-xl border border-white/15 shadow-2xl overflow-hidden"
        style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 20px rgba(129, 140, 248, 0.15)' }}
      >
        {/* Header with name + state */}
        <div className="px-4 pt-3.5 pb-2.5 border-b border-white/[0.06]">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-white truncate">{opp.topic}</h4>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0 flex items-center gap-1 ${stateColor}`}>
              <StateIcon className="w-3 h-3" />
              {opp.trendDirection}
            </span>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="px-4 py-3 space-y-2">
          {/* Row 1: Velocity + Relevance */}
          <div className="flex gap-4">
            <div className="flex-1">
              <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">Velocity</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-bold text-white font-mono">{opp.trendVelocity}</span>
                <span className="text-[10px] text-slate-500">/100</span>
              </div>
            </div>
            <div className="flex-1">
              <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">Relevance</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-bold text-white font-mono">{opp.audienceFit}</span>
                <span className="text-[10px] text-slate-500">/100</span>
              </div>
            </div>
          </div>

          {/* Row 2: Saturation + Weekly */}
          <div className="flex gap-4">
            <div className="flex-1">
              <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">Saturation</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-bold text-white font-mono">{opp.competitionScore}</span>
                <span className="text-[10px] text-slate-500">/100</span>
              </div>
            </div>
            <div className="flex-1">
              <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">Weekly</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className={`text-sm font-bold font-mono ${
                  opp.trendDirection === 'Rising' ? 'text-emerald-400' :
                  opp.trendDirection === 'Declining' ? 'text-rose-400' : 'text-slate-400'
                }`}>
                  {weeklyChange}
                </span>
              </div>
            </div>
          </div>

          {/* Opportunity score bar */}
          <div className="pt-1.5">
            <div className="flex items-center justify-between text-[9px] mb-1">
              <span className="text-slate-500 font-mono uppercase tracking-wider">Opportunity Score</span>
              <span className="text-indigo-300 font-bold font-mono">{opp.opportunityScore}/100</span>
            </div>
            <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${opp.opportunityScore}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                style={{ boxShadow: '0 0 8px rgba(129, 140, 248, 0.5)' }}
              />
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 bg-white/[0.02] border-t border-white/[0.06]">
          <span className="text-[9px] text-slate-600 font-mono">Click to inspect full breakdown →</span>
        </div>
      </div>

      {/* Arrow indicator */}
      <div className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-[#12141f]/95 border border-white/15 ${
        position === 'top'
          ? 'bottom-[-7px] border-t-0 border-l-0'
          : 'top-[-7px] border-b-0 border-r-0'
      }`} />
    </motion.div>
  );
};

/* ─── Main Radar Component ─── */
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

  // Determine tooltip position based on node Y
  const getTooltipPos = useCallback((y: number): 'top' | 'bottom' => {
    return y < 40 ? 'bottom' : 'top';
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
      {/* ─── Left: Trend Radar ─── */}
      <div className="lg:col-span-9 rounded-3xl lg:rounded-r-none glass-panel-l3 p-6 border border-white/10 relative overflow-visible">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white tracking-tight">Trend radar</h3>
          <span className="text-[11px] text-slate-500">Hover to connect · click to inspect</span>
        </div>

        {/* Radar Canvas */}
        <div
          className="relative w-full h-[400px] rounded-2xl overflow-visible flex items-center justify-center select-none"
          style={{ background: 'radial-gradient(ellipse at center, #0d0f1a 0%, #080911 100%)' }}
        >
          {/* Animated particle dots for depth */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-[1px] h-[1px] bg-indigo-400/30 rounded-full pointer-events-none"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animation: `pulse ${2 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
              }}
            />
          ))}

          {/* Concentric rings with subtle animation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[120, 220, 340].map((size, i) => (
              <div
                key={`ring-${i}`}
                className="rounded-full border absolute"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  borderColor: `rgba(99, 102, 241, ${0.08 - i * 0.015})`,
                  animation: `pulse ${8 + i * 2}s ease-in-out infinite`,
                }}
              />
            ))}
            {/* Crosshair lines */}
            <div className="w-full h-[1px] absolute" style={{ background: 'linear-gradient(to right, transparent, rgba(99,102,241,0.08), transparent)' }} />
            <div className="h-full w-[1px] absolute" style={{ background: 'linear-gradient(to bottom, transparent, rgba(99,102,241,0.08), transparent)' }} />
          </div>

          {/* Radar sweep glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: 'conic-gradient(from 0deg at 50% 50%, rgba(99, 102, 241, 0.15) 0deg, transparent 50deg, transparent 360deg)',
              animation: 'spin 15s linear infinite'
            }}
          />

          {/* SVG connection lines with animated dashes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
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
                    stroke={isHighlighted ? '#818CF8' : 'rgba(255,255,255,0.06)'}
                    strokeWidth={isHighlighted ? 2.5 : 0.8}
                    strokeDasharray={isHighlighted ? '8 4' : '3 6'}
                    className="transition-all duration-500"
                    filter={isHighlighted ? 'url(#glow)' : undefined}
                    style={{
                      animation: isHighlighted ? 'dash 1.5s linear infinite' : undefined,
                    }}
                  />
                );
              })
            )}
          </svg>

          {/* ─── Interactive Nodes ─── */}
          {opportunities.map(opp => {
            const isSelected = opp.id === selectedId;
            const isHovered = opp.id === hoveredId;
            const isRelated = relatedIds.includes(opp.id);
            const isActive = isSelected || isHovered;

            const statusColor =
              opp.trendDirection === 'Rising' ? '#10B981' :
              opp.trendDirection === 'Stable' ? '#6366F1' :
              opp.trendDirection === 'Saturated' ? '#F59E0B' : '#64748B';

            // Dynamic size based on opportunity score
            const baseSize = isSelected ? 56 : isRelated ? 40 : 34;
            const nodeSize = baseSize + (opp.opportunityScore > 90 ? 6 : 0);

            return (
              <motion.div
                key={opp.id}
                style={{
                  left: `${opp.radarPos.x}%`,
                  top: `${opp.radarPos.y}%`,
                  zIndex: isHovered ? 40 : isSelected ? 30 : isRelated ? 20 : 10,
                }}
                animate={{
                  scale: isHovered ? 1.15 : isSelected ? 1.05 : 1,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onMouseEnter={() => setHoveredId(opp.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectOpportunity(opp)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center gap-1 select-none"
              >
                {/* ─── Hover Tooltip ─── */}
                <AnimatePresence>
                  {isHovered && !isSelected && (
                    <NodeTooltip opp={opp} position={getTooltipPos(opp.radarPos.y)} />
                  )}
                </AnimatePresence>

                {/* Outer glow ring for active/selected */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      width: nodeSize + 20,
                      height: nodeSize + 20,
                      background: `radial-gradient(circle, ${statusColor}20 0%, transparent 70%)`,
                    }}
                  />
                )}

                {/* Node circle */}
                <div className="relative">
                  <motion.div
                    className="rounded-full flex items-center justify-center backdrop-blur-sm"
                    style={{
                      width: nodeSize,
                      height: nodeSize,
                      backgroundColor: isSelected
                        ? `${statusColor}30`
                        : isHovered
                        ? `${statusColor}25`
                        : `${statusColor}12`,
                      border: `2px solid ${isActive ? statusColor : `${statusColor}50`}`,
                      boxShadow: isActive
                        ? `0 0 20px ${statusColor}40, inset 0 0 12px ${statusColor}15`
                        : `0 0 8px ${statusColor}15`,
                    }}
                    animate={{
                      borderColor: isActive ? statusColor : `${statusColor}50`,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className={`font-bold font-mono ${
                      isSelected ? 'text-sm text-white' : 'text-[10px] text-white/70'
                    }`}>
                      v{opp.trendVelocity}
                    </span>
                  </motion.div>

                  {/* Pulse animation for rising trends */}
                  {opp.trendDirection === 'Rising' && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping opacity-20 pointer-events-none"
                      style={{ backgroundColor: statusColor }}
                    />
                  )}
                </div>

                {/* Topic label */}
                <motion.span
                  className={`text-[10px] font-medium whitespace-nowrap transition-colors max-w-[80px] truncate text-center ${
                    isActive ? 'text-white' : isRelated ? 'text-slate-300' : 'text-slate-500'
                  }`}
                  animate={{ opacity: isActive || isRelated ? 1 : 0.7 }}
                >
                  {opp.topic}
                </motion.span>
              </motion.div>
            );
          })}

          {/* Selected node tooltip (persistent) */}
          {selectedOpp && !hoveredId && (
            <div
              className="absolute z-30 pointer-events-none"
              style={{
                left: `${selectedOpp.radarPos.x}%`,
                top: `${selectedOpp.radarPos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <AnimatePresence>
                <NodeTooltip opp={selectedOpp} position={getTooltipPos(selectedOpp.radarPos.y)} />
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mt-4 text-[11px]">
          {[
            { label: 'Rising', color: '#10B981' },
            { label: 'Stable', color: '#6366F1' },
            { label: 'Saturated', color: '#F59E0B' },
            { label: 'Declining', color: '#64748B' },
          ].map(item => (
            <span key={item.label} className="flex items-center gap-1.5" style={{ color: item.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Right: Momentum Movers ─── */}
      <div className="lg:col-span-3 rounded-3xl lg:rounded-l-none glass-panel-l3 p-5 border border-white/10 lg:border-l-0">
        <h3 className="text-sm font-bold text-white mb-5">Momentum movers</h3>

        <div className="space-y-5">
          {momentumMovers.map((opp, idx) => {
            const sparkValues = opp.trajectory?.map(t => t.interest) || [40, 55, 60, 72, 85, 92];
            const momentum = Math.round(opp.trendVelocity * 0.4);

            return (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between gap-3 cursor-pointer group p-2.5 -mx-2.5 rounded-xl hover:bg-white/[0.04] transition-colors"
                onClick={() => onSelectOpportunity(opp)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 shadow-sm" style={{ boxShadow: '0 0 6px rgba(16, 185, 129, 0.4)' }} />
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
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CSS animation for dashed lines */}
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -24; }
        }
      `}</style>
    </div>
  );
};
