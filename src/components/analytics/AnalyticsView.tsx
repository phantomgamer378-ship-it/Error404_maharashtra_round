import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Eye, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  Dna, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  Zap, 
  Share2,
  Bookmark,
  MousePointerClick,
  Check,
  DownloadCloud,
  FileCheck,
  AlertCircle,
  HelpCircle,
  Video
} from 'lucide-react';
import { AnalyticsData, NavigationTab, PerformanceRecord, CreatorInsight } from '../../types';
import { useCreator } from '../../context/CreatorContext';
import { DemoDataBadge } from '../ui/DemoDataBadge';
import { ScoreRing } from '../ui/ScoreRing';
import { Sparkline } from '../ui/Sparkline';

interface AnalyticsViewProps {
  analytics: AnalyticsData;
  onNavigate: (tab: NavigationTab) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  analytics,
  onNavigate,
}) => {
  const { 
    creator, 
    performanceRecords, 
    learningInsights, 
    isLearningLoopRunning, 
    learningLoopStep, 
    importPerformanceData, 
    applyLearningInsight 
  } = useCreator();

  const [activeTab, setActiveTab] = useState<'overview' | 'clips' | 'retention'>('overview');
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);

  const hasImported = performanceRecords.length > 0;

  // Use imported records totals if available, else baseline
  const totalViewsDisplay = hasImported
    ? (performanceRecords.reduce((sum, r) => sum + r.views, 0) / 1000000).toFixed(2) + 'M'
    : analytics.totalViews;

  const totalSavesDisplay = hasImported
    ? (performanceRecords.reduce((sum, r) => sum + r.saves, 0) / 1000).toFixed(1) + 'K'
    : '79.6K';

  const totalSharesDisplay = hasImported
    ? (performanceRecords.reduce((sum, r) => sum + r.shares, 0) / 1000).toFixed(1) + 'K'
    : '35.8K';

  const avgRetentionDisplay = hasImported
    ? (performanceRecords.reduce((sum, r) => sum + r.avgRetention, 0) / performanceRecords.length).toFixed(1) + '%'
    : analytics.avgRetention;

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* ─── 1. PAGE HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>PERFORMANCE INTELLIGENCE & CLOSED LEARNING LOOP</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">
            Performance & <span className="text-gradient-accent">Learning Loop</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Import real clip performance to trigger the VIDORA continuous learning cycle: 
            extract patterns, update your Creator DNA, and re-rank future trend opportunities.
          </p>
        </div>

        {/* Action Buttons: Import Performance Data & Trend.Ai */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto flex-wrap">
          <DemoDataBadge />

          <button
            onClick={() => importPerformanceData()}
            disabled={isLearningLoopRunning}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-all shadow-glow-primary ${
              hasImported 
                ? 'bg-emerald-600/80 hover:bg-emerald-600 border border-emerald-400/40 text-emerald-100'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isLearningLoopRunning ? (
              <>
                <RotateCcw className="w-4 h-4 text-white animate-spin" />
                <span>Running Learning Loop (Step {learningLoopStep}/5)...</span>
              </>
            ) : hasImported ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Re-Import Demo Performance</span>
              </>
            ) : (
              <>
                <DownloadCloud className="w-4 h-4 text-white" />
                <span>Import Performance Data</span>
              </>
            )}
          </button>

          {hasImported && (
            <button
              onClick={() => onNavigate('trend-ai')}
              className="px-4 py-2.5 rounded-xl glass-button text-xs font-semibold text-emerald-300 border-emerald-500/40 hover:text-white flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>See Re-Ranked Trend.Ai →</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── 2. VISIBLE LEARNING LOOP ANIMATION & PROGRESSION ─────────────────────── */}
      <div className="rounded-3xl glass-panel-l3 p-6 md:p-8 border border-violet-500/30 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 border-b border-white/10 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
              <Dna className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>The Continuous Learning Loop</span>
                {hasImported && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                    FEEDBACK ACTIVE
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every published piece calibrates Sarth's Creator DNA to improve future recommendations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Loop Status:</span>
            <span className={`font-mono font-bold ${hasImported ? 'text-emerald-300' : 'text-amber-300'}`}>
              {isLearningLoopRunning ? `Executing Step ${learningLoopStep}...` : hasImported ? '✓ Calibrated to Latest Data' : 'Waiting for Performance Import'}
            </span>
          </div>
        </div>

        {/* 5-Step Visual Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative z-10">
          {[
            { 
              step: 1, 
              label: "1. PUBLISHED CONTENT", 
              desc: "5 Short-Form Variants (TikTok, Shorts, Reels)", 
              icon: Share2, 
              color: "text-indigo-400",
              bgColor: "bg-indigo-500/10",
              borderColor: "border-indigo-500/30"
            },
            { 
              step: 2, 
              label: "2. PERFORMANCE RECORDED", 
              desc: "1.29M Views, 79.6k Saves, 76.4% Retention", 
              icon: Eye, 
              color: "text-cyan-400",
              bgColor: "bg-cyan-500/10",
              borderColor: "border-cyan-500/30"
            },
            { 
              step: 3, 
              label: "3. PATTERN DETECTED", 
              desc: "Question Hooks: +30.4% higher audience retention", 
              icon: Sparkles, 
              color: "text-amber-400",
              bgColor: "bg-amber-500/10",
              borderColor: "border-amber-500/30"
            },
            { 
              step: 4, 
              label: "4. CREATOR DNA UPDATED", 
              desc: "Hook style updated to Question / Curiosity in store", 
              icon: Dna, 
              color: "text-violet-400",
              bgColor: "bg-violet-500/10",
              borderColor: "border-violet-500/30"
            },
            { 
              step: 5, 
              label: "5. RECOMMENDATIONS RE-RANKED", 
              desc: "Trend.Ai prioritizes Question hooks (+14pt boost)", 
              icon: TrendingUp, 
              color: "text-emerald-400",
              bgColor: "bg-emerald-500/10",
              borderColor: "border-emerald-500/30"
            },
          ].map((item) => {
            const isCompleted = hasImported || (isLearningLoopRunning && learningLoopStep >= item.step);
            const isCurrent = isLearningLoopRunning && learningLoopStep === item.step;

            return (
              <div 
                key={item.step}
                className={`p-4 rounded-2xl border transition-all duration-500 flex flex-col justify-between space-y-3 relative ${
                  isCurrent 
                    ? 'bg-violet-500/20 border-violet-400 shadow-glow-violet scale-[1.02]' 
                    : isCompleted 
                    ? `${item.bgColor} ${item.borderColor}` 
                    : 'bg-white/[0.02] border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl bg-white/[0.04] ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  {isCompleted ? (
                    <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-300">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500">Pending</span>
                  )}
                </div>

                <div>
                  <span className="text-[9px] font-extrabold font-mono text-slate-400 uppercase tracking-wider block">
                    {item.label}
                  </span>
                  <p className="text-xs font-bold text-white mt-0.5 leading-snug">
                    {item.desc}
                  </p>
                </div>

                {isCurrent && (
                  <div className="w-full h-1 bg-violet-500/30 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-400 rounded-full animate-pulse" style={{ width: '100%' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Learning Feedback Banner */}
        {hasImported && (
          <div className="p-4 rounded-2xl bg-violet-950/30 border border-violet-500/30 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
              <span>
                <strong>Latest DNA Update:</strong> Primary hook formula updated to{' '}
                <span className="text-violet-200 font-semibold underline decoration-violet-400">
                  {creator.hookStyle}
                </span>{' '}
                based on 5 published short-form clips.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigate('creator-dna')}
                className="px-3 py-1.5 rounded-xl glass-button text-xs font-semibold text-violet-300 hover:text-white"
              >
                Inspect Creator DNA →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── 3. OVERVIEW METRICS WITH SPARKLINES & BENCHMARKS ─────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <div className="p-5 rounded-2xl glass-panel-l2 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Total Views</span>
            <Eye className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{totalViewsDisplay}</div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-emerald-400 font-semibold">{analytics.viewsGrowth}</span>
            <Sparkline data={[24, 38, 42, 60, 55, 78, 92]} color="#818CF8" />
          </div>
        </div>

        {/* Watch Time */}
        <div className="p-5 rounded-2xl glass-panel-l2 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Watch Time</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{analytics.watchTime}</div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Across 3 platforms</span>
            <Sparkline data={[12, 18, 22, 29, 35, 41, 46]} color="#22D3EE" />
          </div>
        </div>

        {/* Avg Retention */}
        <div className="p-5 rounded-2xl glass-panel-l2 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Avg Retention</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{avgRetentionDisplay}</div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">+14% vs tech category benchmark</span>
            <Sparkline data={[58, 62, 65, 71, 74, 76, 78]} color="#34D399" />
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="p-5 rounded-2xl glass-panel-l2 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Engagement Rate</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-300 font-mono">{analytics.engagementRate}</div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Saves, shares & comments</span>
            <Sparkline data={[6.2, 7.1, 7.8, 8.4, 8.6, 8.9, 9.2]} color="#FBBF24" />
          </div>
        </div>

        {/* Saves & Bookmarks */}
        <div className="p-5 rounded-2xl glass-panel-l2 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Total Saves</span>
            <Bookmark className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-extrabold text-violet-300 font-mono">{totalSavesDisplay}</div>
          <p className="text-[11px] text-slate-400">Top 2% utility score for safe-word protocol</p>
        </div>

        {/* Total Shares */}
        <div className="p-5 rounded-2xl glass-panel-l2 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Total Shares</span>
            <Share2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-sky-300 font-mono">{totalSharesDisplay}</div>
          <p className="text-[11px] text-slate-400">High family peer-to-peer forwarding</p>
        </div>

        {/* Click-Through Rate */}
        <div className="p-5 rounded-2xl glass-panel-l2 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Avg Hook CTR</span>
            <MousePointerClick className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-extrabold text-pink-300 font-mono">12.4%</div>
          <p className="text-[11px] text-emerald-400 font-semibold">+65% on Question Hooks</p>
        </div>

        {/* Top Performing Topic */}
        <div className="p-5 rounded-2xl glass-panel-l2 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Top Subject</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-base font-extrabold text-white line-clamp-1">AI Voice Scams</div>
          <p className="text-[11px] text-indigo-300 font-mono">420K views on single TikTok cut</p>
        </div>
      </div>

      {/* ─── 4. RETENTION CURVE INSPECTION ────────────────────────────────────────── */}
      <div className="rounded-3xl glass-panel-l3 p-6 md:p-8 border border-white/10 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">Audience Retention Curve Analysis</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Comparing retention hold between <strong>Question Hooks (Green)</strong> vs <strong>Declarative Warnings (Amber)</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              Question Hook (91% 3s)
            </span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              Declarative (76% 3s)
            </span>
          </div>
        </div>

        {/* Retention SVG Chart */}
        <div className="relative h-64 w-full bg-black/30 rounded-2xl border border-white/5 p-4 flex flex-col justify-between overflow-hidden">
          {/* Subtle grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
            <div className="border-b border-white/10 w-full flex justify-between text-[10px] text-slate-400"><span>100%</span></div>
            <div className="border-b border-white/10 w-full flex justify-between text-[10px] text-slate-400"><span>75%</span></div>
            <div className="border-b border-white/10 w-full flex justify-between text-[10px] text-slate-400"><span>50%</span></div>
            <div className="border-b border-white/10 w-full flex justify-between text-[10px] text-slate-400"><span>25%</span></div>
            <div className="border-b border-white/10 w-full flex justify-between text-[10px] text-slate-400"><span>0%</span></div>
          </div>

          {/* SVG Curves */}
          <svg className="w-full h-full relative z-10" viewBox="0 0 800 200" preserveAspectRatio="none">
            {/* 3-Second Hook Critical Window Zone */}
            <rect x="0" y="0" width="70" height="200" fill="rgba(99, 102, 241, 0.08)" />
            <line x1="70" y1="0" x2="70" y2="200" stroke="#818CF8" strokeDasharray="4 4" strokeWidth="1.5" />

            {/* Curve 1: Question Hook (Green, High Hold) */}
            <path
              d="M 0 0 C 40 18, 70 20, 150 32 C 300 42, 500 48, 800 52"
              fill="none"
              stroke="#34D399"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Curve 2: Declarative Hook (Amber, Steeper Drop) */}
            <path
              d="M 0 0 C 40 48, 70 54, 150 78 C 300 96, 500 110, 800 118"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeDasharray="5 5"
              strokeLinecap="round"
            />
          </svg>

          {/* X-axis timestamps */}
          <div className="flex justify-between text-[10px] font-mono text-slate-400 relative z-10 pt-2 border-t border-white/10">
            <span>0s (Start)</span>
            <span className="text-indigo-300 font-bold">3s (Hook Dropoff Window)</span>
            <span>10s</span>
            <span>20s</span>
            <span>30s</span>
            <span>38s (End / CTA)</span>
          </div>
        </div>

        {/* Insight callout */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs text-slate-300">
          <span className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold font-mono">Key Takeaway:</span>
            Question-based hooks retain <strong>91%</strong> of viewers through the first 3 seconds, whereas declarative hooks drop 24% immediately.
          </span>
          <span className="font-mono text-slate-400 text-[11px] hidden sm:inline">N=5 Published Clips</span>
        </div>
      </div>

      {/* ─── 5. AI PLAIN-LANGUAGE INSIGHTS PANEL ─────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">AI Creator Insights & DNA Updates</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Rule 27: Deterministic Computation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(learningInsights.length > 0 ? learningInsights : [
            {
              id: 'sample-1',
              type: 'hook_style' as const,
              statement: 'Your audience responds 30.4% better to Question-based openings with high personal stakes.',
              explanation: "Clips opening with direct questions ('If your mom calls asking for $500...') averaged 78.4% retention vs 58.5% for declarative warnings.",
              supportingMetrics: [
                { label: 'Avg Retention', value: '78.4%', benchmark: '58.5%', delta: '+30.4%' },
                { label: 'Avg Saves', value: '23,650', benchmark: '10,766', delta: '+120%' },
              ],
              confidence: 91,
              sampleSize: 5,
              recommendedDnaUpdate: {
                field: 'hookStyle',
                label: 'Primary Hook Formula',
                oldValue: creator.hookStyle,
                newValue: 'Question / Curiosity (Learned from Performance)',
                impactDescription: 'Will boost ranking of Question-framed trend opportunities.',
              },
              applied: hasImported,
            },
            {
              id: 'sample-2',
              type: 'duration' as const,
              statement: 'Videos under 40 seconds achieve 44.8% higher completion rates in your recent sample.',
              explanation: 'Clips between 28s and 36s averaged 75.8% audience retention, while clips over 45s dropped to 52.3%.',
              supportingMetrics: [
                { label: 'Short Clip Retention', value: '75.8%', benchmark: '52.3%', delta: '+44.8%' },
                { label: 'Full Completion', value: '72.4%', benchmark: '42.1%', delta: '+72%' },
              ],
              confidence: 88,
              sampleSize: 5,
              recommendedDnaUpdate: {
                field: 'averageDuration',
                label: 'Optimal Duration',
                oldValue: creator.averageDuration,
                newValue: '32s - 38s (Optimized)',
                impactDescription: 'Editor timeline defaults will calibrate to tight 35-second pacing.',
              },
              applied: hasImported,
            },
            {
              id: 'sample-3',
              type: 'topic_affinity' as const,
              statement: 'Actionable security safe-words drive an exceptional 6.2% save-to-view ratio.',
              explanation: 'Practical emergency protocols generated over 28,400 saves on a single TikTok clip. This is in the top 2% of tech creator benchmarks.',
              supportingMetrics: [
                { label: 'Verified Saves', value: '28,400', benchmark: '12,500', delta: '+127%' },
                { label: 'Save-to-View Rate', value: '6.2%', benchmark: '2.5%', delta: '+148%' },
              ],
              confidence: 86,
              sampleSize: 5,
              recommendedDnaUpdate: {
                field: 'bestTopics',
                label: 'Top Resonance Topic',
                oldValue: creator.bestTopics[0] || 'AI Security',
                newValue: 'Emergency Defense & Family Safe-Words',
                impactDescription: 'Trend.Ai will prioritize actionable defense topics over generic policy.',
              },
              applied: hasImported,
            },
          ]).map((insight) => (
            <div 
              key={insight.id}
              className="p-6 rounded-2xl glass-panel-l2 border border-white/10 space-y-4 hover:border-indigo-500/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                    CONFIDENCE: {insight.confidence}%
                  </span>
                  {insight.applied ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold font-mono">
                      <Check className="w-3.5 h-3.5" />
                      CALIBRATED
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-mono">Pending DNA Sync</span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">
                  {insight.statement}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {insight.explanation}
                </p>

                {/* Supporting Metrics Mini-Table */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Verified Signal Data:
                  </span>
                  {insight.supportingMetrics.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">{m.label}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-slate-400 text-[10px]">{m.benchmark} →</span>
                        <span className="text-emerald-400 font-bold">{m.value}</span>
                        <span className="text-[10px] text-emerald-300 font-bold">({m.delta})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DNA Update Action */}
              <div className="pt-2 border-t border-white/10">
                {insight.applied ? (
                  <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Dna className="w-3.5 h-3.5 text-emerald-400" />
                      Written to Creator DNA
                    </span>
                    <button
                      onClick={() => onNavigate('creator-dna')}
                      className="text-[11px] text-indigo-300 hover:text-white underline font-normal"
                    >
                      View Profile
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => applyLearningInsight(insight.id)}
                    className="w-full py-2 rounded-xl glass-button text-xs font-bold text-violet-300 hover:text-white border-violet-500/30 flex items-center justify-center gap-1.5"
                  >
                    <Dna className="w-3.5 h-3.5 text-violet-400" />
                    <span>Apply to Creator DNA</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 6. IMPORTED PUBLISHED CLIPS DATASET TABLE ───────────────────────────── */}
      <div className="rounded-3xl glass-panel-l2 p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-tight">Published Clip Variants (Demo Dataset)</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">5 Verified Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-mono uppercase text-slate-400">
                <th className="pb-3 font-semibold">Platform & Title</th>
                <th className="pb-3 font-semibold">Hook Type</th>
                <th className="pb-3 font-semibold">Length</th>
                <th className="pb-3 font-semibold">Views</th>
                <th className="pb-3 font-semibold">Avg Retention</th>
                <th className="pb-3 font-semibold">Saves</th>
                <th className="pb-3 font-semibold">Shares</th>
                <th className="pb-3 font-semibold">Hook CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(hasImported ? performanceRecords : []).map((clip) => (
                <tr key={clip.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4">
                    <div className="font-bold text-white">{clip.title}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                      <span className="text-indigo-400 font-semibold">{clip.platform}</span>
                      <span>•</span>
                      <span className="truncate max-w-xs italic text-slate-300">"{clip.hookText}"</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      clip.hookStyle === 'Question' 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                        : 'bg-white/5 text-slate-300 border-white/10'
                    }`}>
                      {clip.hookStyle}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-slate-300">{clip.durationSeconds}s</td>
                  <td className="py-3 font-mono font-bold text-white">{(clip.views / 1000).toLocaleString()}k</td>
                  <td className="py-3 font-mono font-bold text-emerald-400">{clip.avgRetention}%</td>
                  <td className="py-3 font-mono text-slate-300">{clip.saves.toLocaleString()}</td>
                  <td className="py-3 font-mono text-slate-300">{clip.shares.toLocaleString()}</td>
                  <td className="py-3 font-mono font-bold text-pink-300">{clip.ctr}%</td>
                </tr>
              ))}
              {!hasImported && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Click <strong>"Import Performance Data"</strong> above to load the 5 verified short-form published clips.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
