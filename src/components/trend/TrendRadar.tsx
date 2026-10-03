import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Radar,
  Network,
  LayoutGrid,
  Radio,
  Shield,
  Bot,
  Mic,
  Video,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  Crosshair,
  Sliders,
} from 'lucide-react';
import { ScoredOpportunity } from '../../features/opportunity-engine/types';

interface TrendRadarProps {
  opportunities: ScoredOpportunity[];
  selectedId: string;
  onSelectOpportunity: (opp: ScoredOpportunity) => void;
  onStartCreate?: (opp: ScoredOpportunity) => void;
}

type RadarMode = 'sonar' | 'neural' | 'matrix';
type TimeHorizon = '24h' | '7d' | '30d' | 'predictive';

/* ─── Category Icon Resolver ─── */
const getTopicIcon = (topic: string, category: string) => {
  const text = `${topic} ${category}`.toLowerCase();
  if (text.includes('voice') || text.includes('audio')) return Mic;
  if (text.includes('agent') || text.includes('autonomous') || text.includes('bot')) return Bot;
  if (text.includes('deepfake') || text.includes('video') || text.includes('reel')) return Video;
  if (text.includes('college') || text.includes('student') || text.includes('study')) return GraduationCap;
  if (text.includes('security') || text.includes('scam') || text.includes('phishing')) return Shield;
  return Sparkles;
};

/* ─── State Styling Config ─── */
const getStateConfig = (direction: string) => {
  switch (direction) {
    case 'Rising':
      return {
        color: '#10B981',
        bg: 'bg-emerald-500/15',
        border: 'border-emerald-500/40',
        text: 'text-emerald-400',
        glow: 'rgba(16, 185, 129, 0.45)',
        icon: TrendingUp,
      };
    case 'Stable':
      return {
        color: '#6366F1',
        bg: 'bg-indigo-500/15',
        border: 'border-indigo-500/40',
        text: 'text-indigo-400',
        glow: 'rgba(99, 102, 241, 0.45)',
        icon: Minus,
      };
    case 'Saturated':
      return {
        color: '#F59E0B',
        bg: 'bg-amber-500/15',
        border: 'border-amber-500/40',
        text: 'text-amber-400',
        glow: 'rgba(245, 158, 11, 0.45)',
        icon: Zap,
      };
    default:
      return {
        color: '#94A3B8',
        bg: 'bg-slate-500/15',
        border: 'border-slate-500/40',
        text: 'text-slate-400',
        glow: 'rgba(148, 163, 184, 0.3)',
        icon: TrendingDown,
      };
  }
};

