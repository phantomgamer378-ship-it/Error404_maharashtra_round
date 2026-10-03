import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radio, 
  Sparkles, 
  Layers, 
  Target, 
  TrendingUp, 
  RefreshCw,
  SlidersHorizontal,
  Lightbulb
} from 'lucide-react';
import { NavigationTab } from '../../types';
import { ScoredOpportunity } from '../../features/opportunity-engine/types';
import { TrendRadar } from './TrendRadar';
import { OpportunityCard } from './OpportunityCard';
import { TrendTrajectoryChart } from './TrendTrajectoryChart';
import { ContentGapSection } from './ContentGapSection';
import { TrendFilterBar } from './TrendFilterBar';
import { AIThinking } from '../ui/AIThinking';
import { DemoDataBadge } from '../ui/DemoDataBadge';

interface TrendAiViewProps {
  opportunities: ScoredOpportunity[];
  onNavigate: (tab: NavigationTab) => void;
  onStartCreateFromOpportunity: (opportunity: ScoredOpportunity) => void;
  onTurnGapIntoIdea?: (opportunity: ScoredOpportunity) => void;
}

export const TrendAiView: React.FC<TrendAiViewProps> = ({
  opportunities,
  onNavigate,
  onStartCreateFromOpportunity,
  onTurnGapIntoIdea,
}) => {
  // 1. Initial AIThinking state (1.2s max)
  const [isThinking, setIsThinking] = useState(true);

  // 2. Filter & Sort state
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [selectedNiche, setSelectedNiche] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'opportunity' | 'velocity' | 'fit'>('opportunity');

  // 3. Selected Opportunity (defaults to AI Voice Scams or highest opportunity)
  const [selectedOppId, setSelectedOppId] = useState<string>(
    opportunities[0]?.id || 'ai-voice-scams'
  );

  // Filtered & Sorted opportunities
  const filteredOpportunities = useMemo(() => {
    let list = [...opportunities];

    if (selectedPlatform !== 'All') {
      list = list.filter(o => o.evidence.platform === selectedPlatform);
    }
    if (selectedNiche !== 'All') {
      list = list.filter(o => 
        o.category.toLowerCase().includes(selectedNiche.toLowerCase()) ||
        o.topic.toLowerCase().includes(selectedNiche.toLowerCase())
      );
    }
    if (selectedState !== 'All') {
      list = list.filter(o => o.trendDirection === selectedState);
    }

    if (sortBy === 'opportunity') {
      list.sort((a, b) => b.opportunityScore - a.opportunityScore);
    } else if (sortBy === 'velocity') {
      list.sort((a, b) => b.trendVelocity - a.trendVelocity);
    } else if (sortBy === 'fit') {
      list.sort((a, b) => b.creatorFit - a.creatorFit);
    }

    return list;
  }, [opportunities, selectedPlatform, selectedNiche, selectedState, sortBy]);

  // Active selected opportunity object
  const activeOpportunity = useMemo(() => {
    return (
      filteredOpportunities.find(o => o.id === selectedOppId) ||
      filteredOpportunities[0] ||
      opportunities[0]
    );
  }, [filteredOpportunities, selectedOppId, opportunities]);

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>REAL-TIME CREATOR INTELLIGENCE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            Trend.<span className="text-gradient-accent">Ai</span>
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Understand what is moving, why it matters, and where you can create.
          </p>
        </div>

        {/* Header Action */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <DemoDataBadge />
          {activeOpportunity && (
            <button
              onClick={() => onStartCreateFromOpportunity(activeOpportunity)}
              className="px-4 py-2.5 rounded-xl glass-button-primary text-xs font-semibold text-white flex items-center gap-2 shadow-glow-primary shrink-0"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Create Content From Trend</span>
            </button>
          )}
        </div>
      </div>

      {/* Re-Ranked By Learning Loop Notification Banner (Phase 10) */}
      {opportunities.some(o => o.isLearnedReRank) && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-lg backdrop-blur-md animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-emerald-300 font-mono text-[11px] uppercase tracking-wider block">
                ⚡ Learning Loop Active: Trend Rankings Updated
              </span>
              <p className="text-slate-300 text-xs mt-0.5">
                Top opportunities re-ranked based on your latest published performance (+30.4% Question Hook retention).
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('creator-dna')}
            className="px-3 py-1.5 rounded-xl glass-button text-emerald-300 border-emerald-500/30 text-xs font-semibold hover:text-white shrink-0 self-start sm:self-auto"
          >
            View Updated DNA →
          </button>
        </div>
      )}

      {/* AIThinking state when page opens (Max 1.2s) */}
      <AnimatePresence>
        {isThinking && (
          <motion.div
            initial={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.35 }}
          >
            <AIThinking
              durationMs={1200}
              onComplete={() => setIsThinking(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Sort Bar */}
      <TrendFilterBar
        selectedPlatform={selectedPlatform}
        onChangePlatform={setSelectedPlatform}
        selectedNiche={selectedNiche}
        onChangeNiche={setSelectedNiche}
        selectedState={selectedState}
        onChangeState={setSelectedState}
        sortBy={sortBy}
        onChangeSortBy={setSortBy}
        totalCount={filteredOpportunities.length}
      />

      {/* 2. TREND RADAR: Topic Nodes Connected as a Network */}
      <TrendRadar
        opportunities={filteredOpportunities}
        selectedId={activeOpportunity.id}
        onSelectOpportunity={(opp) => setSelectedOppId(opp.id)}
      />

      {/* 3 & 4. TWO-COLUMN LAYOUT: Deep-Dive Opportunity Card + Right Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Large Opportunity Card with "Why Now?" Expansion */}
        <div className="lg:col-span-7 space-y-6">
          {activeOpportunity && (
            <OpportunityCard
              opportunity={activeOpportunity}
              onOpenCreate={onStartCreateFromOpportunity}
              isInitialExpanded={true}
            />
          )}
        </div>

        {/* Right Column: Trend Trajectory Chart + Content Gap Finder */}
        <div className="lg:col-span-5 space-y-6">
          {activeOpportunity && (
            <>
              {/* Trend Trajectory Chart with Hover Tooltips */}
              <TrendTrajectoryChart
                trajectory={activeOpportunity.trajectory}
                topic={activeOpportunity.topic}
                trendState={activeOpportunity.trendDirection}
              />

              {/* Content Gaps Section */}
              <ContentGapSection
                opportunity={activeOpportunity}
                onTurnGapIntoIdea={(opp) => {
                  if (onTurnGapIntoIdea) {
                    onTurnGapIntoIdea(opp);
                  } else {
                    onStartCreateFromOpportunity(opp);
                  }
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
