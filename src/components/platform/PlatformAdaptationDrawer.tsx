import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Share2,
  Check,
  Sparkles,
  Copy,
  ArrowRight,
  GitBranch,
  Smartphone,
  Monitor,
  FileText,
  MessageSquare,
  Music,
  Eye,
  Edit3,
  ChevronDown,
  ChevronUp,
  Hash,
  Clock,
  Shield,
  Layers,
  Zap,
  Target,
} from 'lucide-react';
import { NavigationTab } from '../../types';
import {
  repurposeService,
  PlatformAdaptation,
  PlatformId,
  ContentTree,
  WhatIfVariant,
} from '../../lib/services/RepurposeService';
import { mockCreatorProfile } from '../../data/mockData';

// ─── Platform Icons & Colors ───────────────────────────────────────────────
const PLATFORM_META: Record<PlatformId, { label: string; color: string; bgClass: string; borderClass: string; icon: React.ReactNode }> = {
  instagram: {
    label: 'Instagram Reel',
    color: '#E1306C',
    bgClass: 'bg-pink-500/20',
    borderClass: 'border-pink-500/40',
    icon: <Smartphone className="w-4 h-4 text-pink-400" />,
  },
  youtube: {
    label: 'YouTube Short',
    color: '#FF0000',
    bgClass: 'bg-red-500/20',
    borderClass: 'border-red-500/40',
    icon: <Monitor className="w-4 h-4 text-red-400" />,
  },
  linkedin: {
    label: 'LinkedIn Post',
    color: '#0077B5',
    bgClass: 'bg-blue-500/20',
    borderClass: 'border-blue-500/40',
    icon: <FileText className="w-4 h-4 text-blue-400" />,
  },
  x: {
    label: 'X Thread',
    color: '#1DA1F2',
    bgClass: 'bg-sky-500/20',
    borderClass: 'border-sky-500/40',
    icon: <MessageSquare className="w-4 h-4 text-sky-400" />,
  },
  tiktok: {
    label: 'TikTok',
    color: '#00F2EA',
    bgClass: 'bg-cyan-500/20',
    borderClass: 'border-cyan-500/40',
    icon: <Music className="w-4 h-4 text-cyan-400" />,
  },
};

const ALL_PLATFORMS: PlatformId[] = ['instagram', 'youtube', 'linkedin', 'x', 'tiktok'];

// ─── Props ──────────────────────────────────────────────────────────────────
interface PlatformAdaptationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavigationTab) => void;
}

