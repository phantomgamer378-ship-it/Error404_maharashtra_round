import React from 'react';

interface SparklineProps {
  data: number[];       // array of values (e.g. interest over time)
  width?: number;
  height?: number;
  color?: string;       // stroke color
  className?: string;
}

/** Tiny inline SVG sparkline trend chart */
export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 80,
  height = 28,
  color = '#818CF8',
  className = '',
}) => {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  const polylinePoints = points.join(' ');

  // Create gradient fill area
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const fillPoints = `${polylinePoints} ${width},${height} 0,${height}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`${className}`}
      role="img"
      aria-label="Trend sparkline"
    >
      {/* Gradient fill */}
      <defs>
        <linearGradient id={`sparkFill-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={fillPoints}
        fill={`url(#sparkFill-${color.replace('#','')})`}
      />
      {/* Line */}
      <polyline
        points={polylinePoints}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* End dot */}
      {data.length > 0 && (
        <circle
          cx={width}
          cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
          r="2.5"
          fill={color}
          className="animate-pulse"
        />
      )}
    </svg>
  );
};
