import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useCreator } from '../context/CreatorContext';
import { NavigationTab, IdeaItem } from '../types';
import { ScoredOpportunity } from '../features/opportunity-engine/types';

import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { BottomNav } from '../components/layout/BottomNav';

import { CreateModal } from '../components/create/CreateModal';
import { AskCreatorAiModal } from '../components/common/AskCreatorAiModal';
import { PlatformAdaptationDrawer } from '../components/platform/PlatformAdaptationDrawer';
import { WhatIfVariantEngine } from '../components/platform/WhatIfVariantEngine';

const routeSegmentToTab = (segment?: string): NavigationTab => {
  if (segment === 'trends') return 'trend-ai';
  if (segment === 'dna') return 'creator-dna';
  return (segment as NavigationTab) || 'dashboard';
};

export const AppLayout: React.FC = () => {
  const { 
    creator, 
    opportunities, 
    createProjectFromOpportunity,
    activeToast,
    dismissToast,
  } = useCreator();

  const navigate = useNavigate();
  const location = useLocation();

  // Extract current tab from URL (fallback to dashboard)
  const currentTab = routeSegmentToTab(location.pathname.split('/')[2]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Modals & Drawers
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [isPlatformDrawerOpen, setIsPlatformDrawerOpen] = useState(false);
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);

  // Sub-view Active States
  const [generatedTopic, setGeneratedTopic] = useState<string>("AI Voice Scams");
  const [currentSelectedOpportunity, setCurrentSelectedOpportunity] = useState<ScoredOpportunity | null>(
    opportunities[0] || null
  );

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCreateModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleNavigate = (tab: NavigationTab) => {
    navigate(`/app/${tab}`);
  };

  const handleStartGeneration = (topic: string, optionType?: string, opp?: ScoredOpportunity) => {
    if (optionType === 'raw-footage') {
      navigate('/app/assets');
      return;
    }
    const targetOpp = opp || opportunities.find(o => o.topic.toLowerCase() === topic.toLowerCase()) || null;
    if (targetOpp) {
      createProjectFromOpportunity(targetOpp);
      setCurrentSelectedOpportunity(targetOpp);
    } else {
      setCurrentSelectedOpportunity(null);
    }
    setGeneratedTopic(topic);
    navigate('/app/create');
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col antialiased overflow-x-hidden">
      <div className="flex flex-1 relative">
        <Sidebar
          currentTab={currentTab}
          onNavigate={handleNavigate}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          creator={creator}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        } ml-0 pb-16 md:pb-0`}>
          <TopBar
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onOpenAskModal={() => setIsAskModalOpen(true)}
            creator={creator}
            isSidebarCollapsed={isSidebarCollapsed}
          />

          <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto overflow-x-hidden relative">
            <Outlet context={{ generatedTopic, currentSelectedOpportunity }} />
          </main>
        </div>
      </div>

      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        opportunities={opportunities}
        onNavigate={handleNavigate}
        onStartGeneration={handleStartGeneration}
      />
      <AskCreatorAiModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        onNavigate={handleNavigate}
      />
      <PlatformAdaptationDrawer
        isOpen={isPlatformDrawerOpen}
        onClose={() => setIsPlatformDrawerOpen(false)}
        onNavigate={handleNavigate}
      />
      <WhatIfVariantEngine
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
        onApplyVariant={(hookText, duration, tone) => {
          console.log(`Applied variant: hook="${hookText}", duration=${duration}s, tone=${tone}`);
          setIsWhatIfOpen(false);
        }}
      />

      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-16 right-6 z-50 p-4 rounded-2xl glass-panel-l4 border border-emerald-500/50 text-white shadow-2xl backdrop-blur-xl flex items-start gap-3 max-w-md"
          >
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-emerald-300 font-mono uppercase tracking-wider">
                  {activeToast.title}
                </span>
                <button
                  onClick={dismissToast}
                  className="text-slate-400 hover:text-white text-xs font-bold p-0.5"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                {activeToast.message}
              </p>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    handleNavigate('creator-dna');
                    dismissToast();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 transition-colors"
                >
                  View Creator DNA →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />
    </div>
  );
};
