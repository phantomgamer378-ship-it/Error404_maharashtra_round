import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  CheckCircle2, 
  X, 
  TrendingUp, 
  Dna, 
  Video, 
  BarChart3, 
  Zap,
  Sliders,
  Layers
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface DemoWalkthroughBarProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  onOpenCreateModal: () => void;
  onOpenFootageAnalyzer?: () => void;
  onOpenPlatformDrawer?: () => void;
  onOpenWhatIf?: () => void;
}

export const DemoWalkthroughBar: React.FC<DemoWalkthroughBarProps> = ({
  currentTab,
  onNavigate,
  onOpenCreateModal,
  onOpenFootageAnalyzer,
  onOpenPlatformDrawer,
  onOpenWhatIf,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const demoSteps = [
    {
      id: 1,
      title: "1. Dashboard & Signal",
      description: "Good evening Sarth. View Today's Creator Signal & top opportunity cards.",
      tab: 'dashboard' as NavigationTab,
      actionLabel: "View Dashboard"
    },
    {
      id: 2,
      title: "2. Trend.Ai Radar",
      description: "Explore AI topic node network, trend velocity & saturation radar.",
      tab: 'trend-ai' as NavigationTab,
      actionLabel: "Open Trend.Ai"
    },
    {
      id: 3,
      title: "3. Opportunity & Why Now",
      description: "Inspect AI Voice Scams Opportunity card (Score: 89) and expand Why Now reasoning.",
      tab: 'trend-ai' as NavigationTab,
      actionLabel: "Inspect Opportunity"
    },
    {
      id: 4,
      title: "4. Content Gap Finder",
      description: "Locate un-tapped market gap: AI + College Campus Emergency Scams.",
      tab: 'trend-ai' as NavigationTab,
      actionLabel: "View Content Gaps"
    },
    {
      id: 5,
      title: "5. Creator DNA Profile",
      description: "See how the AI understands Sarth's niche, tone, hook style & confidence metrics.",
      tab: 'creator-dna' as NavigationTab,
      actionLabel: "View Creator DNA"
    },
    {
      id: 6,
      title: "6. Create Workflow",
      description: "Launch + Create modal to generate hooks & script from Trend.Ai recommendation.",
      tab: 'dashboard' as NavigationTab,
      specialAction: 'create_modal',
      actionLabel: "Launch + Create"
    },
    {
      id: 7,
      title: "7. Raw Footage Intelligence",
      description: "Whisper AI & semantic chunking: extract high-retention 9:16 clips from 44m master footage.",
      tab: 'assets' as NavigationTab,
      specialAction: 'footage_analyzer',
      actionLabel: "Analyze Footage"
    },
    {
      id: 8,
      title: "8. Main Creator Editor",
      description: "Flagship video studio: Canvas player, multi-track timeline, AI copilot inspector.",
      tab: 'editor' as NavigationTab,
      actionLabel: "Open Video Editor"
    },
    {
      id: 9,
      title: "9. Contextual AI Toolbar",
      description: "Select hook element to trigger contextual floating toolbar (✨ Improve, 🔥 Engage).",
      tab: 'editor' as NavigationTab,
      actionLabel: "Test AI Element Edit"
    },
    {
      id: 10,
      title: "10. Platform Adaptation",
      description: "Adapt video into Instagram Reel, YouTube Short, LinkedIn Post & X Thread.",
      tab: 'editor' as NavigationTab,
      specialAction: 'platform_drawer',
      actionLabel: "View Platform Adapt"
    },
    {
      id: 11,
      title: "11. What-If Variant Engine",
      description: "Explore 3 A/B/C Hook alternatives side-by-side with estimated signal indicators.",
      tab: 'editor' as NavigationTab,
      specialAction: 'what_if_modal',
      actionLabel: "Explore What-If"
    },
    {
      id: 12,
      title: "12. Performance & Learning Loop",
      description: "Click 'Import Performance Data' to run the 5-stage loop and calibrate Creator DNA.",
      tab: 'analytics' as NavigationTab,
      actionLabel: "View Analytics & Loop"
    },
    {
      id: 13,
      title: "13. Re-Ranked Trend.Ai (Closed Loop)",
      description: "Return to Trend.Ai to see re-ranked opportunities with '⚡ Updated from your latest performance' badges.",
      tab: 'trend-ai' as NavigationTab,
      actionLabel: "View Re-Ranked Radar"
    }
  ];

  const currentStep = demoSteps[currentStepIndex];

  const triggerStepAction = (step: typeof demoSteps[0]) => {
    onNavigate(step.tab);
    if (step.specialAction === 'create_modal') {
      onOpenCreateModal();
    } else if (step.specialAction === 'footage_analyzer' && onOpenFootageAnalyzer) {
      onOpenFootageAnalyzer();
    } else if (step.specialAction === 'platform_drawer' && onOpenPlatformDrawer) {
      onOpenPlatformDrawer();
    } else if (step.specialAction === 'what_if_modal' && onOpenWhatIf) {
      onOpenWhatIf();
    }
  };

  const handleNext = () => {
    if (currentStepIndex < demoSteps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      triggerStepAction(demoSteps[nextIdx]);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      triggerStepAction(demoSteps[prevIdx]);
    }
  };

  const handleSelectStep = (idx: number) => {
    setCurrentStepIndex(idx);
    triggerStepAction(demoSteps[idx]);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-4 right-4 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full glass-panel-l3 border border-indigo-500/40 text-indigo-300 text-xs font-semibold shadow-glow-primary hover:bg-indigo-600/20 transition-all"
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
        <span>Demo ({currentStepIndex + 1}/{demoSteps.length})</span>
      </button>
    );
  }

  return (
    <div className="bg-slate-950/90 border-b border-indigo-500/20 text-slate-200 text-xs px-3 md:px-4 py-2 flex items-center justify-between shadow-lg backdrop-blur-md relative z-40 gap-2">
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-semibold text-[11px] shrink-0">
          <Zap className="w-3 h-3 text-indigo-400" />
          <span>DEMO TOUR</span>
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-semibold text-white shrink-0">{currentStep.title}:</span>
          <span className="text-slate-300 hidden md:inline truncate">{currentStep.description}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Step dots */}
        <div className="hidden lg:flex items-center gap-1">
          {demoSteps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => handleSelectStep(idx)}
              title={step.title}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentStepIndex 
                  ? 'w-5 bg-indigo-400 shadow-glow-primary' 
                  : idx < currentStepIndex 
                  ? 'bg-emerald-400/80' 
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300"
            title="Previous Demo Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-[11px] text-slate-400 px-1">
            {currentStepIndex + 1}/{demoSteps.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentStepIndex === demoSteps.length - 1}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-sm transition-all disabled:opacity-40"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-400 hover:text-white ml-2"
            title="Hide Demo Bar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
