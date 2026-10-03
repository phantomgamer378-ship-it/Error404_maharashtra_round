import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { NavigationTab, Project, IdeaItem } from './types';
import { CreatorProvider, useCreator } from './context/CreatorContext';
import { ScoredOpportunity } from './features/opportunity-engine/types';

// Component imports
import { DemoWalkthroughBar } from './components/common/DemoWalkthroughBar';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { BottomNav } from './components/layout/BottomNav';

import { DashboardView } from './components/dashboard/DashboardView';
import { TrendAiView } from './components/trend/TrendAiView';
import { CreatorDnaView } from './components/dna/CreatorDnaView';
import { ContentGenerationView } from './components/create/ContentGenerationView';
import { MainEditorView } from './components/editor/MainEditorView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { IdeasView } from './components/ideas/IdeasView';
import { AssetLibraryView } from './components/assets/AssetLibraryView';
import { ProjectsView } from './components/projects/ProjectsView';
import { RawFootageAnalysisView } from './components/footage/RawFootageAnalysisView';

// Modals & Drawers
import { CreateModal } from './components/create/CreateModal';
import { AskCreatorAiModal } from './components/common/AskCreatorAiModal';
import { PlatformAdaptationDrawer } from './components/platform/PlatformAdaptationDrawer';
import { WhatIfVariantEngine } from './components/platform/WhatIfVariantEngine';
import { mockAssets, mockAnalytics } from './data/mockData';

