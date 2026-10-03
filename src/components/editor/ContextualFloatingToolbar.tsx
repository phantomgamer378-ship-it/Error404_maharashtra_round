import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Flame, 
  Smile, 
  Target, 
  Globe, 
  MessageSquare, 
  Check, 
  X,
  ArrowRight,
  Brain,
  Layers
} from 'lucide-react';
import { TimelineClip } from '../../features/editor/types';

interface ContextualFloatingToolbarProps {
  selectedClip: TimelineClip;
  onApplyPreset: (promptText: string) => void;
  isAiProcessing: boolean;
}

export const ContextualFloatingToolbar: React.FC<ContextualFloatingToolbarProps> = ({
  selectedClip,
  onApplyPreset,
  isAiProcessing,
}) => {
  const [showInlineAsk, setShowInlineAsk] = useState(false);
  const [inlinePrompt, setInlinePrompt] = useState('');

  const handleInlineSubmit = () => {
    if (!inlinePrompt.trim()) return;
    onApplyPreset(inlinePrompt.trim());
    setInlinePrompt('');
    setShowInlineAsk(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.94 }}
      transition={{ duration: 0.2 }}
      className="absolute -top-14 left-1/2 -translate-x-1/2 z-40 p-1.5 rounded-2xl glass-panel-l4 border border-indigo-500/40 shadow-2xl flex items-center gap-1 backdrop-blur-2xl select-none"
    >
      {/* Scope Tag Indicator */}
      <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30 font-bold shrink-0">
        <Sparkles className="w-3 h-3 text-indigo-400" />
        <span className="truncate max-w-[85px]">{selectedClip.title}</span>
      </div>

      {isAiProcessing ? (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 text-xs font-mono animate-pulse">
          <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-400" />
          <span>Refining scope...</span>
        </div>
      ) : showInlineAsk ? (
        <div className="flex items-center gap-1.5 px-1">
          <input
            type="text"
            value={inlinePrompt}
            onChange={(e) => setInlinePrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInlineSubmit()}
            placeholder="Ask AI for this scope..."
            autoFocus
            className="w-48 bg-black/60 border border-indigo-400 rounded-lg px-2 py-0.5 text-xs text-white placeholder-slate-400 focus:outline-none font-medium"
          />
          <button
            onClick={handleInlineSubmit}
            disabled={!inlinePrompt.trim()}
            className="p-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-30"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowInlineAsk(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          {/* Improve */}
          <button
            onClick={() => onApplyPreset('Make this hook stronger and sharper')}
            className="px-2 py-1 rounded-xl glass-button text-[11px] font-semibold text-slate-200 hover:text-white flex items-center gap-1 whitespace-nowrap"
            title="Sharpen and improve"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Improve</span>
          </button>

          {/* Make engaging */}
          <button
            onClick={() => onApplyPreset('Make this more engaging but keep my style')}
            className="px-2 py-1 rounded-xl glass-button text-[11px] font-semibold text-slate-200 hover:text-white flex items-center gap-1 whitespace-nowrap"
            title="Add high curiosity and stakes"
          >
            <Flame className="w-3 h-3 text-amber-400" />
            <span>Engaging</span>
          </button>

          {/* Make humorous */}
          <button
            onClick={() => onApplyPreset('Make this more humorous')}
            className="px-2 py-1 rounded-xl glass-button text-[11px] font-semibold text-slate-200 hover:text-white flex items-center gap-1 whitespace-nowrap"
            title="Inject Sarth's relatable humor"
          >
            <Smile className="w-3 h-3 text-purple-400" />
            <span>Humorous</span>
          </button>

          {/* Make professional */}
          <button
            onClick={() => onApplyPreset('Make this more professional')}
            className="px-2 py-1 rounded-xl glass-button text-[11px] font-semibold text-slate-200 hover:text-white flex items-center gap-1 whitespace-nowrap"
            title="Corporate / LinkedIn security style"
          >
            <Target className="w-3 h-3 text-cyan-400" />
            <span>Professional</span>
          </button>

          {/* Translate / Hinglish */}
          <button
            onClick={() => onApplyPreset('Rewrite this in Hinglish')}
            className="px-2 py-1 rounded-xl glass-button text-[11px] font-semibold text-slate-200 hover:text-white flex items-center gap-1 whitespace-nowrap"
            title="Colloquial Hinglish adaptation"
          >
            <Globe className="w-3 h-3 text-emerald-400" />
            <span>Hinglish</span>
          </button>

          {/* Ask AI */}
          <button
            onClick={() => setShowInlineAsk(true)}
            className="px-2 py-1 rounded-xl glass-button-primary text-[11px] font-bold text-white flex items-center gap-1 whitespace-nowrap shadow-sm"
            title="Custom AI command on this element"
          >
            <MessageSquare className="w-3 h-3 text-white" />
            <span>Ask AI</span>
          </button>
        </div>
      )}
    </motion.div>
  );
};
