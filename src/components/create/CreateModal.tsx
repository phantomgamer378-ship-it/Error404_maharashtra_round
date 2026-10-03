import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  FileText, 
  Video, 
  Repeat, 
  Lightbulb, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Command,
  CornerDownLeft
} from 'lucide-react';
import { NavigationTab } from '../../types';
import { ScoredOpportunity } from '../../features/opportunity-engine/types';
import { ScoreRing } from '../ui/ScoreRing';
import { DemoDataBadge } from '../ui/DemoDataBadge';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunities?: ScoredOpportunity[];
  onNavigate: (tab: NavigationTab) => void;
  onStartGeneration: (topic: string, optionType?: string, opp?: ScoredOpportunity) => void;
}

export const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  opportunities = [],
  onNavigate,
  onStartGeneration,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('trend-rec');
  const [topicInput, setTopicInput] = useState<string>('AI Voice Scams');
  const [selectedOppId, setSelectedOppId] = useState<string>(opportunities[0]?.id || 'ai-voice-scams');

  const selectedOpp = opportunities.find(o => o.id === selectedOppId) || opportunities[0];

  // Keyboard shortcut listener (Cmd+K / Ctrl+K, Esc, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === '1') setSelectedOption('trend-rec');
      if (e.key === '2') setSelectedOption('idea');
      if (e.key === '3') setSelectedOption('script');
      if (e.key === '4') setSelectedOption('raw-footage');
      if (e.key === '5') setSelectedOption('repurpose');

      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        handleProceed();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedOption, topicInput, selectedOpp]);

  const createOptions = [
    {
      id: 'trend-rec',
      title: 'Create from Trend.Ai Recommendation',
      description: 'Harness high-opportunity momentum signals with pre-calculated hook & audience defense.',
      icon: TrendingUp,
      badge: 'RECOMMENDED',
      keyHint: '1',
      color: 'from-indigo-600 to-violet-600'
    },
    {
      id: 'idea',
      title: 'Create from Idea / Topic',
      description: 'Enter any raw topic or phrase; VIDORA crafts full script & hook options tailored to DNA.',
      icon: Lightbulb,
      keyHint: '2',
      color: 'from-amber-600 to-orange-600'
    },
    {
      id: 'script',
      title: 'Create from Existing Script',
      description: 'Paste your draft or bullet points; AI enhances retention pacing, hooks & visual B-roll cues.',
      icon: FileText,
      keyHint: '3',
      color: 'from-emerald-600 to-teal-600'
    },
    {
      id: 'raw-footage',
      title: 'Create from Raw Footage',
      description: 'Upload studio clip; AI finds key moments, trims dead air, and aligns to script hooks.',
      icon: Video,
      badge: 'AI VISION',
      keyHint: '4',
      color: 'from-cyan-600 to-blue-600'
    },
    {
      id: 'repurpose',
      title: 'Repurpose Existing Content',
      description: 'Convert past YouTube video or podcast into high-retention TikTok, Reels & LinkedIn posts.',
      icon: Repeat,
      keyHint: '5',
      color: 'from-purple-600 to-pink-600'
    }
  ];

  const handleProceed = () => {
    if (!selectedOption) return;
    onClose();

    if (selectedOption === 'raw-footage') {
      onNavigate('editor');
    } else if (selectedOption === 'trend-rec') {
      onStartGeneration(selectedOpp ? selectedOpp.topic : topicInput, 'trend-rec', selectedOpp);
    } else {
      onStartGeneration(topicInput, selectedOption);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
        <div className="absolute inset-0 -z-10" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl glass-panel-l4 rounded-t-3xl sm:rounded-3xl border border-white/20 overflow-hidden shadow-2xl space-y-6 p-5 sm:p-8 relative max-h-[92vh] sm:max-h-none overflow-y-auto"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full glass-button text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>+ CREATE COMMAND PALETTE</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
                <Command className="w-3 h-3" /> K
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How would you like to create?</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select an entry pathway. VIDORA will inject Sarth's Creator DNA (Educational + Humorous) automatically.
            </p>
          </div>

          {/* Creation Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {createOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedOption === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative select-none ${
                    isSelected 
                      ? 'glass-panel-l3 border-indigo-400 shadow-glow-primary' 
                      : 'glass-panel-l1 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${opt.color} p-[1px] shrink-0 flex items-center justify-center`}>
                    <div className="w-full h-full bg-[#08090E] rounded-[11px] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="space-y-1 pr-6">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs font-bold text-white">{opt.title}</h3>
                      {opt.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-tight">{opt.description}</p>
                  </div>

                  {/* Number hint & Selection check */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                      {opt.keyHint}
                    </span>
                    {isSelected && (
                      <div className="text-indigo-400">
                        <CheckCircle2 className="w-4 h-4 fill-indigo-500/20" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Sub-selection depending on mode */}
          {selectedOption === 'trend-rec' && (
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  Select Top Trend Signal to Convert
                </label>
                <DemoDataBadge />
              </div>

              {/* Opportunities radio choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                {opportunities.slice(0, 4).map((opp) => (
                  <div
                    key={opp.id}
                    onClick={() => {
                      setSelectedOppId(opp.id);
                      setTopicInput(opp.topic);
                    }}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedOppId === opp.id
                        ? 'bg-indigo-600/20 border-indigo-400 text-white'
                        : 'bg-white/[0.02] border-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{opp.topic}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate max-w-[190px]">
                        {opp.category}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-300">
                      {opp.opportunityScore} Score
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedOption && selectedOption !== 'trend-rec' && selectedOption !== 'raw-footage' && (
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
              <label className="text-xs font-bold text-slate-200">Content Topic / Subject</label>
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g. AI voice cloning scams or prompt injection attack demos"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-400 font-medium"
              />
            </div>
          )}

          {/* Footer CTA */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
              Press 1-5 to switch • ⌘+Enter to execute
            </span>

            <div className="flex items-center gap-3 ml-auto">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl glass-button text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleProceed}
                disabled={!selectedOption}
                className="px-6 py-2.5 rounded-xl glass-button-primary font-bold text-xs text-white flex items-center gap-2 shadow-glow-primary disabled:opacity-40"
              >
                <span>Generate Content</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
