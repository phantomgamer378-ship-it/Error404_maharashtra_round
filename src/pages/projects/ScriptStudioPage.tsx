import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sparkles, Save, RotateCcw, PenTool, LayoutTemplate, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../../store/auth';

interface ScriptSection {
  id: string;
  type: string;
  content: string;
  status: 'generated' | 'edited' | 'approved';
}

export const ScriptStudioPage = () => {
  const { projectId } = useParams();
  const { dna } = useAuthStore();
  
  const [sections, setSections] = useState<ScriptSection[]>([
    { id: '1', type: 'hook', content: 'Did you know AI voice cloning scams are up 400% this month?', status: 'generated' },
    { id: '2', type: 'context', content: 'Scammers only need a 3-second audio clip from your public social media to clone your voice perfectly.', status: 'approved' },
    { id: '3', type: 'main_points', content: 'Here are the top 3 ways to protect yourself:\n1. Establish a family safe word.\n2. Ignore unknown callers.\n3. Make social media accounts private.', status: 'edited' },
    { id: '4', type: 'cta', content: 'Share this video to save a family member from being scammed, and follow for more cybersecurity tips.', status: 'generated' },
  ]);

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTone, setActiveTone] = useState(dna?.tone || 'educational');

  const handleRegenerate = async (sectionId: string) => {
    setIsGenerating(true);
    // Simulate API call to /api/v1/scripts/regenerate-section
    setTimeout(() => {
      setSections(sections.map(s => {
        if (s.id === sectionId) {
          return { ...s, content: s.content + ' [Regenerated based on Creator DNA]', status: 'generated' };
        }
        return s;
      }));
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full gap-4">
      
      {/* LEFT: OUTLINE & NAVIGATION */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-4 border-r border-border/50 pr-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4" /> Script Outline
        </h2>
        <div className="flex flex-col gap-2">
          {sections.map(section => (
            <button 
              key={section.id}
              onClick={() => setActiveSectionId(section.id)}
              className={`text-left p-3 rounded-lg border transition-all text-sm ${
                activeSectionId === section.id 
                  ? 'bg-primary/10 border-primary text-primary-foreground' 
                  : 'bg-background border-border hover:border-border/80 text-muted-foreground'
              }`}
            >
              <div className="font-semibold capitalize">{section.type.replace('_', ' ')}</div>
              <div className="text-xs truncate opacity-70 mt-1">{section.content}</div>
              <div className="mt-2 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-black/20 inline-block">
                {section.status}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CENTER: EDITOR */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Project Script</h1>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-border hover:bg-secondary transition-colors">
              <RotateCcw className="w-4 h-4" /> Revisions
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
              <Save className="w-4 h-4" /> Save Script
            </button>
          </div>
        </div>
        
        <div className="flex-1 glass-panel-l2 border border-border/50 rounded-xl p-6 overflow-y-auto space-y-6">
          {sections.map(section => (
            <div 
              key={section.id} 
              className={`p-4 rounded-xl border transition-all ${
                activeSectionId === section.id ? 'border-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]' : 'border-transparent hover:border-border/50'
              }`}
              onClick={() => setActiveSectionId(section.id)}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {section.type.replace('_', ' ')}
                </span>
                {section.status === 'generated' && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                    <Sparkles className="w-3 h-3" /> AI GENERATED
                  </span>
                )}
              </div>
              <textarea 
                className="w-full bg-transparent resize-none outline-none text-slate-200 leading-relaxed min-h-[60px]"
                value={section.content}
                onChange={(e) => {
                  setSections(sections.map(s => s.id === section.id ? { ...s, content: e.target.value, status: 'edited' } : s));
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: AI ASSISTANT */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-4 border-l border-border/50 pl-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> AI Assistant
        </h2>
        
        <div className="flex-1 flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-card border border-border/50">
            <h3 className="text-sm font-semibold mb-3">Generation Tone</h3>
            <select 
              value={activeTone}
              onChange={(e) => setActiveTone(e.target.value)}
              className="w-full p-2 text-sm rounded bg-background border border-border"
            >
              <option value="educational">Educational</option>
              <option value="entertaining">Entertaining</option>
              <option value="inspirational">Inspirational</option>
            </select>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border/50 flex flex-col gap-2">
            <h3 className="text-sm font-semibold mb-1">Actions</h3>
            <button 
              disabled={isGenerating}
              onClick={() => handleRegenerate('1')}
              className="flex items-center gap-2 w-full p-2 text-sm rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" /> {isGenerating ? 'Generating...' : 'Generate Alternate Hooks'}
            </button>
            <button 
              disabled={isGenerating || !activeSectionId}
              onClick={() => activeSectionId && handleRegenerate(activeSectionId)}
              className="flex items-center gap-2 w-full p-2 text-sm rounded border border-border hover:bg-secondary transition-colors disabled:opacity-50"
            >
              <PenTool className="w-4 h-4" /> Rewrite Selected
            </button>
            <button className="flex items-center justify-center gap-2 w-full p-2 text-sm rounded border border-border hover:bg-secondary transition-colors mt-2">
              Generate CTA
            </button>
          </div>

          <div className="mt-auto p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs leading-relaxed">
            <p className="font-bold mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3"/> DNA Matched</p>
            Your current Creator DNA (Niche: {dna?.niche.join(', ')}, Tone: {dna?.tone}) is automatically injected into every prompt.
          </div>
        </div>
      </div>

    </div>
  );
};