function MainApp() {
  const { 
    creator, 
    opportunities, 
    projects, 
    ideas, 
    createProjectFromOpportunity,
    activeToast,
    dismissToast,
  } = useCreator();

  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
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
  const [isGeneratedViewActive, setIsGeneratedViewActive] = useState(false);
  const [isFootageAnalysisActive, setIsFootageAnalysisActive] = useState(false);

  // Global Cmd+K / Ctrl+K keyboard shortcut to open + Create palette
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

  // Opportunity -> Project conversion and direct workspace opening (< 3 clicks!)
  const handleStartCreateFromOpportunity = (opp: ScoredOpportunity) => {
    createProjectFromOpportunity(opp);
    setCurrentSelectedOpportunity(opp);
    setGeneratedTopic(opp.topic);
    setIsFootageAnalysisActive(false);
    setIsGeneratedViewActive(true);
    setCurrentTab('create');
  };

  const handleStartGeneration = (topic: string, optionType?: string, opp?: ScoredOpportunity) => {
    if (optionType === 'raw-footage') {
      setIsFootageAnalysisActive(true);
      setIsGeneratedViewActive(false);
      setCurrentTab('assets');
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
    setIsFootageAnalysisActive(false);
    setIsGeneratedViewActive(true);
    setCurrentTab('create');
  };

  const handleSelectIdeaToGenerate = (idea: IdeaItem) => {
    const matchedOpp = opportunities.find(o => o.topic.toLowerCase().includes(idea.topic.toLowerCase())) || null;
    if (matchedOpp) {
      createProjectFromOpportunity(matchedOpp);
      setCurrentSelectedOpportunity(matchedOpp);
    } else {
      setCurrentSelectedOpportunity(null);
    }
    setGeneratedTopic(idea.topic);
    setIsFootageAnalysisActive(false);
    setIsGeneratedViewActive(true);
    setCurrentTab('create');
  };

  const handleTabChange = (tab: NavigationTab) => {
    setIsGeneratedViewActive(false);
    setIsFootageAnalysisActive(false);
    setCurrentTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#07080C] text-slate-100 font-sans flex flex-col antialiased overflow-x-hidden">
      {/* 1. TOP DEMO WALKTHROUGH BAR FOR HACKATHON PRESENTATION */}
      <DemoWalkthroughBar
        currentTab={currentTab}
        onNavigate={handleTabChange}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenPlatformDrawer={() => setIsPlatformDrawerOpen(true)}
        onOpenWhatIf={() => setIsWhatIfOpen(true)}
        onOpenFootageAnalyzer={() => {
          setIsFootageAnalysisActive(true);
          setCurrentTab('assets');
        }}
      />

      {/* 2. APP SHELL LAYOUT */}
      <div className="flex flex-1 relative">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onNavigate={handleTabChange}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          creator={creator}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Workspace Area */}
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        } ml-0 pb-16 md:pb-0`}>
          {/* Top Bar Navigation Header */}
          <TopBar
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onOpenAskModal={() => setIsAskModalOpen(true)}
            creator={creator}
            isSidebarCollapsed={isSidebarCollapsed}
          />

          {/* Main Content Body */}
          <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto overflow-x-hidden">
            {isFootageAnalysisActive ? (
              <div className="page-enter">
                <RawFootageAnalysisView
                  onNavigate={handleTabChange}
                  onOpenVideoEditor={() => {
                    setIsFootageAnalysisActive(false);
                    setCurrentTab('editor');
                  }}
                />
              </div>
            ) : isGeneratedViewActive ? (
              <div className="page-enter">
                <ContentGenerationView
                  topic={generatedTopic}
                  opportunity={currentSelectedOpportunity}
                  onNavigate={handleTabChange}
                  onOpenVideoEditor={() => {
                    setIsGeneratedViewActive(false);
                    setCurrentTab('editor');
                  }}
                />
              </div>
            ) : (
              <div key={currentTab} className="page-enter">
                {currentTab === 'dashboard' && (
                  <DashboardView
                    creator={creator}
                    opportunities={opportunities}
                    onNavigate={handleTabChange}
                    onOpenCreateModal={() => setIsCreateModalOpen(true)}
                  />
                )}

                {currentTab === 'trend-ai' && (
                  <TrendAiView
                    opportunities={opportunities}
                    onNavigate={handleTabChange}
                    onStartCreateFromOpportunity={handleStartCreateFromOpportunity}
                    onTurnGapIntoIdea={handleStartCreateFromOpportunity}
                  />
                )}

                {currentTab === 'creator-dna' && (
                  <CreatorDnaView
                    creator={creator}
                    onNavigate={handleTabChange}
                    onOpenCreateModal={() => setIsCreateModalOpen(true)}
                  />
                )}

                {currentTab === 'create' && (
                  <ContentGenerationView
                    topic={generatedTopic}
                    opportunity={currentSelectedOpportunity}
                    onNavigate={handleTabChange}
                    onOpenVideoEditor={() => setCurrentTab('editor')}
                  />
                )}

                {currentTab === 'editor' && (
                  <MainEditorView
                    onNavigate={handleTabChange}
                    onOpenPlatformDrawer={() => setIsPlatformDrawerOpen(true)}
                    onOpenWhatIf={() => setIsWhatIfOpen(true)}
                  />
                )}

                {currentTab === 'analytics' && (
                  <AnalyticsView
                    analytics={mockAnalytics}
                    onNavigate={handleTabChange}
                  />
                )}

                {currentTab === 'ideas' && (
                  <IdeasView
                    ideas={ideas}
                    onNavigate={handleTabChange}
                    onOpenCreateModal={() => setIsCreateModalOpen(true)}
                    onSelectIdeaToGenerate={handleSelectIdeaToGenerate}
                  />
                )}

                {currentTab === 'assets' && (
                  <AssetLibraryView
                    assets={mockAssets}
                    onNavigate={handleTabChange}
                    onOpenVideoEditor={() => setCurrentTab('editor')}
                    onOpenFootageAnalysis={() => setIsFootageAnalysisActive(true)}
                  />
                )}

                {currentTab === 'projects' && (
                  <ProjectsView
                    projects={projects}
                    onNavigate={handleTabChange}
                    onOpenVideoEditor={() => setCurrentTab('editor')}
                    onOpenCreateModal={() => setIsCreateModalOpen(true)}
                  />
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* 3. GLOBAL MODALS & DRAWERS */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        opportunities={opportunities}
        onNavigate={handleTabChange}
        onStartGeneration={handleStartGeneration}
      />

      <AskCreatorAiModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        onNavigate={handleTabChange}
      />

      <PlatformAdaptationDrawer
        isOpen={isPlatformDrawerOpen}
        onClose={() => setIsPlatformDrawerOpen(false)}
        onNavigate={handleTabChange}
      />

      <WhatIfVariantEngine
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
        onApplyVariant={(hookText, duration, tone) => {
          console.log(`Applied variant: hook="${hookText}", duration=${duration}s, tone=${tone}`);
          // The hook will be applied through the editor's operation pipeline
          setIsWhatIfOpen(false);
        }}
      />

      {/* 4. GLOBAL TOAST NOTIFICATION FOR LEARNING LOOP & CALIBRATIONS */}
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
                  title="Dismiss notification"
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
                    handleTabChange('creator-dna');
                    dismissToast();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 transition-colors"
                >
                  View Creator DNA →
                </button>
                <button
                  onClick={() => {
                    handleTabChange('trend-ai');
                    dismissToast();
                  }}
                  className="px-2.5 py-1 rounded-lg glass-button text-slate-300 hover:text-white text-[11px] font-semibold transition-colors"
                >
                  See Re-Ranked Trends →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. MOBILE BOTTOM NAVIGATION */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={handleTabChange}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />
    </div>
  );
}

export function App() {
  return (
    <CreatorProvider>
      <MainApp />
    </CreatorProvider>
  );
}

export default App;
