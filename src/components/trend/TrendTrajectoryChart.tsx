import React, { useState } from 'react';
import { TrajectoryPoint } from '../../types';
import { TrendState } from '../../features/opportunity-engine/types';

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
  const height = 180;
  const paddingX = 30;
  const paddingY = 20;

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
    <div className="rounded-3xl glass-panel-l3 p-6 border border-white/10 space-y-4 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Trend trajectory</h3>
          <div className="mt-1.5">
            <p className="text-base font-bold text-white">{topic}</p>
            <p className="text-[11px] text-slate-500">Topic interest · last 8 weeks</p>
          </div>
        </div>

        {/* State pills row */}
        <div className="flex items-center gap-0 bg-white/[0.04] rounded-lg border border-white/10 overflow-hidden">
          {(['Rising', 'Stable', 'Saturated', 'Declining'] as const).map(state => (
            <span
              key={state}
              className={`px-3 py-1.5 text-[10px] font-medium transition-colors ${
                state === trendState
                  ? 'bg-white/10 text-white'
                  : 'text-slate-500'
              }`}
            >
              {state}
            </span>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative w-full">
        <div className="relative h-44 w-full">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="trajectoryFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818CF8" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#818CF8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal grid lines */}
            {[0.25, 0.5, 0.75].map(ratio => {
              const y = paddingY + ratio * (height - paddingY * 2);
              return (
                <line
                  key={ratio}
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Gradient fill */}
            <path d={areaPath} fill="url(#trajectoryFill)" />

            {/* Main curve */}
            <path
              d={dPath}
              fill="none"
              stroke="#818CF8"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 6px rgba(129, 140, 248, 0.4))' }}
            />

            {/* Points */}
            {points.map((pt, idx) => (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(pt.point)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4.5"
                  fill="#818CF8"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all duration-200 hover:r-[7]"
                  style={{ filter: 'drop-shadow(0 0 4px #818CF8)' }}
                />
              </g>
            ))}
          </svg>

          {/* X-axis dates */}
          <div className="flex justify-between px-4 mt-1">
            {trajectory.map((point, idx) => (
              <span key={idx} className="text-[10px] text-slate-600 font-mono">
                {point.date}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: State badge + hover hint */}
      <div className="flex items-center justify-between">
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono ${stateBadgeClass}`}>
          {trendState}
        </span>
        <span className="text-[11px] text-slate-600 italic">
          {hoveredPoint
            ? `${hoveredPoint.date}: ${hoveredPoint.interest} index (${hoveredPoint.change})`
            : 'Hover the chart for weekly detail and context.'}
        </span>
      </div>
    </div>
  );
};
