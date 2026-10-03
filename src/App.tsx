import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useOutletContext, useNavigate } from 'react-router-dom';
import { CreatorProvider, useCreator } from './context/CreatorContext';
import { AppLayout } from './layouts/AppLayout';

// Views
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

import { mockAssets, mockAnalytics } from './data/mockData';
import { ScoredOpportunity } from './features/opportunity-engine/types';

// Page Wrappers mapping Context and Navigations
const DashboardPage = () => {
  const { creator, opportunities } = useCreator();
  const navigate = useNavigate();
  return <DashboardView creator={creator} opportunities={opportunities} onNavigate={(path) => navigate(`/app/${path}`)} onOpenCreateModal={() => {}} />;
};

const TrendsPage = () => {
  const { opportunities } = useCreator();
  const navigate = useNavigate();
  return <TrendAiView opportunities={opportunities} onNavigate={(path) => navigate(`/app/${path}`)} onStartCreateFromOpportunity={() => navigate('/app/create')} onTurnGapIntoIdea={() => {}} />;
};

const IdeasPage = () => {
  const { ideas } = useCreator();
  const navigate = useNavigate();
  return <IdeasView ideas={ideas} onNavigate={(path) => navigate(`/app/${path}`)} onOpenCreateModal={() => {}} onSelectIdeaToGenerate={() => navigate('/app/create')} />;
};

const ProjectsPage = () => {
  const { projects } = useCreator();
  const navigate = useNavigate();
  return <ProjectsView projects={projects} onNavigate={(path) => navigate(`/app/${path}`)} onOpenVideoEditor={() => navigate('/app/editor')} onOpenCreateModal={() => {}} />;
};

const CreatePage = () => {
  const { generatedTopic, currentSelectedOpportunity } = useOutletContext<{ generatedTopic: string, currentSelectedOpportunity: ScoredOpportunity | null }>();
  const navigate = useNavigate();
  return <ContentGenerationView topic={generatedTopic} opportunity={currentSelectedOpportunity} onNavigate={(path) => navigate(`/app/${path}`)} onOpenVideoEditor={() => navigate('/app/editor')} />;
};

const EditorPage = () => {
  const navigate = useNavigate();
  return <MainEditorView onNavigate={(path) => navigate(`/app/${path}`)} onOpenPlatformDrawer={() => {}} onOpenWhatIf={() => {}} />;
};

const AnalyticsPage = () => {
  const navigate = useNavigate();
  return <AnalyticsView analytics={mockAnalytics} onNavigate={(path) => navigate(`/app/${path}`)} />;
};

const DnaPage = () => {
  const { creator } = useCreator();
  const navigate = useNavigate();
  return <CreatorDnaView creator={creator} onNavigate={(path) => navigate(`/app/${path}`)} onOpenCreateModal={() => {}} />;
};

const AssetsPage = () => {
  const navigate = useNavigate();
  return <AssetLibraryView assets={mockAssets} onNavigate={(path) => navigate(`/app/${path}`)} onOpenVideoEditor={() => navigate('/app/editor')} onOpenFootageAnalysis={() => navigate('/app/footage')} />;
};

const FootagePage = () => {
  const navigate = useNavigate();
  return <RawFootageAnalysisView onNavigate={(path) => navigate(`/app/${path}`)} onOpenVideoEditor={() => navigate('/app/editor')} />;
};

// Placeholder Public Pages
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-background text-foreground">
    <header className="p-4 border-b border-border/50 font-bold text-xl">VIDORA</header>
    <main className="flex-1 flex flex-col">{children}</main>
  </div>
);

export function App() {
  return (
    <CreatorProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><div className="flex-1 flex items-center justify-center p-8"><h1 className="text-4xl font-bold">Public Landing Page</h1><a href="/login" className="ml-4 text-primary hover:underline">Login</a></div></PublicLayout>} />
          <Route path="/features" element={<PublicLayout><div>Features Placeholder</div></PublicLayout>} />
          <Route path="/how-it-works" element={<PublicLayout><div>How It Works Placeholder</div></PublicLayout>} />
          <Route path="/pricing" element={<PublicLayout><div>Pricing Placeholder</div></PublicLayout>} />

          {/* Auth Routes */}
          <Route path="/login" element={<PublicLayout><div className="flex-1 flex items-center justify-center"><a href="/app/dashboard" className="glass-button px-4 py-2">Simulate Login (Go to Dashboard)</a></div></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><div>Register Placeholder</div></PublicLayout>} />
          <Route path="/forgot-password" element={<PublicLayout><div>Forgot Password Placeholder</div></PublicLayout>} />
          <Route path="/reset-password" element={<PublicLayout><div>Reset Password Placeholder</div></PublicLayout>} />
          <Route path="/auth/callback" element={<PublicLayout><div>Auth Callback Placeholder</div></PublicLayout>} />

          {/* Onboarding */}
          <Route path="/onboarding" element={<PublicLayout><div>Onboarding Root</div></PublicLayout>} />
          <Route path="/onboarding/profile" element={<PublicLayout><div>Onboarding Profile</div></PublicLayout>} />
          <Route path="/onboarding/dna" element={<PublicLayout><div>Onboarding DNA</div></PublicLayout>} />
          <Route path="/onboarding/platforms" element={<PublicLayout><div>Onboarding Platforms</div></PublicLayout>} />
          <Route path="/onboarding/complete" element={<PublicLayout><div>Onboarding Complete</div></PublicLayout>} />

          {/* Application Routes */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="trends" element={<TrendsPage />} />
            <Route path="trends/:trendId" element={<div>Trend Detail Placeholder</div>} />
            <Route path="ideas" element={<IdeasPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/new" element={<CreatePage />} />
            <Route path="projects/:projectId" element={<div>Project Detail Placeholder</div>} />
            <Route path="projects/:projectId/script" element={<div>Project Script Placeholder</div>} />
            <Route path="projects/:projectId/footage" element={<div>Project Footage Placeholder</div>} />
            <Route path="projects/:projectId/editor/:clipId" element={<div>Project Editor Placeholder</div>} />
            <Route path="projects/:projectId/adapt" element={<div>Project Adapt Placeholder</div>} />
            <Route path="create" element={<CreatePage />} />
            <Route path="editor" element={<EditorPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="analytics/insights" element={<div>Analytics Insights Placeholder</div>} />
            <Route path="dna" element={<DnaPage />} />
            <Route path="assets" element={<AssetsPage />} />
            <Route path="footage" element={<FootagePage />} />
            <Route path="notifications" element={<div>Notifications Placeholder</div>} />
            <Route path="settings" element={<div>Settings Placeholder</div>} />
            <Route path="settings/profile" element={<div>Settings Profile Placeholder</div>} />
            <Route path="settings/security" element={<div>Settings Security Placeholder</div>} />
            <Route path="settings/preferences" element={<div>Settings Preferences Placeholder</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CreatorProvider>
  );
}

export default App;
