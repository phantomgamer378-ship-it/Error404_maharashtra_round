import React from 'react';

interface ScoreRingProps {
  score: number;       // 0-100
  size?: number;       // px diameter
  strokeWidth?: number;
  label?: string;
  color?: string;      // tailwind color class or hex
  className?: string;
}

/** SVG radial score ring — used for opportunity scores, fit metrics, etc. */
export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 64,
  strokeWidth = 5,
  label,
  color,
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = size / 2;

  // Determine color based on score ranges
  const resolvedColor = color ?? (
    score >= 85 ? '#818CF8'  // indigo for high
    : score >= 65 ? '#10B981' // emerald for medium
    : '#F59E0B'               // amber for low
  );

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        role="img"
        aria-label={`Score: ${score} out of 100`}
      >
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Score arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={resolvedColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          style={{ filter: `drop-shadow(0 0 6px ${resolvedColor}44)` }}
        />
      </svg>
      {/* Center score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-extrabold text-white font-mono leading-none">{score}</span>
        {label && (
          <span className="text-[8px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">{label}</span>
        )}
      </div>
    </div>
  );
};
