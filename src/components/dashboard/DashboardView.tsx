import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  TrendingUp, 
  Target, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  PlusCircle, 
  ShieldAlert, 
  Users, 
  Zap, 
  Dna,
  Clock,
  ExternalLink
} from 'lucide-react';
import { CreatorProfile, TrendOpportunity, NavigationTab } from '../../types';

interface DashboardViewProps {
  creator: CreatorProfile;
  opportunities: TrendOpportunity[];
  onNavigate: (tab: NavigationTab) => void;
  onOpenCreateModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  creator,
  opportunities,
  onNavigate,
  onOpenCreateModal,
}) => {
  const [expandedOpportunityId, setExpandedOpportunityId] = useState<string | null>("trend-1");

  const toggleExpand = (id: string) => {
    setExpandedOpportunityId(expandedOpportunityId === id ? null : id);
  };

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">
            Good evening, <span className="text-gradient-primary">{creator.name.split(' ')[0]}</span>.
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Here are the strongest content opportunities for you today based on your Creator DNA.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('trend-ai')}
            className="px-4 py-2 rounded-xl glass-button text-xs font-semibold text-slate-200 flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>Open Trend.Ai Radar</span>
          </button>
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 rounded-xl glass-button-primary text-xs font-semibold text-white flex items-center gap-2 shadow-glow-primary"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Create Content</span>
          </button>
        </div>
      </div>

      {/* Main Hero Glass Panel — TODAY'S CREATOR SIGNAL */}
      <div className="relative rounded-3xl glass-panel-l3 p-6 md:p-8 border border-indigo-500/20 overflow-hidden shadow-2xl">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>TODAY'S CREATOR SIGNAL</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              3 High-Opportunity Topics Matching Your <span className="text-gradient-accent">Cybersecurity + AI</span> DNA
            </h2>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Audience interest in your niche is up <span className="text-emerald-400 font-semibold">↑ 18%</span> today. 
              The AI Voice Scam window is at peak momentum before saturation hits next week.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <Flame className="w-4 h-4 text-amber-400" />
                <span><strong className="text-white">3</strong> High-Opportunity Topics</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Audience Interest <strong className="text-emerald-400">↑ 18%</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <Target className="w-4 h-4 text-indigo-400" />
                <span>Strongest Niche: <strong className="text-white">Cybersecurity + AI</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-3 min-w-[220px]">
            <button
              onClick={() => onNavigate('trend-ai')}
              className="py-3 px-5 rounded-2xl glass-button-primary font-bold text-xs text-white flex items-center justify-center gap-2 shadow-glow-primary group"
            >
              <span>Explore Opportunities</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('creator-dna')}
              className="py-3 px-5 rounded-2xl glass-button font-medium text-xs text-slate-300 hover:text-white flex items-center justify-center gap-2"
            >
              <Dna className="w-4 h-4 text-violet-400" />
              <span>Inspect Creator DNA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Your Opportunities Today Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">Your Opportunities Today</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-400 font-mono">
              {opportunities.length} active
            </span>
          </div>
          <button 
            onClick={() => onNavigate('trend-ai')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>View all in Trend.Ai</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Opportunity Cards List */}
        <div className="space-y-4">
          {opportunities.map((opp) => {
            const isExpanded = expandedOpportunityId === opp.id;

            return (
              <div 
                key={opp.id}
                className={`rounded-2xl glass-panel-l2 border transition-all duration-300 overflow-hidden hover-elevate ${
                  isExpanded ? 'border-indigo-500/40 shadow-glass-md bg-indigo-950/10' : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Horizontal Header Row — stacks on mobile */}
                <div className="p-4 md:p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 md:gap-6">
                  {/* Topic Title & Badges */}
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                      <Flame className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm md:text-base font-bold text-white tracking-tight">{opp.topic}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                          <TrendingUp className="w-3 h-3" />
                          {opp.trendDirection} ↑
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 shrink-0">
                          {opp.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-1">{opp.summary}</p>
                    </div>
                  </div>

                  {/* Metrics Row — 2-col on mobile, 4-col on sm */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 px-3 rounded-xl bg-white/[0.02] border border-white/5 xl:shrink-0">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Opportunity</span>
                      <div className="text-base md:text-lg font-extrabold text-indigo-400 font-mono">
                        {opp.opportunityScore} <span className="text-xs text-slate-500 font-normal">/100</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Audience Fit</span>
                      <div className="text-base md:text-lg font-extrabold text-white font-mono">
                        {opp.audienceFit}%
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Creator Fit</span>
                      <div className="text-base md:text-lg font-extrabold text-white font-mono">
                        {opp.creatorFit}%
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Competition</span>
                      <div className="text-sm font-bold text-amber-300 mt-1">
                        {opp.competition}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                    <button
                      onClick={() => toggleExpand(opp.id)}
                      className="px-3.5 py-2 rounded-xl glass-button text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
                    >
                      <span>Why Now?</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={onOpenCreateModal}
                      className="px-4 py-2 rounded-xl glass-button-primary text-xs font-semibold text-white flex items-center gap-1.5 shadow-glow-primary"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Create</span>
                    </button>
                  </div>
                </div>

                {/* Animated Expandable WHY NOW Panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="border-t border-indigo-500/20 bg-indigo-950/20 p-5 md:p-6"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                            <span>WHY NOW — AI OPPORTUNITY ANALYSIS</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">Confidence: 94% (Based on real-time signals)</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {opp.whyNowReasoning.map((reason, idx) => (
                            <div 
                              key={idx}
                              className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5"
                            >
                              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                ✓
                              </div>
                              <p className="text-xs text-slate-200 leading-relaxed">{reason}</p>
                            </div>
                          ))}
                        </div>

                        {/* Content Gap callout if present */}
                        {opp.contentGap && (
                          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase tracking-wider font-extrabold text-cyan-400">Content Gap Detected</span>
                              <p className="text-xs font-bold text-white">{opp.contentGap.potentialGap}</p>
                              <p className="text-[11px] text-slate-300">High audience demand, low creator competition.</p>
                            </div>
                            <button
                              onClick={onOpenCreateModal}
                              className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5"
                            >
                              <span>Turn gap into script</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
