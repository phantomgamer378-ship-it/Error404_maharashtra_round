import React from 'react';

interface TrendFilterBarProps {
  selectedPlatform: string;
  onChangePlatform: (val: string) => void;
  selectedNiche: string;
  onChangeNiche: (val: string) => void;
  selectedState: string;
  onChangeState: (val: string) => void;
  sortBy: 'opportunity' | 'velocity' | 'fit';
  onChangeSortBy: (val: 'opportunity' | 'velocity' | 'fit') => void;
  totalCount: number;
}

const TREND_STATES = ['Rising', 'Stable', 'Saturated', 'Declining'] as const;

export const TrendFilterBar: React.FC<TrendFilterBarProps> = ({
  selectedPlatform,
  onChangePlatform,
  selectedNiche,
  onChangeNiche,
  selectedState,
  onChangeState,
  sortBy,
  onChangeSortBy,
  totalCount,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Left: Trend state pills + dropdowns */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Trend state pill buttons */}
        {TREND_STATES.map((state) => {
          const isActive = selectedState === state;
          return (
            <button
              key={state}
              onClick={() => onChangeState(isActive ? 'All' : state)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                isActive
                  ? 'bg-white/10 border-white/30 text-white'
                  : 'bg-transparent border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300'
              }`}
            >
              {state}
            </button>
          );
        })}

        {/* Platform dropdown */}
        <select
          value={selectedPlatform}
          onChange={(e) => onChangePlatform(e.target.value)}
          className="bg-transparent border border-white/10 text-slate-300 rounded-full px-3.5 py-1.5 focus:outline-none focus:border-white/30 cursor-pointer appearance-none text-xs"
          style={{ backgroundImage: 'none' }}
        >
          <option value="All" className="bg-[#0b0d17]">All platforms</option>
          <option value="TikTok" className="bg-[#0b0d17]">TikTok</option>
          <option value="YouTube Shorts" className="bg-[#0b0d17]">YouTube Shorts</option>
          <option value="LinkedIn" className="bg-[#0b0d17]">LinkedIn</option>
          <option value="Instagram" className="bg-[#0b0d17]">Instagram</option>
          <option value="X (Twitter)" className="bg-[#0b0d17]">X (Twitter)</option>
        </select>

        {/* Niche dropdown */}
        <select
          value={selectedNiche}
          onChange={(e) => onChangeNiche(e.target.value)}
          className="bg-transparent border border-white/10 text-slate-300 rounded-full px-3.5 py-1.5 focus:outline-none focus:border-white/30 cursor-pointer appearance-none text-xs"
        >
          <option value="All" className="bg-[#0b0d17]">All niches</option>
          <option value="Cybersecurity" className="bg-[#0b0d17]">Cybersecurity & AI</option>
          <option value="Technology" className="bg-[#0b0d17]">Technology</option>
          <option value="Student Tech" className="bg-[#0b0d17]">Student Tech</option>
          <option value="Productivity" className="bg-[#0b0d17]">Productivity</option>
        </select>

        {/* Sort dropdown */}
        <select
          value={`Sort: ${sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}`}
          onChange={(e) => {
            const val = e.target.value.replace('Sort: ', '').toLowerCase();
            if (val === 'opportunity' || val === 'velocity' || val === 'fit') {
              onChangeSortBy(val as 'opportunity' | 'velocity' | 'fit');
            }
          }}
          className="bg-transparent border border-white/10 text-slate-300 rounded-full px-3.5 py-1.5 focus:outline-none focus:border-white/30 cursor-pointer appearance-none text-xs"
        >
          <option value="Sort: Opportunity" className="bg-[#0b0d17]">Sort: Opportunity</option>
          <option value="Sort: Velocity" className="bg-[#0b0d17]">Sort: Velocity</option>
          <option value="Sort: Fit" className="bg-[#0b0d17]">Sort: Fit</option>
        </select>
      </div>

      {/* Right: Count */}
      <span className="text-slate-500 text-xs">
        {totalCount} opportunities · estimated from available signals
      </span>
    </div>
  );
};
