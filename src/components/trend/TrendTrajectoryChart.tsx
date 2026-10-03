import React, { useState } from 'react';
import { TrajectoryPoint } from '../../types';
import { TrendState } from '../../features/opportunity-engine/types';
import { TrendingUp, AlertCircle, Info } from 'lucide-react';

interface TrendTrajectoryChartProps {
  trajectory: TrajectoryPoint[];
  topic: string;
  trendState: TrendState;
}

export const TrendTrajectoryChart: React.FC<TrendTrajectoryChartProps> = ({
  trajectory,
  topic,
  trendState,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<TrajectoryPoint | null>(null);

  if (!trajectory || trajectory.length === 0) {
    return null;
  }

  // Calculate coordinates for SVG line
  const width = 460;
  const height = 150;
  const paddingX = 40;
  const paddingY = 24;

  const minInterest = Math.min(...trajectory.map(p => p.interest), 20);
  const maxInterest = Math.max(...trajectory.map(p => p.interest), 100);

  const getX = (index: number) => {
    return paddingX + (index / (trajectory.length - 1)) * (width - paddingX * 2);
  };

  const getY = (val: number) => {
    const norm = (val - minInterest) / (maxInterest - minInterest || 1);
    return height - paddingY - norm * (height - paddingY * 2);
  };

  // Build SVG path
  const points = trajectory.map((p, idx) => ({
    x: getX(idx),
    y: getY(p.interest),
    point: p,
  }));

  const dPath = points.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = points[idx - 1];
    const cx = (prev.x + curr.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
  }, '');

  const areaPath = `${dPath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const stateBadgeClass = 
    trendState === 'Rising' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
    trendState === 'Stable' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
    trendState === 'Saturated' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
    'bg-slate-500/20 text-slate-300 border-slate-500/30';

  return (
    <div className="rounded-3xl glass-panel-l3 p-6 border border-white/10 space-y-4 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-tight">Trend Trajectory</h3>
            <span className="text-[10px] text-slate-400 font-mono">({topic})</span>
          </div>
          <p className="text-[11px] text-slate-400">Normalized interest velocity over the past 30 days</p>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono ${stateBadgeClass}`}>
          {trendState} {trendState === 'Rising' ? '↑' : trendState === 'Declining' ? '↓' : '→'}
        </span>
      </div>

      {/* Chart Canvas */}
      <div className="relative w-full bg-[#080911]/90 rounded-2xl p-3 border border-white/5 flex flex-col justify-between">
        {/* State Zones Background Indicator */}
        <div className="absolute inset-x-3 top-2 flex justify-between text-[9px] font-mono text-slate-600 border-b border-white/5 pb-1 pointer-events-none">
          <span>0% Baseline</span>
          <span className="text-indigo-400/60 font-semibold">Rising Zone &gt; 70</span>
          <span>100 Peak</span>
        </div>

        {/* SVG Curve */}
        <div className="relative h-36 w-full pt-4">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818CF8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#818CF8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gradient fill */}
            <path d={areaPath} fill="url(#curveGradient)" />

            {/* Guide line */}
            <line
              x1={paddingX}
              y1={getY(70)}
              x2={width - paddingX}
              y2={getY(70)}
              stroke="rgba(129, 140, 248, 0.15)"
              strokeDasharray="4 4"
            />

            {/* Main smooth curve */}
            <path
              d={dPath}
              fill="none"
              stroke="#818CF8"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 8px rgba(129, 140, 248, 0.5))' }}
            />

            {/* Points */}
            {points.map((pt, idx) => (
              <g
                key={idx}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredPoint(pt.point)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  fill="#818CF8"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-transform duration-200 group-hover:scale-150"
                  style={{ filter: 'drop-shadow(0 0 6px #818CF8)' }}
                />
              </g>
            ))}
          </svg>

          {/* X-axis Date labels */}
          <div className="flex justify-between px-6 -mt-2">
            {trajectory.map((point, idx) => (
              <span key={idx} className="text-[10px] text-slate-500 font-mono">
                {point.date}
              </span>
            ))}
          </div>
        </div>

        {/* Hover Tooltip Box */}
        <div className="min-h-10 mt-2 flex items-center justify-between text-[11px] px-3 py-1.5 bg-white/[0.03] rounded-xl border border-white/5 transition-all">
          {hoveredPoint ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white font-mono">{hoveredPoint.date}</span>
                <span className="text-indigo-400 font-bold font-mono">
                  {hoveredPoint.interest} Index ({hoveredPoint.change})
                </span>
              </div>
              <span className="text-slate-300 italic truncate max-w-[260px]">
                {hoveredPoint.context}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-400 italic">
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Hover over trajectory points to inspect contextual catalysts and events.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
