import React from 'react';
import { motion } from 'framer-motion';
import { 
  Dna, 
  Sparkles, 
  Target, 
  Zap, 
  BrainCircuit, 
  ShieldCheck, 
  Clock, 
  Flame, 
  BarChart2, 
  CheckCircle2,
  Users,
  Video,
  Smile
} from 'lucide-react';
import { CreatorProfile, NavigationTab } from '../../types';

interface CreatorDnaViewProps {
  creator: CreatorProfile;
  onNavigate: (tab: NavigationTab) => void;
  onOpenCreateModal: () => void;
}

export const CreatorDnaView: React.FC<CreatorDnaViewProps> = ({
  creator,
  onNavigate,
  onOpenCreateModal,
}) => {
  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-2">
            <Dna className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            <span>AI-LEARNED IDENTITY PROFILE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">
            Creator <span className="text-gradient-accent">DNA</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            "The AI knows how YOU create." CreatorAi continuously adapts to your style, tone, and audience patterns.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2.5 rounded-xl glass-button-primary text-xs font-semibold text-white flex items-center gap-2 shadow-glow-violet shrink-0 self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>Create With My DNA</span>
        </button>
      </div>

      {/* Live Learning Loop Banner (Phase 10) */}
      {creator.lastLearningUpdate && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-200 shadow-lg backdrop-blur-md animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="font-bold font-mono text-[11px] text-emerald-300 uppercase tracking-wider block">
                ⚡ Creator DNA Calibrated from Published Performance
              </span>
              <p className="text-slate-300 text-xs mt-0.5">
                {creator.lastLearningUpdate.summary} (Calibrated at {creator.lastLearningUpdate.timestamp})
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30 shrink-0 self-start sm:self-auto">
            LIVE CALIBRATION ACTIVE
          </span>
        </div>
      )}

      {/* Main Profile Summary Hero Card */}
      <div className="rounded-3xl glass-panel-l3 p-6 md:p-8 border border-violet-500/30 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={creator.avatar} 
                alt={creator.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-violet-400/50 shadow-glow-violet"
              />
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-indigo-600 text-white border-2 border-[#08090D]">
                <Dna className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">{creator.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                  {creator.lastLearningUpdate ? 'CONFIDENCE: 98% (CALIBRATED)' : 'CONFIDENCE: 96%'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{creator.niche.join(' • ')}</p>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-indigo-400" /> {creator.audience}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border text-center min-w-[110px] transition-all ${
              creator.lastLearningUpdate ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-white/[0.03] border-white/5'
            }`}>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Avg Duration</span>
              <div className="text-sm font-extrabold text-white font-mono mt-0.5 truncate max-w-[120px]">{creator.averageDuration}</div>
            </div>
            <div className={`p-3 rounded-2xl border text-center min-w-[110px] transition-all ${
              creator.lastLearningUpdate ? 'bg-emerald-950/30 border-emerald-500/40 shadow-glow-emerald' : 'bg-white/[0.03] border-white/5'
            }`}>
              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-semibold uppercase">
                <span>Best Hook</span>
                {creator.lastLearningUpdate && <span className="text-emerald-400">⚡</span>}
              </div>
              <div className="text-xs font-bold text-emerald-300 mt-1 line-clamp-1">{creator.hookStyle.split(' ')[0]}</div>
            </div>
          </div>
        </div>

        {/* DNA Attributes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 relative z-10">
          
          {/* Column 1: Tone & Hook */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-violet-300 uppercase tracking-wider">
              <Smile className="w-4 h-4 text-violet-400" />
              <span>Voice & Tone Matrix</span>
            </div>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Tone Signature</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {creator.tone.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-200 text-xs font-semibold border border-violet-500/30">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`p-3 rounded-xl border transition-all ${
                creator.lastLearningUpdate 
                  ? 'bg-emerald-950/30 border-emerald-500/40 shadow-glow-emerald' 
                  : 'bg-white/[0.03] border-white/5'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Hook Formula</span>
                  {creator.lastLearningUpdate && (
                    <span className="text-[9px] font-mono font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-500/30">
                      ⚡ UPDATED FROM PERFORMANCE
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-white mt-1">{creator.hookStyle}</p>
                {creator.lastLearningUpdate && (
                  <p className="text-[10px] text-emerald-400 font-mono mt-1">+30.4% higher retention verified in 5 published clips</p>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Visual & Format */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
              <Video className="w-4 h-4 text-indigo-400" />
              <span>Format & Aesthetic</span>
            </div>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Visual Style</span>
                <p className="text-xs font-bold text-white mt-1">{creator.visualStyle}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Preferred Formats</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {creator.preferredFormats.map((f, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-200 text-xs font-semibold border border-indigo-500/30">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Top Niche Topics */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
              <Flame className="w-4 h-4 text-cyan-400" />
              <span>Highest Resonance Topics</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
              {creator.bestTopics.map((topic, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-semibold">{topic}</span>
                  <span className="text-emerald-400 font-mono text-[11px]">9{8 - i * 2}% Match</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* PERFORMANCE PATTERNS BREAKDOWN */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-indigo-400" />
          AI-Learned Performance Patterns
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creator.performancePatterns.map((pattern, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-2xl glass-panel-l2 border border-white/10 hover:border-violet-500/40 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">Pattern #{idx + 1}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  {pattern.retentionRate}% Retention
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{pattern.hookType}</h3>
                <p className="text-[11px] text-slate-400 mt-1">Recommended posting window: {pattern.bestPostingTime}</p>
              </div>

              {/* Progress bar visual */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Viral Probability</span>
                  <span className="font-mono text-indigo-300 font-bold">{pattern.viralProbability}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                    style={{ width: `${pattern.viralProbability}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
