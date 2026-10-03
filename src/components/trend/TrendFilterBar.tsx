import React from 'react';
import { Filter, ArrowUpDown, SlidersHorizontal, Sparkles } from 'lucide-react';

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
    <div className="rounded-2xl glass-panel-l2 p-3 sm:p-4 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Left: Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-slate-400 font-medium flex items-center gap-1.5 mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
          Filter:
        </span>

        {/* Platform Selector */}
        <select
          value={selectedPlatform}
          onChange={(e) => onChangePlatform(e.target.value)}
          className="bg-[#0b0d17] border border-white/10 text-white rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-400 cursor-pointer"
        >
          <option value="All">All Platforms</option>
          <option value="TikTok">TikTok</option>
          <option value="YouTube Shorts">YouTube Shorts</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Instagram">Instagram</option>
          <option value="X (Twitter)">X (Twitter)</option>
        </select>

        {/* Niche Selector */}
        <select
          value={selectedNiche}
          onChange={(e) => onChangeNiche(e.target.value)}
          className="bg-[#0b0d17] border border-white/10 text-white rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-400 cursor-pointer"
        >
          <option value="All">All Niches</option>
          <option value="Cybersecurity">Cybersecurity & AI</option>
          <option value="Technology">Technology</option>
          <option value="Student Tech">Student Tech</option>
          <option value="Productivity">Productivity</option>
        </select>

        {/* Trend State Selector */}
        <select
          value={selectedState}
          onChange={(e) => onChangeState(e.target.value)}
          className="bg-[#0b0d17] border border-white/10 text-white rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-400 cursor-pointer"
        >
          <option value="All">All Trend States</option>
          <option value="Rising">Rising ↑</option>
          <option value="Stable">Stable →</option>
          <option value="Saturated">Saturated ⚠️</option>
        </select>
      </div>

      {/* Right: Sort controls & Count */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Sort by:</span>
          <div className="flex bg-[#0b0d17] rounded-xl p-0.5 border border-white/10">
            <button
              onClick={() => onChangeSortBy('opportunity')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                sortBy === 'opportunity'
                  ? 'bg-indigo-600 text-white font-semibold shadow-glow-primary'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Opportunity
            </button>
            <button
              onClick={() => onChangeSortBy('velocity')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                sortBy === 'velocity'
                  ? 'bg-indigo-600 text-white font-semibold shadow-glow-primary'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Velocity
            </button>
            <button
              onClick={() => onChangeSortBy('fit')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                sortBy === 'fit'
                  ? 'bg-indigo-600 text-white font-semibold shadow-glow-primary'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Creator Fit
            </button>
          </div>
        </div>

        <span className="text-slate-400 font-mono text-[11px] border-l border-white/10 pl-3">
          {totalCount} Active Signals
        </span>
      </div>
    </div>
  );
};
