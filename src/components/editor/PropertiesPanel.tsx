import React, { useState } from 'react';
import { 
  Sparkles, 
  Sliders, 
  Type, 
  Volume2, 
  Clock, 
  Wand2, 
  Check, 
  Smile, 
  Target, 
  Flame, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Brain,
  Send,
  Layers,
  RotateCcw,
  History,
  ArrowRight,
  Zap
} from 'lucide-react';
import { TimelineClip, ClipStyle, EditorState } from '../../features/editor/types';

interface PropertiesPanelProps {
  selectedClip: TimelineClip | null;
  state: EditorState;
  onUpdateClipText: (clipId: string, text: string) => void;
  onUpdateClipStyle: (clipId: string, updates: Partial<ClipStyle>) => void;
  onUpdateClipAudio: (clipId: string, level: number) => void;
  onApplyAiAction: (actionType: 'engaging' | 'humorous' | 'professional' | 'sharpen') => void;
  onCustomAiCommand: (command: string) => void;
  onUndoAiOperation?: (opId: string) => void;
  isAiProcessing?: boolean;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedClip,
  state,
  onUpdateClipText,
  onUpdateClipStyle,
  onUpdateClipAudio,
  onApplyAiAction,
  onCustomAiCommand,
  onUndoAiOperation,
  isAiProcessing = false,
}) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'ai' | 'log'>('properties');
  const [customCommand, setCustomCommand] = useState('');

  const handleCommandSubmit = () => {
    if (!customCommand.trim() || isAiProcessing) return;
    onCustomAiCommand(customCommand);
    setCustomCommand('');
  };

  const handleAiAction = (action: 'engaging' | 'humorous' | 'professional' | 'sharpen') => {
    onApplyAiAction(action);
  };

  const aiLog = state.aiLog || [];

  return (
    <div className="w-full md:w-80 glass-panel-l2 border-l border-white/10 flex flex-col shrink-0 select-none overflow-hidden bg-[#06070B]">
      {/* Panel Tab Switcher */}
      <div className="h-11 px-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#080910]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              activeTab === 'properties'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
              activeTab === 'ai'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>AI</span>
          </button>
          <button
            onClick={() => setActiveTab('log')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 relative ${
              activeTab === 'log'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3 h-3" />
            <span>Log</span>
            {aiLog.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-indigo-500 text-white text-[8px] font-mono flex items-center justify-center">
                {aiLog.length > 9 ? '9+' : aiLog.length}
              </span>
            )}
          </button>
        </div>

        <span className="text-[10px] text-slate-500 font-mono">
          {selectedClip ? selectedClip.trackType.toUpperCase() : 'CANVAS'}
        </span>
      </div>

      {/* Main Panel Content Body */}
      <div className="flex-1 p-4 space-y-5 overflow-y-auto">
        
        {/* TAB 1: PROPERTIES (ADAPTS TO SELECTION) */}
        {activeTab === 'properties' && (
          <>
            {selectedClip ? (
              <div className="space-y-4 text-xs">
                {/* Header */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">
                    Selected Element:
                  </span>
                  <h4 className="text-sm font-bold text-white truncate">
                    {selectedClip.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Timing: {selectedClip.startSeconds.toFixed(1)}s - {selectedClip.endSeconds.toFixed(1)}s ({selectedClip.duration.toFixed(1)}s)
                  </p>
                </div>

                {/* TEXT / CAPTION PROPERTIES */}
                {(selectedClip.trackType === 'text' || selectedClip.trackType === 'captions') && (
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                    <label className="text-slate-300 font-bold block flex items-center justify-between">
                      <span>Content Text</span>
                      <span className="text-[10px] text-indigo-400 font-mono">Live Sync</span>
                    </label>
                    <textarea
                      value={selectedClip.content || ''}
                      onChange={(e) => onUpdateClipText(selectedClip.id, e.target.value)}
                      className="w-full bg-[#0a0c16] border border-white/10 rounded-xl p-2.5 text-xs text-white leading-relaxed focus:outline-none focus:border-indigo-400 font-medium resize-none"
                      rows={3}
                    />

                    {/* Font Size & Position Controls */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block mb-1">Font Size:</span>
                        <input
                          type="range"
                          min="12"
                          max="28"
                          value={selectedClip.style?.fontSize || 16}
                          onChange={(e) => onUpdateClipStyle(selectedClip.id, { fontSize: +e.target.value })}
                          className="w-full accent-indigo-500 h-1 bg-white/10 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block mb-1">Position:</span>
                        <div className="flex bg-[#0b0d18] rounded-lg p-0.5 border border-white/10">
                          {(['top', 'center', 'bottom'] as const).map((pos) => (
                            <button
                              key={pos}
                              onClick={() => onUpdateClipStyle(selectedClip.id, { position: pos })}
                              className={`flex-1 py-0.5 text-[9px] font-mono capitalize rounded ${
                                selectedClip.style?.position === pos
                                  ? 'bg-indigo-600 text-white font-bold'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {pos}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* AUDIO PROPERTIES */}
                {selectedClip.trackType === 'audio' && (
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                    <label className="text-slate-300 font-bold block flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-pink-400" />
                        Audio Level
                      </span>
                      <span className="text-xs font-mono font-bold text-pink-300">
                        {selectedClip.audioLevel ?? 80}%
                      </span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedClip.audioLevel ?? 80}
                      onChange={(e) => onUpdateClipAudio(selectedClip.id, +e.target.value)}
                      className="w-full accent-pink-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Mute (0%)</span>
                      <span>Default (80%)</span>
                      <span>Max (100%)</span>
                    </div>
                  </div>
                )}

                {/* VIDEO PROPERTIES */}
                {selectedClip.trackType === 'video' && (
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2.5">
                    <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase block">
                      Source A-Roll Mapping
                    </span>
                    <p className="text-white font-semibold">{selectedClip.title}</p>
                    <div className="text-[11px] text-slate-400 font-mono space-y-1">
                      <div>Raw Source Offset: 00:17:20 - 00:18:02</div>
                      <div>Speed: 1.0x Normal</div>
                      <div>Resolution: 3840x2160 (Smart 9:16 Centered)</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Canvas Global Properties when no clip selected */
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase block">
                    Global Canvas Settings
                  </span>
                  <div className="space-y-1 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Aspect Ratio:</span>
                      <strong className="text-white">{state.project.aspectRatio}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Duration:</span>
                      <strong className="text-white">{state.project.duration}s</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Resolution:</span>
                      <strong className="text-white">
                        {state.project.aspectRatio === '9:16' ? '1080x1920' : '1920x1080'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
                  <span className="text-[10px] font-bold text-indigo-300 uppercase block">
                    Selection Tip:
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Click any clip on the timeline or directly on the video preview overlay to adjust text, timing, or audio properties.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB 2: AI ASSISTANT (CONTEXTUAL TOOLBAR ACTIONS) */}
        {activeTab === 'ai' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold border-b border-white/10 pb-2">
              <Brain className="w-4 h-4 text-indigo-400" />
              <span>AI Scope Actions</span>
            </div>

            <p className="text-[11px] text-slate-400">
              Apply scoped creative modifications without rewriting unrelated parts of the project:
            </p>

            {/* Quick Contextual Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => handleAiAction('engaging')}
                disabled={isAiProcessing}
                className="w-full p-2.5 rounded-xl glass-button text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-between group transition-all"
              >
                <span className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  Make More Engaging
                </span>
                <span className="text-[10px] font-mono text-slate-500">Curiosity +12%</span>
              </button>

              <button
                onClick={() => handleAiAction('humorous')}
                disabled={isAiProcessing}
                className="w-full p-2.5 rounded-xl glass-button text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-between group transition-all"
              >
                <span className="flex items-center gap-2">
                  <Smile className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  Make Humorous
                </span>
                <span className="text-[10px] font-mono text-slate-500">Sarth DNA</span>
              </button>

              <button
                onClick={() => handleAiAction('professional')}
                disabled={isAiProcessing}
                className="w-full p-2.5 rounded-xl glass-button text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-between group transition-all"
              >
                <span className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  Make Professional
                </span>
                <span className="text-[10px] font-mono text-slate-500">LinkedIn Ready</span>
              </button>

              <button
                onClick={() => handleAiAction('sharpen')}
                disabled={isAiProcessing}
                className="w-full p-2.5 rounded-xl glass-button-primary text-xs font-bold text-white flex items-center justify-between shadow-glow-primary group"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                  Sharpen Opening Hook
                </span>
                <span className="text-[10px] font-mono text-indigo-200">Optimal 4s</span>
              </button>
            </div>

            {/* Custom AI Command Prompt */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <label className="text-[11px] font-semibold text-slate-300 block">
                Ask VIDORA to modify selected scope:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customCommand}
                  onChange={(e) => setCustomCommand(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCommandSubmit()}
                  placeholder="e.g. 'Shorten to 3 seconds' or 'Make it punchier'..."
                  className="w-full bg-[#0a0c16] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 pr-8"
                />
                <button
                  onClick={handleCommandSubmit}
                  disabled={!customCommand.trim() || isAiProcessing}
                  className="absolute right-2 top-2 text-indigo-400 hover:text-white disabled:opacity-30"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {isAiProcessing && (
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono flex items-center gap-2 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Applying scoped edit...</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AI CHANGES LOG */}
        {activeTab === 'log' && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold border-b border-white/10 pb-2">
              <History className="w-4 h-4 text-indigo-400" />
              <span>AI Changes Log</span>
              <span className="ml-auto text-[10px] font-mono text-slate-500">{aiLog.length} ops</span>
            </div>

            {aiLog.length === 0 ? (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-2">
                <Zap className="w-6 h-6 text-slate-600 mx-auto" />
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  No AI edits yet. Use the command bar below or the floating toolbar on a selected element.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {aiLog.map((entry) => (
                  <div
                    key={entry.id}
                    className={`p-3 rounded-2xl border space-y-2 transition-all ${
                      entry.undone
                        ? 'bg-white/[0.02] border-white/5 opacity-50'
                        : 'bg-indigo-950/20 border-indigo-500/20'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <span className="text-[10px] font-mono text-indigo-400 font-bold truncate">
                          {entry.elementLabel}
                        </span>
                        <p className="text-white text-[11px] font-semibold leading-tight line-clamp-2">
                          "{entry.command}"
                        </p>
                      </div>
                      {!entry.undone && onUndoAiOperation && (
                        <button
                          onClick={() => onUndoAiOperation(entry.id)}
                          title="Undo this AI change"
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 hover:text-white border border-rose-500/30 transition-all shrink-0"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                      {entry.undone && (
                        <span className="text-[10px] font-mono text-slate-500 italic shrink-0">undone</span>
                      )}
                    </div>

                    {/* Before → After Diff Chip */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-start gap-1.5 p-1.5 rounded-lg bg-rose-950/30 border border-rose-500/20">
                        <span className="text-[9px] font-mono text-rose-400 font-bold shrink-0 mt-0.5">BEFORE</span>
                        <span className="text-[10px] text-rose-200/80 leading-tight line-clamp-2">{entry.diff.before}</span>
                      </div>
                      <div className="flex items-center gap-1 px-1">
                        <ArrowRight className="w-3 h-3 text-slate-600" />
                      </div>
                      <div className="flex items-start gap-1.5 p-1.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
                        <span className="text-[9px] font-mono text-emerald-400 font-bold shrink-0 mt-0.5">AFTER</span>
                        <span className="text-[10px] text-emerald-200/80 leading-tight line-clamp-2">{entry.diff.after}</span>
                      </div>
                    </div>

                    {/* DNA Influence + Timestamp */}
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-indigo-400/70 font-mono truncate max-w-[150px]">
                        {entry.dnaInfluence}
                      </span>
                      <span className="text-[9px] text-slate-600 font-mono shrink-0">
                        {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
