import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Flame, 
  Target, 
  ArrowRight, 
  Film, 
  Edit3, 
  RotateCcw, 
  Check, 
  Copy, 
  Share2,
  Brain,
  Wand2,
  Clock,
  Layers,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FolderPlus,
  Tv
} from 'lucide-react';
import { NavigationTab, Project } from '../../types';
import { ScoredOpportunity } from '../../features/opportunity-engine/types';
import { useCreator } from '../../context/CreatorContext';
import { 
  contentService, 
  GeneratedContentPayload, 
  HookVariant, 
  ScriptSection 
} from '../../lib/services/ContentService';
import { AIThinking, DEFAULT_SCRIPT_THINKING_STEPS } from '../ui/AIThinking';
import { DemoDataBadge } from '../ui/DemoDataBadge';

interface ContentGenerationViewProps {
  topic: string;
  angle?: string;
  opportunity?: ScoredOpportunity | null;
  onNavigate: (tab: NavigationTab) => void;
  onOpenVideoEditor: () => void;
}

export const ContentGenerationView: React.FC<ContentGenerationViewProps> = ({
  topic,
  angle,
  opportunity,
  onNavigate,
  onOpenVideoEditor,
}) => {
  const { creator, addProject, updateIdeaStatus } = useCreator();

  const [isLoading, setIsLoading] = useState(true);
  const [contentPayload, setContentPayload] = useState<GeneratedContentPayload | null>(null);

  // Editable local state
  const [selectedHookIndex, setSelectedHookIndex] = useState(2); // default shock/curiosity
  const [hooks, setHooks] = useState<HookVariant[]>([]);
  const [scriptSections, setScriptSections] = useState<ScriptSection[]>([]);
  const [ctaText, setCtaText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [projectStatus, setProjectStatus] = useState<Project['status']>('Draft');
  const [regeneratingSectionId, setRegeneratingSectionId] = useState<string | null>(null);
  const [regeneratingHookStyle, setRegeneratingHookStyle] = useState<string | null>(null);

  // Load content from ContentService on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    contentService
      .generateContent({
        topic,
        angle: angle || opportunity?.evidence?.suggestedAngle,
        creator,
        whyNow: opportunity?.evidence?.whyNow,
        platform: opportunity?.evidence?.platform,
      })
      .then((payload) => {
        if (!isMounted) return;
        setContentPayload(payload);
        setHooks(payload.hooks);
        setSelectedHookIndex(payload.selectedHookIndex ?? 2);
        setScriptSections(payload.scriptSections);
        setCtaText(payload.cta);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [topic, angle, opportunity, creator]);

  const handleCopyScript = () => {
    if (!contentPayload) return;
    const activeHook = hooks[selectedHookIndex]?.text || '';
    const fullText = `[HOOK]\n${activeHook}\n\n` + 
      scriptSections.map(s => `[${s.sectionTitle} (${s.timestamp})]\n${s.content}`).join('\n\n') +
      `\n\n[CTA]\n${ctaText}`;

    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveToProjects = () => {
    if (!contentPayload) return;
    const activeHook = hooks[selectedHookIndex]?.text || '';
    
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: `${topic}: ${contentPayload.angle.slice(0, 50)}...`,
      niche: opportunity?.category || creator.niche[0] || 'Technology',
      status: projectStatus,
      updatedAt: 'Just now',
      duration: contentPayload.targetDuration || '38s',
      thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
      hookText: activeHook,
      scriptText: scriptSections.map(s => `[${s.sectionTitle}]\n${s.content}`).join('\n\n'),
      opportunityScore: opportunity?.opportunityScore || 90,
    };

    addProject(newProject);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Section-specific inline regeneration
  const handleRegenerateSection = async (secId: string) => {
    setRegeneratingSectionId(secId);
    const targetSec = scriptSections.find(s => s.id === secId);
    if (targetSec) {
      const refined = await contentService.regenerateSection(secId, targetSec.content, creator);
      setScriptSections(prev =>
        prev.map(s => s.id === secId ? { ...s, content: refined } : s)
      );
    }
    setRegeneratingSectionId(null);
  };

  // Hook-specific inline regeneration
  const handleRegenerateHook = async (style: 'Question' | 'Story' | 'Shock/Curiosity', index: number) => {
    setRegeneratingHookStyle(style);
    const newHook = await contentService.regenerateHook(style, topic, creator);
    setHooks(prev => {
      const next = [...prev];
      next[index] = newHook;
      return next;
    });
    setRegeneratingHookStyle(null);
  };

  if (isLoading || !contentPayload) {
    return (
      <div className="py-12 max-w-2xl mx-auto space-y-6">
        <AIThinking
          steps={DEFAULT_SCRIPT_THINKING_STEPS}
          durationMs={1300}
        />
      </div>
    );
  }

  const activeHook = hooks[selectedHookIndex] || hooks[0];

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Brain className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>CREATOR WORKSPACE • CONTENT GENERATION</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30 font-bold">
              DNA Injected: {creator.name}
            </span>
            <DemoDataBadge />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Topic: <span className="text-gradient-accent">"{topic}"</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {contentPayload.angle}
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          <button
            onClick={handleCopyScript}
            className="px-3.5 py-2.5 rounded-xl glass-button text-xs font-semibold text-slate-300 flex items-center gap-1.5 hover:text-white"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? 'Copied' : 'Copy Script'}</span>
          </button>

          <button
            onClick={handleSaveToProjects}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isSaved
                ? 'bg-emerald-600 text-white shadow-glow-primary'
                : 'glass-button text-slate-200 hover:text-white'
            }`}
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <FolderPlus className="w-4 h-4" />}
            <span>{isSaved ? 'Saved to Projects' : 'Save as Project'}</span>
          </button>

          <button
            onClick={onOpenVideoEditor}
            className="px-5 py-2.5 rounded-xl glass-button-primary text-xs font-bold text-white flex items-center gap-2 shadow-glow-primary"
          >
            <Film className="w-4 h-4 text-white" />
            <span>Open in Video Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SPLIT LAYOUT: LEFT (EDITABLE SCRIPT STRUCTURE) & RIGHT (AI REASONING) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: EDITABLE CONTENT STRUCTURE */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. HOOK VARIATION SELECTOR (3 STYLES: Question, Story, Shock/Curiosity) */}
          <div className="rounded-3xl glass-panel-l3 p-6 border border-indigo-500/30 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  1. Hook Variations (0:00 - 0:05)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Select 1 of 3 calibrated styles
              </span>
            </div>

            <div className="space-y-3">
              {hooks.map((h, idx) => {
                const isSelected = selectedHookIndex === idx;

                return (
                  <div
                    key={h.id}
                    onClick={() => setSelectedHookIndex(idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 select-none ${
                      isSelected
                        ? 'glass-panel-l4 border-indigo-400 ring-1 ring-indigo-400 shadow-glow-primary'
                        : 'glass-panel-l1 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                          h.style === 'Question' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' :
                          h.style === 'Story' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                          'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}>
                          {h.style} Hook
                        </span>
                        {isSelected && (
                          <span className="text-[10px] text-indigo-300 font-mono font-semibold">
                            (Active Hook)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                          {h.curiosityScore}% Curiosity
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRegenerateHook(h.style, idx);
                          }}
                          disabled={regeneratingHookStyle === h.style}
                          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                          title="Regenerate this hook style"
                        >
                          <Wand2 className={`w-3.5 h-3.5 ${regeneratingHookStyle === h.style ? 'animate-spin text-indigo-400' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Inline Editable Hook text */}
                    <textarea
                      value={h.text}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const newText = e.target.value;
                        setHooks(prev => {
                          const next = [...prev];
                          next[idx] = { ...next[idx], text: newText };
                          return next;
                        });
                      }}
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-2.5 text-xs text-white leading-relaxed focus:outline-none focus:border-indigo-400 resize-none font-medium"
                      rows={2}
                    />

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>~{h.text.split(' ').length} words • 3-5 sec delivery</span>
                      <span>{isSelected ? '✓ Injected into Timeline' : 'Click to select'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. SCRIPT SECTIONS (TIMED & INLINE EDITABLE) */}
          <div className="rounded-3xl glass-panel-l3 p-6 border border-white/10 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  2. Script & Pacing Structure
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Target: {contentPayload.targetDuration} Vertical Short
              </span>
            </div>

            <div className="space-y-4">
              {scriptSections.map((sec, idx) => (
                <div 
                  key={sec.id}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold font-mono flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {sec.sectionTitle}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono bg-white/5 px-2 py-0.5 rounded">
                        {sec.timestamp} ({sec.durationSec}s)
                      </span>
                    </div>

                    <button
                      onClick={() => handleRegenerateSection(sec.id)}
                      disabled={regeneratingSectionId === sec.id}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                    >
                      <Wand2 className={`w-3 h-3 ${regeneratingSectionId === sec.id ? 'animate-spin' : ''}`} />
                      <span>{regeneratingSectionId === sec.id ? 'Refining...' : 'Regenerate'}</span>
                    </button>
                  </div>

                  {/* Section Content Textarea */}
                  <textarea
                    value={sec.content}
                    onChange={(e) => {
                      const newContent = e.target.value;
                      setScriptSections(prev =>
                        prev.map(s => s.id === sec.id ? { ...s, content: newContent } : s)
                      );
                    }}
                    className="w-full bg-[#080911] border border-white/10 rounded-xl p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-400 font-mono resize-none"
                    rows={3}
                  />

                  {/* B-Roll Prompt Cue */}
                  <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-start gap-2 text-[11px] text-cyan-200">
                    <Film className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-cyan-300 font-mono">B-Roll Visual Cue:</strong> {sec.bRollPrompt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. CALL TO ACTION (CTA) BLOCK */}
          <div className="rounded-3xl glass-panel-l3 p-6 border border-white/10 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                3. High-Conversion Call To Action
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Closing 8 seconds</span>
            </div>

            <textarea
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              className="w-full bg-[#080911] border border-white/10 rounded-xl p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-400 font-mono resize-none"
              rows={2}
            />
          </div>

          {/* 4. VISUAL B-ROLL SUGGESTIONS */}
          <div className="rounded-3xl glass-panel-l3 p-6 border border-white/10 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Tv className="w-4 h-4 text-purple-400" />
                4. Visual Shot Recommendations
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">AI Visual Direction</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {contentPayload.visualSuggestions.map((v) => (
                <div key={v.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-purple-400 font-bold">{v.timestamp}</span>
                    <span className="text-slate-400">{v.shotType}</span>
                  </div>
                  <p className="text-slate-300">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI REASONING PANEL */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* AI REASONING CARD */}
          <div className="rounded-3xl glass-panel-l3 p-6 border border-indigo-500/30 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">AI Script Reasoning</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold font-mono">
                TRANSPARENT AI
              </span>
            </div>

            {/* Why This Angle */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
                Why this Angle:
              </span>
              <p className="text-slate-200 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/5">
                {contentPayload.aiReasoning.whyAngle}
              </p>
            </div>

            {/* How Creator DNA Influenced It */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block">
                How Creator DNA Influenced This Generation:
              </span>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-1">
                  <span className="text-[10px] text-purple-300 font-semibold block">Tone Alignment:</span>
                  <p className="text-white font-medium">
                    {contentPayload.aiReasoning.creatorDnaInfluence.tone}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-1">
                  <span className="text-[10px] text-purple-300 font-semibold block">Hook Style Calibration:</span>
                  <p className="text-white font-medium">
                    {contentPayload.aiReasoning.creatorDnaInfluence.hookStyle}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-1">
                  <span className="text-[10px] text-purple-300 font-semibold block">Avoided Generic Cliches:</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {contentPayload.aiReasoning.creatorDnaInfluence.avoidedCliches.map((item, i) => (
                      <span 
                        key={i} 
                        className="px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-300 text-[10px] border border-rose-500/20 line-through"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Strategic Considerations */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                What to Consider During Recording:
              </span>
              <div className="space-y-1.5">
                {contentPayload.aiReasoning.considerations.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Graceful Demodata / Fallback Note */}
            {contentPayload.fallbackNote && (
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 italic">
                * Note: {contentPayload.fallbackNote}
              </div>
            )}

            {/* Project Status Selector */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <label className="text-[11px] font-semibold text-slate-400">Save to Project with Status:</label>
              <select
                value={projectStatus}
                onChange={(e) => setProjectStatus(e.target.value as Project['status'])}
                className="w-full bg-[#0b0d17] border border-white/10 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-400 cursor-pointer font-medium"
              >
                <option value="Idea">Idea</option>
                <option value="Draft">Draft</option>
                <option value="Editing">Editing</option>
                <option value="Ready">Ready</option>
                <option value="Published">Published</option>
              </select>
            </div>

            {/* Action CTA */}
            <button
              onClick={onOpenVideoEditor}
              className="w-full py-3.5 rounded-2xl glass-button-primary font-bold text-xs text-white flex items-center justify-center gap-2 shadow-glow-primary"
            >
              <Film className="w-4 h-4" />
              <span>Load Into Video Studio Editor</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