// ─── Component ──────────────────────────────────────────────────────────────
export const PlatformAdaptationDrawer: React.FC<PlatformAdaptationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>(['instagram', 'youtube', 'linkedin', 'x', 'tiktok']);
  const [contentTree, setContentTree] = useState<ContentTree | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeView, setActiveView] = useState<'variants' | 'tree'>('variants');
  const [activePlatform, setActivePlatform] = useState<PlatformId>('instagram');
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [editingField, setEditingField] = useState<{ platformId: string; field: string } | null>(null);

  // Source content (from current project / editor)
  const sourceHook = "If your mom calls asking for $500, STOP. Ask this 1 safe-word first.";
  const sourceScript = "AI voice cloning scams are on the rise. Scammers need only 3 seconds of audio to clone a family member's voice and execute emergency money requests. The defense: establish a family safe-word. If the caller can't say it — hang up immediately.";
  const sourceTopic = "AI Voice Scams";
  const sourceDuration = "38s";

  // Auto-generate on open
  useEffect(() => {
    if (isOpen && !contentTree && !isGenerating) {
      handleGenerate();
    }
  }, [isOpen]);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    try {
      const tree = await repurposeService.generateContentTree(
        'proj-ai-voice-scams',
        sourceTopic,
        sourceHook,
        sourceScript,
        sourceDuration,
        selectedPlatforms,
        mockCreatorProfile,
      );
      setContentTree(tree);
    } catch (err) {
      console.error('RepurposeService error:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedPlatforms]);

  const togglePlatform = (pid: PlatformId) => {
    setSelectedPlatforms(prev =>
      prev.includes(pid) ? prev.filter(p => p !== pid) : [...prev, pid]
    );
    setContentTree(null); // reset so regenerate needed
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMap(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setCopiedMap(prev => ({ ...prev, [key]: false })), 2000);
  };

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isOpen) return null;

  const activeAdaptation = contentTree?.platformAdaptations.find(a => a.platformId === activePlatform);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/70 backdrop-blur-md">
        {/* Backdrop click to close */}
        <div className="absolute inset-0 -z-10" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full md:max-w-4xl h-full glass-panel-l4 border-l border-white/15 flex flex-col overflow-hidden shadow-2xl"
        >
          {/* ─── HEADER ─── */}
          <div className="px-6 py-4 border-b border-white/10 bg-[#080910] flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
                  <Share2 className="w-3 h-3" />
                  MULTI-PLATFORM ENGINE
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  Source: {sourceTopic}
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-white">
                Cross-Platform Adaptation
              </h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl glass-button text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ─── PLATFORM SELECTOR + VIEW TOGGLE ─── */}
          <div className="px-6 py-3 border-b border-white/10 bg-[#07080D]/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {ALL_PLATFORMS.map(pid => {
                const meta = PLATFORM_META[pid];
                const isSelected = selectedPlatforms.includes(pid);
                return (
                  <button
                    key={pid}
                    onClick={() => togglePlatform(pid)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                      isSelected
                        ? `${meta.bgClass} ${meta.borderClass} text-white`
                        : 'bg-white/[0.03] border-white/5 text-slate-500 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {meta.icon}
                    <span>{meta.label}</span>
                    {isSelected && <Check className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-3">
              <button
                onClick={() => setActiveView('variants')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${activeView === 'variants' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Variants
              </button>
              <button
                onClick={() => setActiveView('tree')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 ${activeView === 'tree' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <GitBranch className="w-3 h-3" />
                Tree
              </button>
            </div>
          </div>

          {/* ─── GENERATE BUTTON (when tree is null) ─── */}
          {!contentTree && !isGenerating && (
            <div className="flex-1 flex items-center justify-center p-8">
              <button
                onClick={handleGenerate}
                disabled={selectedPlatforms.length === 0}
                className="px-8 py-4 rounded-2xl glass-button-primary text-sm font-bold text-white flex items-center gap-3 shadow-glow-primary disabled:opacity-40"
              >
                <Sparkles className="w-5 h-5" />
                Generate {selectedPlatforms.length} Platform Variants
              </button>
            </div>
          )}

          {/* ─── GENERATING STATE ─── */}
          {isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
              <Sparkles className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-indigo-300 font-semibold text-sm">Adapting for {selectedPlatforms.length} platforms with Creator DNA...</p>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {selectedPlatforms.map(pid => (
                  <span key={pid} className={`px-2 py-0.5 rounded-lg ${PLATFORM_META[pid].bgClass} ${PLATFORM_META[pid].borderClass} text-[10px] font-mono text-white border`}>
                    {PLATFORM_META[pid].label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ─── CONTENT: VARIANTS VIEW ─── */}
          {contentTree && !isGenerating && activeView === 'variants' && (
            <div className="flex-1 flex overflow-hidden">
              {/* LEFT: SOURCE CONTENT */}
              <div className="w-72 border-r border-white/10 p-4 overflow-y-auto bg-[#06070B] shrink-0 space-y-4">
                <div className="text-[10px] font-mono text-indigo-400 font-bold uppercase">Source Content</div>

                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
                  <span className="text-[9px] font-mono text-indigo-400">HOOK</span>
                  <p className="text-white text-xs font-bold leading-snug">{sourceHook}</p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                  <span className="text-[9px] font-mono text-slate-500">SCRIPT</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{sourceScript}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
                    <span className="text-slate-500 font-mono block">Duration</span>
                    <span className="text-white font-bold">{sourceDuration}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
                    <span className="text-slate-500 font-mono block">Format</span>
                    <span className="text-white font-bold">9:16 Reel</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                  <span className="text-[9px] font-mono text-emerald-400 font-bold">CREATOR DNA APPLIED</span>
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    Tone: {mockCreatorProfile.tone.join(', ')}<br />
                    Hook: {mockCreatorProfile.hookStyle}<br />
                    Niche: {mockCreatorProfile.niche.join(', ')}
                  </p>
                </div>

                {/* Mini platform tabs */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">Select platform variant:</span>
                  {contentTree.platformAdaptations.map(a => {
                    const meta = PLATFORM_META[a.platformId];
                    const isActive = activePlatform === a.platformId;
                    return (
                      <button
                        key={a.platformId}
                        onClick={() => setActivePlatform(a.platformId)}
                        className={`w-full px-3 py-2 rounded-xl text-left text-[11px] font-semibold flex items-center gap-2 transition-all border ${
                          isActive
                            ? `${meta.bgClass} ${meta.borderClass} text-white`
                            : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:border-white/15'
                        }`}
                      >
                        {meta.icon}
                        <span className="flex-1">{meta.label}</span>
                        {isActive && <ArrowRight className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT: ACTIVE PLATFORM VARIANT DETAIL */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {activeAdaptation ? (
                  <>
                    {/* Variant Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {PLATFORM_META[activeAdaptation.platformId].icon}
                        <h3 className="text-sm font-bold text-white">{activeAdaptation.platform} Variant</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${PLATFORM_META[activeAdaptation.platformId].bgClass} ${PLATFORM_META[activeAdaptation.platformId].borderClass} border text-white`}>
                          {activeAdaptation.format}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                        {activeAdaptation.estimatedReach}
                      </span>
                    </div>

                    {/* Meta Row */}
                    <div className="flex items-center gap-3 flex-wrap text-[10px] font-mono text-slate-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-500" /> {activeAdaptation.length}</span>
                      <span className="flex items-center gap-1"><Layers className="w-3 h-3 text-slate-500" /> {activeAdaptation.aspectRatio === 'text' ? 'Text' : activeAdaptation.aspectRatio}</span>
                      {activeAdaptation.safeAreaRequired && (
                        <span className="flex items-center gap-1 text-indigo-400"><Shield className="w-3 h-3" /> Safe Area</span>
                      )}
                      <span className="text-slate-500">Tone: {activeAdaptation.toneAdjustment.split(',')[0]}</span>
                    </div>

                    {/* HOOK */}
                    <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">Adapted Hook</span>
                        <button
                          onClick={() => handleCopy(`hook-${activePlatform}`, activeAdaptation.hook)}
                          className="p-1 rounded-lg text-slate-500 hover:text-white"
                        >
                          {copiedMap[`hook-${activePlatform}`] ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <p className="text-white font-bold text-sm leading-snug">{activeAdaptation.hook}</p>
                    </div>

                    {/* BODY */}
                    <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Adapted Body / Script</span>
                        <button
                          onClick={() => handleCopy(`body-${activePlatform}`, activeAdaptation.adaptedBody)}
                          className="p-1 rounded-lg text-slate-500 hover:text-white"
                        >
                          {copiedMap[`body-${activePlatform}`] ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-line">{activeAdaptation.adaptedBody}</p>
                    </div>

                    {/* CTA */}
                    <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-1.5">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Call To Action</span>
                      <p className="text-cyan-200 text-xs font-semibold leading-snug">{activeAdaptation.cta}</p>
                    </div>

                    {/* CAPTION / HASHTAGS */}
                    {(activeAdaptation.captionText || activeAdaptation.hashtags.length > 0) && (
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                        {activeAdaptation.captionText && (
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Caption</span>
                            <p className="text-slate-300 text-xs">{activeAdaptation.captionText}</p>
                          </div>
                        )}
                        {activeAdaptation.hashtags.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            <Hash className="w-3 h-3 text-slate-500 shrink-0" />
                            {activeAdaptation.hashtags.map((tag, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] font-mono text-slate-400 border border-white/5">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* STRUCTURE NOTES */}
                    <button
                      onClick={() => toggleSection(`notes-${activePlatform}`)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 hover:text-white"
                    >
                      <span className="font-semibold">Platform Structure Notes</span>
                      {expandedSections[`notes-${activePlatform}`] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    {expandedSections[`notes-${activePlatform}`] && (
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 leading-relaxed">
                        <p><strong className="text-slate-300">Caption style:</strong> {activeAdaptation.captionStyle}</p>
                        <p className="mt-1"><strong className="text-slate-300">Structure:</strong> {activeAdaptation.structureNotes}</p>
                      </div>
                    )}

                    {/* Copy full variant */}
                    <button
                      onClick={() => handleCopy(
                        `full-${activePlatform}`,
                        `${activeAdaptation.hook}\n\n${activeAdaptation.adaptedBody}\n\n${activeAdaptation.cta}\n\n${activeAdaptation.captionText}\n\n${activeAdaptation.hashtags.join(' ')}`
                      )}
                      className="w-full py-2.5 rounded-xl glass-button text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-2"
                    >
                      {copiedMap[`full-${activePlatform}`]
                        ? <><Check className="w-4 h-4 text-emerald-400" /> Copied!</>
                        : <><Copy className="w-4 h-4" /> Copy Full Platform Package</>
                      }
                    </button>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                    Select a platform from the left panel
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── CONTENT: TREE VIEW ─── */}
          {contentTree && !isGenerating && activeView === 'tree' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Source Node */}
                <div className="flex flex-col items-center">
                  <div className="p-4 rounded-2xl bg-indigo-950/30 border-2 border-indigo-500/40 w-full max-w-md space-y-2 shadow-glow-primary">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-400" />
                      <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">Source Project</span>
                    </div>
                    <h4 className="text-white font-bold text-sm">{contentTree.sourceTopic}</h4>
                    <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-2">{contentTree.sourceHook}</p>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                      <span>{contentTree.sourceDuration}</span>
                      <span>9:16</span>
                      <span>Sarth's DNA</span>
                    </div>
                  </div>

                  {/* Connector Lines */}
                  <div className="w-px h-8 bg-gradient-to-b from-indigo-500/50 to-transparent" />
                  <GitBranch className="w-5 h-5 text-indigo-400 -my-1" />
                  <div className="w-px h-4 bg-white/10" />
                </div>

                {/* Variant Nodes */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {contentTree.platformAdaptations.map(a => {
                    const meta = PLATFORM_META[a.platformId];
                    return (
                      <button
                        key={a.platformId}
                        onClick={() => {
                          setActivePlatform(a.platformId);
                          setActiveView('variants');
                        }}
                        className={`p-3 rounded-2xl border ${meta.borderClass} ${meta.bgClass} space-y-2 text-left transition-all hover:scale-[1.02] hover:shadow-lg group`}
                      >
                        <div className="flex items-center gap-2">
                          {meta.icon}
                          <span className="text-white text-xs font-bold">{meta.label}</span>
                        </div>
                        <p className="text-[10px] text-white/80 leading-snug line-clamp-2">{a.hook}</p>
                        <div className="flex items-center justify-between text-[9px] font-mono text-white/50">
                          <span>{a.length}</span>
                          <span>{a.aspectRatio === 'text' ? 'Text' : a.aspectRatio}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[9px] text-white/40 group-hover:text-white/70 transition-colors">
                          <Eye className="w-3 h-3" />
                          <span>View variant</span>
                          <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* What-If section */}
                {contentTree.whatIfVariants.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <Zap className="w-4 h-4 text-amber-400" />
                      What-If Variants (Hook Exploration)
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {contentTree.whatIfVariants.map(v => (
                        <div key={v.id} className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-1.5">
                          <span className="text-[9px] font-mono text-amber-400 font-bold">{v.label}</span>
                          <p className="text-[10px] text-white font-semibold leading-snug line-clamp-2">{v.hookText}</p>
                          <div className="flex items-center gap-2 text-[9px] font-mono text-slate-400">
                            <span>{v.duration}s</span>
                            <span>{v.tone}</span>
                          </div>
                          <div className="text-[9px] text-amber-300/70">Est. Opportunity: {v.estimatedOpportunityScore}/100</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-center text-[10px] text-slate-500 font-mono pt-4">
                  Generated: {new Date(contentTree.generatedAt).toLocaleTimeString()} • Source: {contentTree.source}
                </div>
              </div>
            </div>
          )}

          {/* ─── FOOTER ─── */}
          <div className="px-6 py-3 border-t border-white/10 bg-[#080910] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="px-4 py-2 rounded-xl glass-button text-xs font-semibold text-slate-400">
                Close
              </button>
              {contentTree && (
                <button
                  onClick={handleGenerate}
                  className="px-4 py-2 rounded-xl glass-button text-xs font-semibold text-indigo-300 hover:text-white flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3" />
                  Regenerate
                </button>
              )}
            </div>
            <button
              onClick={() => { onClose(); onNavigate('analytics'); }}
              className="px-5 py-2.5 rounded-xl glass-button-primary text-xs font-bold text-white flex items-center gap-2 shadow-glow-primary"
            >
              Schedule Across All Platforms
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