/* ─── Mini Sparkline for Momentum Sidebar ─── */
const MiniSparkline: React.FC<{ values: number[]; color?: string }> = ({ values, color = '#818CF8' }) => {
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
  const gradId = `sparkGrad-${Math.abs(values.reduce((a, b) => a + b, 0))}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0 overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradId})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.length > 0 && (
        <circle
          cx={pts[pts.length - 1].split(',')[0]}
          cy={pts[pts.length - 1].split(',')[1]}
          r="3"
          fill={color}
          className="animate-pulse"
        />
      )}
    </svg>
  );
};

/* ─── Animated Audio/Signal Equalizer ─── */
const SignalWaveform: React.FC<{ active: boolean; color: string }> = ({ active, color }) => {
  return (
    <div className="flex items-end gap-[3px] h-3.5 px-1">
      {[0.4, 0.9, 0.6, 1.0, 0.7].map((height, i) => (
        <motion.span
          key={i}
          className="w-[2.5px] rounded-full"
          style={{ backgroundColor: color }}
          animate={{
            height: active ? [`${height * 14}px`, `${(1 - height * 0.4) * 14}px`, `${height * 14}px`] : '4px',
            opacity: active ? [0.6, 1, 0.6] : 0.3,
          }}
          transition={{
            duration: 0.8 + i * 0.15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
};

/* ─── Rich Data Popping Popover HUD ─── */
interface NodePopoverProps {
  opp: ScoredOpportunity;
  timeHorizon: TimeHorizon;
  position: 'top' | 'bottom';
  onSelect: () => void;
  onStartCreate?: (opp: ScoredOpportunity) => void;
}

const NodePopover: React.FC<NodePopoverProps> = ({
  opp,
  timeHorizon,
  position,
  onSelect,
  onStartCreate,
}) => {
  const cfg = getStateConfig(opp.trendDirection);
  const StateIcon = cfg.icon;
  const TopicIcon = getTopicIcon(opp.topic, opp.category);

  // Time adjusted velocity estimate
  const horizonMultiplier =
    timeHorizon === '24h' ? 1.08 : timeHorizon === '30d' ? 0.94 : timeHorizon === 'predictive' ? 1.15 : 1.0;
  const displayVelocity = Math.min(99, Math.round(opp.trendVelocity * horizonMultiplier));

  const weeklyDelta =
    opp.trendDirection === 'Rising'
      ? `+${Math.round(opp.trendVelocity * 0.42)}%`
      : opp.trendDirection === 'Declining'
      ? `-${Math.round(opp.trendVelocity * 0.28)}%`
      : `+${Math.round(opp.trendVelocity * 0.08)}%`;

  // Insight reasoning snippet
  const insightSnippet =
    opp.whyNowReasoning?.[0] ||
    opp.summary ||
    'High velocity breakout signal detected across search & video feeds.';

  return (
    <motion.div
      initial={{ opacity: 0, y: position === 'top' ? 12 : -12, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: position === 'top' ? 8 : -8, scale: 0.92 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute z-50 pointer-events-auto ${
        position === 'top' ? 'bottom-full mb-3.5' : 'top-full mt-3.5'
      } left-1/2 -translate-x-1/2 w-[310px] select-none`}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="rounded-2xl bg-[#0d0f1b]/95 backdrop-blur-2xl border border-white/15 shadow-2xl overflow-hidden"
        style={{
          boxShadow: `0 16px 48px -8px rgba(0,0,0,0.8), 0 0 32px -4px ${cfg.glow}`,
        }}
      >
        {/* Top telemetry bar */}
        <div className="px-3.5 py-1.5 bg-white/[0.03] border-b border-white/[0.06] flex items-center justify-between text-[9px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300 uppercase tracking-widest font-semibold">SIGNAL TELEMETRY</span>
          </div>
          <div className="flex items-center gap-2">
            <SignalWaveform active={true} color={cfg.color} />
            <span className="text-slate-400">{timeHorizon.toUpperCase()}</span>
          </div>
        </div>

        {/* Header: Title + Category + Direction */}
        <div className="px-4 pt-3.5 pb-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border"
                style={{
                  backgroundColor: `${cfg.color}15`,
                  borderColor: `${cfg.color}35`,
                }}
              >
                <TopicIcon className="w-4 h-4" style={{ color: cfg.color }} />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white tracking-tight truncate leading-tight">
                  {opp.topic}
                </h4>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                  {opp.category}
                </p>
              </div>
            </div>

            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 flex items-center gap-1 ${cfg.bg} ${cfg.border} ${cfg.text}`}
            >
              <StateIcon className="w-3 h-3" />
              {opp.trendDirection}
            </span>
          </div>
        </div>

        {/* 4-Cell Metric Grid with Data "Pops" */}
        <div className="px-4 py-2 grid grid-cols-2 gap-2 bg-white/[0.015]">
          {/* Metric 1: Velocity */}
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono uppercase tracking-wider">
              <span>Velocity</span>
              <span className={`font-bold ${cfg.text}`}>{weeklyDelta}</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-extrabold text-white font-mono">{displayVelocity}</span>
              <span className="text-[10px] text-slate-500 font-mono">/100</span>
            </div>
            <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden mt-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${displayVelocity}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full"
                style={{ backgroundColor: cfg.color }}
              />
            </div>
          </div>

          {/* Metric 2: Creator & Audience Fit */}
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono uppercase tracking-wider">
              <span>Audience Fit</span>
              <span className="text-indigo-300 font-bold">MATCH</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-extrabold text-white font-mono">{opp.audienceFit}</span>
              <span className="text-[10px] text-slate-500 font-mono">/100</span>
            </div>
            <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden mt-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${opp.audienceFit}%` }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
              />
            </div>
          </div>

          {/* Metric 3: Saturation */}
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono uppercase tracking-wider">
              <span>Saturation</span>
              <span className="text-amber-300 font-bold">{opp.competition}</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-extrabold text-white font-mono">{opp.competitionScore}</span>
              <span className="text-[10px] text-slate-500 font-mono">/100</span>
            </div>
            <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden mt-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${opp.competitionScore}%` }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="h-full rounded-full bg-amber-400"
              />
            </div>
          </div>

          {/* Metric 4: Opportunity Score */}
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/25">
            <div className="flex items-center justify-between text-[9px] text-indigo-300 font-mono uppercase tracking-wider">
              <span>Opportunity</span>
              <span className="text-indigo-400 font-bold">ALPHA</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-extrabold text-indigo-200 font-mono">{opp.opportunityScore}</span>
              <span className="text-[10px] text-indigo-400/70 font-mono">/100</span>
            </div>
            <div className="w-full h-1 bg-indigo-950 rounded-full overflow-hidden mt-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${opp.opportunityScore}%` }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"
              />
            </div>
          </div>
        </div>

        {/* AI Insight Catalyst Note */}
        <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/[0.06]">
          <div className="flex items-start gap-2">
            <span className="text-[10px] text-indigo-400 font-mono font-bold shrink-0 mt-0.5">⚡ CATALYST:</span>
            <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
              {insightSnippet}
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-4 py-2.5 bg-white/[0.04] border-t border-white/[0.08] flex items-center justify-between gap-2">
          <button
            onClick={() => onSelect()}
            className="text-[10px] text-slate-400 hover:text-white transition-colors font-mono flex items-center gap-1"
          >
            <span>Lock Target Details</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>

          {onStartCreate && (
            <button
              onClick={() => onStartCreate(opp)}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-[10px] flex items-center gap-1.5 shadow-md shadow-indigo-500/25 transition-all"
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>Create Idea</span>
            </button>
          )}
        </div>
      </div>

      {/* Pointing triangle */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-[#0d0f1b] border border-white/15 ${
          position === 'top'
            ? 'bottom-[-7px] border-t-0 border-l-0'
            : 'top-[-7px] border-b-0 border-r-0'
        }`}
      />
    </motion.div>
  );
};

/* ─── Main TrendRadar Component ─── */
export const TrendRadar: React.FC<TrendRadarProps> = ({
  opportunities,
  selectedId,
  onSelectOpportunity,
  onStartCreate,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mode, setMode] = useState<RadarMode>('sonar');
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('7d');
  const [showSweep, setShowSweep] = useState(true);
  const [showSynapses, setShowSynapses] = useState(true);

  // Active targeted opportunity
  const selectedOpp = useMemo(() => {
    return opportunities.find((o) => o.id === selectedId) || opportunities[0];
  }, [opportunities, selectedId]);

  const activeOpp = useMemo(() => {
    if (hoveredId) return opportunities.find((o) => o.id === hoveredId) || selectedOpp;
    return selectedOpp;
  }, [hoveredId, opportunities, selectedOpp]);

  const relatedIds = useMemo(() => {
    return activeOpp?.relatedTopicIds || [];
  }, [activeOpp]);

  // Momentum movers sorted by velocity & trend direction
  const momentumMovers = useMemo(() => {
    return [...opportunities]
      .sort((a, b) => b.trendVelocity - a.trendVelocity)
      .slice(0, 4);
  }, [opportunities]);

  // Compute position based on selected mode
  const getNodeCoordinates = useCallback(
    (opp: ScoredOpportunity, idx: number, total: number) => {
      if (mode === 'sonar') {
        // Orbital Sonar Position: Map based on velocity (distance from center) and angle
        // Closer to center = higher opportunity / velocity
        const base = opp.radarPos || { x: 50, y: 50 };
        // Apply slight offset depending on time horizon for dynamic response
        const offset =
          timeHorizon === '24h'
            ? { x: (base.x - 50) * 1.05 + 50, y: (base.y - 50) * 1.05 + 50 }
            : timeHorizon === '30d'
            ? { x: (base.x - 50) * 0.95 + 50, y: (base.y - 50) * 0.95 + 50 }
            : base;
        return {
          x: Math.max(14, Math.min(86, offset.x)),
          y: Math.max(14, Math.min(86, offset.y)),
        };
      } else if (mode === 'neural') {
        // Constellation graph: Arrange in dynamic organic ring with connections
        const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
        const radius = 32 + (idx % 2 === 0 ? 6 : -6);
        return {
          x: 50 + radius * Math.cos(angle) * 1.1,
          y: 50 + radius * Math.sin(angle),
        };
      } else {
        // Opportunity Matrix:
        // X-axis: Competition/Saturation (Low = 20%, High = 80%)
        // Y-axis: Velocity (High = 20% [top], Low = 80% [bottom])
        const compX = 18 + (opp.competitionScore / 100) * 64;
        const velY = 82 - (opp.trendVelocity / 100) * 64;
        return { x: compX, y: velY };
      }
    },
    [mode, timeHorizon]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
      {/* ─── Left Canvas: Futuristic Trend Radar (9 cols) ─── */}
      <div className="lg:col-span-9 rounded-3xl lg:rounded-r-none glass-panel-l3 p-6 border border-white/10 relative overflow-visible flex flex-col justify-between">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/[0.06]">
          {/* Title & Live Status */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px] flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#0a0c16] rounded-[11px] flex items-center justify-center">
                <Radar className="w-4 h-4 text-indigo-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">Trend Radar</h3>
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-mono font-bold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE SIGNALS
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Interactive opportunity radar · Hover to lock telemetry · Click to inspect
              </p>
            </div>
          </div>

          {/* Interactive Mode & Time Switches */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Projection Mode Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
              <button
                onClick={() => setMode('sonar')}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] flex items-center gap-1.5 transition-all ${
                  mode === 'sonar'
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Orbital Sonar Scope"
              >
                <Radar className="w-3.5 h-3.5" />
                <span>Sonar</span>
              </button>

              <button
                onClick={() => setMode('neural')}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] flex items-center gap-1.5 transition-all ${
                  mode === 'neural'
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Neural Synapse Constellation"
              >
                <Network className="w-3.5 h-3.5" />
                <span>Synapse</span>
              </button>

              <button
                onClick={() => setMode('matrix')}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] flex items-center gap-1.5 transition-all ${
                  mode === 'matrix'
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Velocity vs Saturation Quadrants"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Matrix</span>
              </button>
            </div>

            {/* Time Horizon Pills */}
            <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
              {(['24h', '7d', '30d', 'predictive'] as TimeHorizon[]).map((th) => (
                <button
                  key={th}
                  onClick={() => setTimeHorizon(th)}
                  className={`px-2 py-1 rounded-lg font-mono text-[10px] transition-all uppercase ${
                    timeHorizon === th
                      ? 'bg-white/15 text-white font-bold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {th === 'predictive' ? '🔮 14d' : th}
                </button>
              ))}
            </div>

            {/* Quick toggles */}
            <button
              onClick={() => setShowSweep((prev) => !prev)}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                showSweep
                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                  : 'bg-white/5 border-white/10 text-slate-500'
              }`}
              title="Toggle Radar Sweep Beam"
            >
              <Radio className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ─── The Main Interactive Radar Canvas ─── */}
        <div
          className="relative w-full h-[460px] rounded-2xl overflow-visible flex items-center justify-center select-none"
          style={{
            background:
              mode === 'matrix'
                ? 'radial-gradient(ellipse at center, #0c0e1a 0%, #07080f 100%)'
                : 'radial-gradient(circle at center, #0e1122 0%, #080912 60%, #05060b 100%)',
          }}
          onClick={() => setHoveredId(null)}
        >
          {/* Subtle Cyber Grid Lines & Star Particle Dust */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {/* Hexagon/Subtle Grid Mesh */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Star particles */}
            {[
              { left: '12%', top: '24%', size: 2, delay: 0 },
              { left: '85%', top: '18%', size: 1.5, delay: 1.2 },
              { left: '22%', top: '78%', size: 2, delay: 0.7 },
              { left: '76%', top: '82%', size: 1.5, delay: 2.1 },
              { left: '48%', top: '15%', size: 2.5, delay: 1.8 },
              { left: '92%', top: '55%', size: 1, delay: 0.4 },
              { left: '8%', top: '58%', size: 2, delay: 2.5 },
            ].map((p, i) => (
              <div
                key={`star-${i}`}
                className="absolute bg-indigo-300/40 rounded-full animate-pulse pointer-events-none"
                style={{
                  left: p.left,
                  top: p.top,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  animationDelay: `${p.delay}s`,
                }}
              />
            ))}
          </div>

          {/* ── Mode 1 & 2 Background: Sonar & Synapse Rings ── */}
          {mode !== 'matrix' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Outer Azimuth Degree Markings */}
              <div className="w-[430px] h-[430px] rounded-full border border-indigo-500/10 absolute flex items-center justify-center">
                {['000°', '045°', '090°', '135°', '180°', '225°', '270°', '315°'].map((deg, i) => {
                  const angle = (i * 45 * Math.PI) / 180;
                  const r = 205;
                  const x = r * Math.cos(angle);
                  const y = r * Math.sin(angle);
                  return (
                    <span
                      key={deg}
                      className="absolute text-[8px] font-mono text-slate-600 tracking-wider"
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                    >
                      {deg}
                    </span>
                  );
                })}
              </div>

              {/* Concentric Orbital Range Rings */}
              {[
                { size: 130, label: 'CORE BREAKOUT (90+)', color: 'rgba(99, 102, 241, 0.2)' },
                { size: 250, label: 'GROWTH ORBIT (75+)', color: 'rgba(99, 102, 241, 0.12)' },
                { size: 370, label: 'EMERGING HORIZON (50+)', color: 'rgba(99, 102, 241, 0.07)' },
              ].map((ring, i) => (
                <div
                  key={`ring-${i}`}
                  className="rounded-full border absolute flex items-start justify-center transition-all duration-700"
                  style={{
                    width: `${ring.size}px`,
                    height: `${ring.size}px`,
                    borderColor: ring.color,
                  }}
                >
                  <span className="text-[8px] font-mono text-indigo-400/40 tracking-wider -translate-y-2 px-1 bg-[#090b14]">
                    {ring.label}
                  </span>
                </div>
              ))}

              {/* Stadium capsule track lines from user reference UI */}
              <div
                className="w-[380px] h-[210px] rounded-[110px] border border-white/[0.04] absolute pointer-events-none"
              />
              <div
                className="w-[300px] h-[150px] rounded-[80px] border border-white/[0.03] absolute pointer-events-none"
              />

              {/* Crosshair Axes */}
              <div className="w-full h-[1px] absolute bg-gradient-to-r from-transparent via-indigo-500/15 to-transparent" />
              <div className="h-full w-[1px] absolute bg-gradient-to-b from-transparent via-indigo-500/15 to-transparent" />

              {/* Center Bullseye Pivot */}
              <div className="w-5 h-5 rounded-full border border-indigo-500/40 flex items-center justify-center bg-indigo-950/40">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
              </div>
            </div>
          )}

          {/* ── Mode 3 Background: Matrix Quadrants ── */}
          {mode === 'matrix' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-8">
              {/* Quadrant Crosshair lines */}
              <div className="w-full h-[1px] absolute bg-gradient-to-r from-white/5 via-indigo-500/30 to-white/5" />
              <div className="h-full w-[1px] absolute bg-gradient-to-b from-white/5 via-indigo-500/30 to-white/5" />

              {/* Axis Labels */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-mono font-bold text-indigo-400 tracking-wider flex items-center gap-1.5">
                <span>VELOCITY ↑</span>
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-indigo-400 tracking-wider flex items-center gap-1.5">
                <span>MARKET SATURATION →</span>
              </div>

              {/* 4 Quadrant Background Banners */}
              <div className="absolute top-4 left-6 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                ⚡ BREAKOUT GOLDMINE (High Velocity · Low Saturation)
              </div>
              <div className="absolute top-4 right-6 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold">
                🔥 MAINSTREAM VIRAL (High Velocity · High Saturation)
              </div>
              <div className="absolute bottom-6 left-6 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[10px] font-bold">
                🎯 NICHE BLUE OCEANS (Low Competition · Emerging)
              </div>
              <div className="absolute bottom-6 right-6 px-3 py-1 rounded-lg bg-slate-500/10 border border-slate-500/20 text-slate-400 font-mono text-[10px] font-bold">
                ⏳ MATURE / SATURATED
              </div>
            </div>
          )}

          {/* ── High-Tech Radar Sweep Beam ── */}
          {mode !== 'matrix' && showSweep && (
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
              style={{
                maskImage: 'radial-gradient(circle at center, black 65%, transparent 75%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 65%, transparent 75%)',
              }}
            >
              <div
                className="w-full h-full"
                style={{
                  background:
                    'conic-gradient(from 0deg at 50% 50%, rgba(99, 102, 241, 0.28) 0deg, rgba(56, 189, 248, 0.12) 25deg, transparent 55deg, transparent 360deg)',
                  animation: 'radarSpin 12s linear infinite',
                }}
              />
            </div>
          )}

          {/* ── SVG Connection Synapses / Data Streams ── */}
          {showSynapses && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="activeLinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818CF8" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#38BDF8" stopOpacity="1" />
                  <stop offset="100%" stopColor="#818CF8" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {opportunities.map((node, nodeIdx) => {
                const nodePos = getNodeCoordinates(node, nodeIdx, opportunities.length);

                return (node.relatedTopicIds || []).map((relId) => {
                  const targetIdx = opportunities.findIndex((o) => o.id === relId);
                  if (targetIdx === -1) return null;
                  const target = opportunities[targetIdx];
                  const targetPos = getNodeCoordinates(target, targetIdx, opportunities.length);

                  const isDirectLink =
                    (activeOpp?.id === node.id && relatedIds.includes(target.id)) ||
                    (activeOpp?.id === target.id && relatedIds.includes(node.id));

                  if (!isDirectLink && mode === 'matrix') return null;

                  return (
                    <g key={`${node.id}-${target.id}`}>
                      {/* Base line */}
                      <line
                        x1={`${nodePos.x}%`}
                        y1={`${nodePos.y}%`}
                        x2={`${targetPos.x}%`}
                        y2={`${targetPos.y}%`}
                        stroke={isDirectLink ? 'url(#activeLinkGrad)' : 'rgba(255,255,255,0.06)'}
                        strokeWidth={isDirectLink ? 2.5 : 0.8}
                        strokeDasharray={isDirectLink ? '6 4' : '3 6'}
                        filter={isDirectLink ? 'url(#laserGlow)' : undefined}
                        className="transition-all duration-500"
                        style={{
                          animation: isDirectLink ? 'dashFlow 1.2s linear infinite' : undefined,
                        }}
                      />

                      {/* Moving light photon bead on active links */}
                      {isDirectLink && (
                        <circle r="3.5" fill="#38BDF8" className="animate-pulse">
                          <animateMotion
                            path={`M ${(nodePos.x * 400) / 100},${(nodePos.y * 400) / 100} L ${
                              (targetPos.x * 400) / 100
                            },${(targetPos.y * 400) / 100}`}
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  );
                });
              })}
            </svg>
          )}

          {/* ── Interactive Radar Nodes ── */}
          {opportunities.map((opp, idx) => {
            const isSelected = opp.id === selectedId;
            const isHovered = opp.id === hoveredId;
            const isRelated = relatedIds.includes(opp.id);
            const isActive = isSelected || isHovered;
            const isDimmed = (hoveredId || selectedId) && !isActive && !isRelated;

            const pos = getNodeCoordinates(opp, idx, opportunities.length);
            const cfg = getStateConfig(opp.trendDirection);
            const TopicIcon = getTopicIcon(opp.topic, opp.category);

            // Node size based on status and importance
            const baseSize = isSelected ? 56 : isActive ? 50 : isRelated ? 42 : 36;
            const nodeSize = baseSize + (opp.opportunityScore > 90 ? 4 : 0);

            return (
              <motion.div
                key={opp.id}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  zIndex: isHovered ? 45 : isSelected ? 40 : isRelated ? 25 : 10,
                }}
                animate={{
                  scale: isHovered ? 1.18 : isSelected ? 1.1 : 1,
                  opacity: isDimmed ? 0.28 : 1,
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 24 }}
                onMouseEnter={() => setHoveredId(opp.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectOpportunity(opp);
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center gap-1.5 select-none group"
              >
                {/* ── Sci-Fi Targeting Reticle HUD (when hovered/active) ── */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    className="absolute -inset-4 pointer-events-none"
                  >
                    {/* Corner bracket reticles */}
                    <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-indigo-400" />
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-indigo-400" />
                    <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-indigo-400" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-indigo-400" />

                    {/* Coordinate Badge */}
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold text-indigo-300 tracking-wider bg-[#0a0c16]/90 px-1.5 py-0.5 rounded border border-indigo-500/40 whitespace-nowrap">
                      TARGET: {opp.trendVelocity}v
                    </span>
                  </motion.div>
                )}

                {/* ── Hover / Active Popover Card ── */}
                <AnimatePresence>
                  {isHovered && (
                    <NodePopover
                      opp={opp}
                      timeHorizon={timeHorizon}
                      position={pos.y < 42 ? 'bottom' : 'top'}
                      onSelect={() => onSelectOpportunity(opp)}
                      onStartCreate={onStartCreate}
                    />
                  )}
                </AnimatePresence>

                {/* Outer glowing halo */}
                <div
                  className={`absolute rounded-full transition-all duration-300 pointer-events-none ${
                    isActive ? 'opacity-100 scale-125' : isRelated ? 'opacity-50 scale-110' : 'opacity-0 scale-90'
                  }`}
                  style={{
                    width: nodeSize + 18,
                    height: nodeSize + 18,
                    background: `radial-gradient(circle, ${cfg.glow} 0%, transparent 70%)`,
                  }}
                />

                {/* Node Orb with Icon & Velocity */}
                <div className="relative">
                  <motion.div
                    className="rounded-full flex flex-col items-center justify-center backdrop-blur-md transition-all shadow-lg"
                    style={{
                      width: nodeSize,
                      height: nodeSize,
                      backgroundColor: isSelected
                        ? `${cfg.color}35`
                        : isHovered
                        ? `${cfg.color}25`
                        : `${cfg.color}14`,
                      border: `2px solid ${isActive ? cfg.color : `${cfg.color}55`}`,
                      boxShadow: isActive
                        ? `0 0 24px ${cfg.glow}, inset 0 0 14px ${cfg.color}30`
                        : `0 0 10px ${cfg.color}15`,
                    }}
                  >
                    <TopicIcon
                      className={`transition-transform duration-300 ${
                        isActive ? 'scale-110' : ''
                      }`}
                      style={{
                        width: isSelected ? '18px' : '15px',
                        height: isSelected ? '18px' : '15px',
                        color: isActive ? '#FFFFFF' : cfg.color,
                      }}
                    />
                    <span
                      className={`font-extrabold font-mono leading-none mt-0.5 ${
                        isSelected ? 'text-[11px] text-white' : 'text-[9px] text-white/80'
                      }`}
                    >
                      v{opp.trendVelocity}
                    </span>
                  </motion.div>

                  {/* Pulsing Beacon Ring for Rising Breakouts */}
                  {opp.trendDirection === 'Rising' && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping opacity-30 pointer-events-none"
                      style={{ backgroundColor: cfg.color }}
                    />
                  )}
                </div>

                {/* Topic Label */}
                <div
                  className={`px-2 py-0.5 rounded-md transition-all max-w-[100px] truncate text-center ${
                    isActive
                      ? 'bg-white/10 text-white font-bold text-[11px] shadow-sm'
                      : isRelated
                      ? 'text-slate-200 font-semibold text-[10px]'
                      : 'text-slate-400 font-medium text-[10px]'
                  }`}
                >
                  {opp.topic}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ─── Bottom Status Legend & HUD Readouts ─── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-white/[0.06] text-xs">
          {/* Trend State Colors */}
          <div className="flex items-center gap-5 text-[11px]">
            {[
              { label: 'Rising', color: '#10B981', desc: 'Accelerating velocity' },
              { label: 'Stable', color: '#6366F1', desc: 'Sustained interest' },
              { label: 'Saturated', color: '#F59E0B', desc: 'Heavy creator competition' },
              { label: 'Declining', color: '#94A3B8', desc: 'Fading momentum' },
            ].map((item) => (
              <span key={item.label} className="flex items-center gap-1.5" title={item.desc}>
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-sm"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 0 8px ${item.color}60`,
                  }}
                />
                <span className="font-medium text-slate-300">{item.label}</span>
              </span>
            ))}
          </div>

          {/* Quick HUD Tip */}
          <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
            <Crosshair className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target locked: <strong className="text-white font-bold">{activeOpp.topic}</strong> (Score {activeOpp.opportunityScore})</span>
          </div>
        </div>
      </div>

      {/* ─── Right Sidebar: Momentum Movers (3 cols) ─── */}
      <div className="lg:col-span-3 rounded-3xl lg:rounded-l-none glass-panel-l3 p-5 border border-white/10 lg:border-l-0 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white tracking-tight">Momentum Movers</h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[9px] font-mono font-bold text-emerald-400">
              TOP VELOCITY
            </span>
          </div>

          <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
            Fastest growing topic vectors in your niche over the last 7 days. Hover to target radar node.
          </p>

          {/* List of Movers */}
          <div className="space-y-3">
            {momentumMovers.map((opp, idx) => {
              const sparkValues =
                opp.trajectory?.map((t) => t.interest) || [35, 48, 62, 75, 88, 95];
              const momentum = Math.round(opp.trendVelocity * 0.4);
              const isHovered = hoveredId === opp.id;
              const isSelected = selectedId === opp.id;
              const cfg = getStateConfig(opp.trendDirection);

              return (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500/40 shadow-lg shadow-indigo-600/15'
                      : isHovered
                      ? 'bg-white/[0.06] border-white/20'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/15'
                  }`}
                  onMouseEnter={() => setHoveredId(opp.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => onSelectOpportunity(opp)}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-slate-400 flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                        {opp.topic}
                      </h4>
                    </div>

                    <span className="text-[10px] font-mono font-bold text-emerald-400 shrink-0">
                      +{momentum}%
                    </span>
                  </div>

                  <div className="flex items-end justify-between gap-2 pt-1 border-t border-white/[0.04]">
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase block">
                        VELOCITY / FIT
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-300">
                        {opp.trendVelocity} <span className="text-slate-500">·</span> {opp.audienceFit}
                      </span>
                    </div>

                    <MiniSparkline values={sparkValues} color={cfg.color} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Fast Action Prompt */}
        <div className="mt-5 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-purple-950/40 border border-indigo-500/25">
          <div className="flex items-center gap-2 mb-1.5">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span className="text-[11px] font-bold text-white font-mono">OPPORTUNITY PRO TIP</span>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed">
            Rising topics with <strong className="text-emerald-400">low saturation</strong> yield 3.4x higher conversion into subscribers.
          </p>
        </div>
      </div>

      {/* Embedded High-Tech Keyframe Styles */}
      <style>{`
        @keyframes radarSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes dashFlow {
          to { stroke-dashoffset: -20; }
        }
      `}</style>
    </div>
  );
};
