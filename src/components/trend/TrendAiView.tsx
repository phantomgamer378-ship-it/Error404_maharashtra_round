import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
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

  // 3. Selected Opportunity (defaults to highest opportunity)
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
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            Trend.<span className="text-gradient-accent">Ai</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Understand what is moving, why it matters, and where you can create.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <DemoDataBadge />
          <button className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-medium text-slate-300 hover:bg-white/[0.08] hover:border-white/20 transition-all flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Refresh signals</span>
          </button>
        </div>
      </div>

      {/* Re-Ranked By Learning Loop Notification Banner (Phase 10) */}
      {opportunities.some(o => o.isLearnedReRank) && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-lg backdrop-blur-md animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div>
              <span className="font-bold text-emerald-300 font-mono text-[11px] uppercase tracking-wider block">
                ⚡ Learning Loop Active: Trend Rankings Updated
              </span>
              <p className="text-slate-300 text-xs mt-0.5">
                Top opportunities re-ranked based on your latest published performance.
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

      {/* AIThinking state when page opens */}
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

      {/* Filter Bar */}
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

      {/* Section 1: Trend Radar + Momentum Movers (side by side) */}
      <TrendRadar
        opportunities={filteredOpportunities}
        selectedId={activeOpportunity?.id || ''}
        onSelectOpportunity={(opp) => setSelectedOppId(opp.id)}
        onStartCreate={onStartCreateFromOpportunity}
      />

      {/* Section 2: Opportunity Cards List */}
      <div className="rounded-3xl glass-panel-l2 p-6 border border-white/10">
        {filteredOpportunities.map((opp) => (
          <OpportunityCard
            key={opp.id}
            opportunity={opp}
            onOpenCreate={onStartCreateFromOpportunity}
            isInitialExpanded={false}
          />
        ))}
      </div>

      {/* Section 3: Trend Trajectory + Content Gaps (2-column) */}
      {activeOpportunity && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Trajectory chart */}
          <TrendTrajectoryChart
            trajectory={activeOpportunity.trajectory}
            topic={activeOpportunity.topic}
            trendState={activeOpportunity.trendDirection}
          />

          {/* Right: Content Gaps */}
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
        </div>
      )}
    </div>
  );
};
