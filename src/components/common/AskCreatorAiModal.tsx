import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Search, 
  Command, 
  X, 
  ArrowRight, 
  TrendingUp, 
  Wand2, 
  Film, 
  BrainCircuit,
  FileText,
  Share2
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface AskCreatorAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavigationTab) => void;
  onExecutePromptAction?: (promptText: string) => void;
}

export const AskCreatorAiModal: React.FC<AskCreatorAiModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onExecutePromptAction
}) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const suggestedPrompts = [
    "What topic has the highest opportunity score today?",
    "Find content gaps in Cybersecurity & AI",
    "Generate 3 curiosity hooks for AI Voice Scams",
    "Turn AI Voice Scam concept into a 35s Reel script",
    "Show footage where I talk about AI security",
    "How is my question hook strategy performing?"
  ];

  const handleRunPrompt = (promptText: string) => {
    setQuery(promptText);
    setIsThinking(true);
    setResponse(null);

    setTimeout(() => {
      setIsThinking(false);
      if (promptText.toLowerCase().includes('topic') || promptText.toLowerCase().includes('opportunity')) {
        setResponse("🚀 **AI Voice Scams** has an Opportunity Score of **89/100** with high audience fit (88%) and low competition saturation (32%). Would you like me to open Trend.Ai or draft a script?");
      } else if (promptText.toLowerCase().includes('gap')) {
        setResponse("🎯 **Content Gap Detected:** 'AI + College Campus Emergency Scams' has HIGH audience relevance for your 18-24 demographic, but zero creator coverage. Click below to turn this gap into a script!");
      } else if (promptText.toLowerCase().includes('hook')) {
        setResponse("🔥 **3 Generated Hook Variants:**\n1. *If your mom calls crying asking for money, STOP. Ask this 1 word first.*\n2. *That wasn't my real voice. That was an AI clone trained in 3 seconds.*\n3. *I tried to scam my roommate with an AI voice clone...*");
      } else {
        setResponse(`✨ **VIDORA Recommendation:** Analyzing your request "${promptText}". I recommend routing to the Creation Studio with Sarth's Creator DNA applied.`);
      }
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/70 backdrop-blur-md">
        <div className="absolute inset-0 -z-10" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl glass-panel-l4 rounded-t-2xl sm:rounded-2xl border border-white/15 overflow-hidden shadow-2xl"
        >
          {/* Header Input */}
          <div className="relative flex items-center px-4 py-3 border-b border-white/10 bg-white/[0.03]">
            <Sparkles className="w-5 h-5 text-indigo-400 mr-3 animate-pulse" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) {
                  handleRunPrompt(query);
                }
              }}
              placeholder="Ask VIDORA... e.g. 'What should I create today?' or 'Generate 3 hooks'"
              className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none font-medium"
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white mr-2">
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="px-2 py-0.5 rounded bg-white/10 text-slate-400 text-[10px] font-mono border border-white/10">
              ESC
            </kbd>
          </div>

          {/* Thinking indicator */}
          {isThinking && (
            <div className="p-6 flex items-center gap-3 text-indigo-300 text-sm">
              <BrainCircuit className="w-5 h-5 animate-spin text-indigo-400" />
              <div className="space-y-1">
                <p className="font-semibold uppercase tracking-wider text-xs">VIDORA IS THINKING...</p>
                <p className="text-xs text-slate-400">Searching trends, Creator DNA parameters, & retention signals...</p>
              </div>
            </div>
          )}

          {/* Response area */}
          {response && !isThinking && (
            <div className="p-6 border-b border-white/10 bg-indigo-950/20 space-y-3">
              <div className="flex items-start gap-3 text-slate-100 text-sm leading-relaxed whitespace-pre-line">
                {response}
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('trend-ai');
                  }}
                  className="px-3 py-1.5 rounded-lg glass-button-primary text-xs font-semibold flex items-center gap-1.5"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Open Trend.Ai</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('editor');
                  }}
                  className="px-3 py-1.5 rounded-lg glass-button text-xs font-medium text-slate-200 flex items-center gap-1.5"
                >
                  <Film className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Open Video Editor</span>
                </button>
              </div>
            </div>
          )}

          {/* Suggested Prompts */}
          {!response && !isThinking && (
            <div className="p-5 space-y-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Intelligent Prompt Suggestions
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRunPrompt(p)}
                    className="p-3 rounded-xl glass-panel-l1 hover:glass-panel-l2 text-left text-xs text-slate-300 hover:text-white transition-all border border-white/5 hover:border-indigo-500/30 flex items-center justify-between group"
                  >
                    <span className="line-clamp-1">{p}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer controls */}
          <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Command className="w-3 h-3" /> Navigation</span>
              <span className="flex items-center gap-1"><Wand2 className="w-3 h-3 text-indigo-400" /> AI Natural Command</span>
            </div>
            <span className="text-slate-500 text-[11px]">VIDORA Intelligence Operating System v2.4</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
