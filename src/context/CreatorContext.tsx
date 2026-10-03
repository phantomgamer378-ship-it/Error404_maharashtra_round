import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { CreatorProfile, Project, IdeaItem, NavigationTab, PerformanceRecord, CreatorInsight } from '../types';
import { mockCreatorProfile, mockProjects, mockIdeas } from '../data/mockData';
import { ScoredOpportunity } from '../features/opportunity-engine/types';
import { DEMO_TREND_SIGNALS } from '../features/opportunity-engine/TrendService';
import { evaluateOpportunities } from '../features/opportunity-engine/OpportunityEngine';
import { learningService, PREPARED_PERFORMANCE_RECORDS } from '../lib/services/LearningService';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface CreatorContextValue {
  creator: CreatorProfile;
  opportunities: ScoredOpportunity[];
  projects: Project[];
  ideas: IdeaItem[];
  isOnboarded: boolean;
  activeOpportunityForCreate: ScoredOpportunity | null;
  currentActiveProject: Project | null;
  
  // Phase 10: Performance & Learning Loop
  performanceRecords: PerformanceRecord[];
  learningInsights: CreatorInsight[];
  isLearningLoopRunning: boolean;
  learningLoopStep: number;
  activeToast: ToastNotification | null;
  importPerformanceData: () => Promise<void>;
  applyLearningInsight: (insightId: string) => void;
  dismissToast: () => void;
  triggerToast: (toast: Omit<ToastNotification, 'id'>) => void;
  
  // Actions
  updateCreator: (updates: Partial<CreatorProfile>) => void;
  completeOnboarding: (profile: Partial<CreatorProfile>) => void;
  resetOnboarding: () => void;
  
  // Workflow actions
  setActiveOpportunityForCreate: (opp: ScoredOpportunity | null) => void;
  createProjectFromOpportunity: (opp: ScoredOpportunity) => Project;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addIdea: (idea: IdeaItem) => void;
  updateIdeaStatus: (id: string, status: IdeaItem['status']) => void;

  // Derived metrics
  highOpportunityCount: number;
  strongestNiche: string;
  audienceInterestDelta: string;
}

const CreatorContext = createContext<CreatorContextValue | null>(null);

export function CreatorProvider({ children }: { children: React.ReactNode }) {
  const [creator, setCreator] = useState<CreatorProfile>(mockCreatorProfile);
  const [isOnboarded, setIsOnboarded] = useState(true);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [ideas, setIdeas] = useState<IdeaItem[]>(mockIdeas);
  const [activeOpportunityForCreate, setActiveOpportunityForCreate] = useState<ScoredOpportunity | null>(null);
  const [currentActiveProject, setCurrentActiveProject] = useState<Project | null>(null);

  // Phase 10: Learning Loop & Performance records
  const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>([]);
  const [learningInsights, setLearningInsights] = useState<CreatorInsight[]>([]);
  const [isLearningLoopRunning, setIsLearningLoopRunning] = useState(false);
  const [learningLoopStep, setLearningLoopStep] = useState(0);
  const [activeToast, setActiveToast] = useState<ToastNotification | null>(null);

  // Dynamically compute evaluated opportunities using OpportunityEngine and current Creator DNA
  const opportunities = useMemo(() => {
    return evaluateOpportunities(DEMO_TREND_SIGNALS, creator);
  }, [creator]);

  const updateCreator = useCallback((updates: Partial<CreatorProfile>) => {
    setCreator((prev) => ({ ...prev, ...updates }));
  }, []);

  const completeOnboarding = useCallback((profile: Partial<CreatorProfile>) => {
    setCreator((prev) => ({ ...prev, ...profile }));
    setIsOnboarded(true);
  }, []);

  const resetOnboarding = useCallback(() => {
    setIsOnboarded(false);
  }, []);

  // Opportunity to Project conversion
  const createProjectFromOpportunity = useCallback((opp: ScoredOpportunity): Project => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: `${opp.topic}: ${opp.evidence.suggestedAngle.slice(0, 45)}...`,
      niche: opp.category,
      status: 'Idea',
      updatedAt: 'Just now',
      duration: opp.evidence.format || '35s',
      thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
      hookText: opp.evidence.hook,
      scriptText: `[Angle]: ${opp.evidence.suggestedAngle}\n\n[Why Now]: ${opp.evidence.whyNow.join(' ')}\n\n[Actionable CTA]: ${opp.evidence.cta}`,
      opportunityScore: opp.opportunityScore,
      platformVariants: [
        {
          platform: 'TikTok',
          icon: 'Video',
          format: 'Vertical (9:16)',
          length: '38s',
          hook: opp.evidence.hook,
          scriptSnippet: `Emergency alert format breaking down ${opp.topic}.`,
          cta: opp.evidence.cta,
          estimatedReach: '65k - 120k'
        },
        {
          platform: 'YouTube Shorts',
          icon: 'PlaySquare',
          format: 'Vertical (9:16)',
          length: '45s',
          hook: `If you get an urgent call from family, watch this first.`,
          scriptSnippet: `Visual forensic test demonstrating audio cloning flaws.`,
          cta: 'Subscribe for weekly cybersecurity breakdowns.',
          estimatedReach: '40k - 90k'
        }
      ]
    };

    setProjects((prev) => [newProject, ...prev]);
    setCurrentActiveProject(newProject);
    setActiveOpportunityForCreate(opp);

    // Also add to Ideas page as 'In Progress'
    const newIdea: IdeaItem = {
      id: `idea-${Date.now()}`,
      topic: opp.topic,
      angle: opp.evidence.suggestedAngle,
      source: 'Trend.Ai',
      potentialScore: opp.opportunityScore,
      status: 'In Progress',
      estimatedDuration: opp.evidence.format || '35s'
    };
    setIdeas((prev) => [newIdea, ...prev]);

    return newProject;
  }, []);

  const addProject = useCallback((project: Project) => {
    setProjects((prev) => [project, ...prev]);
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const addIdea = useCallback((idea: IdeaItem) => {
    setIdeas((prev) => [idea, ...prev]);
  }, []);

  const updateIdeaStatus = useCallback((id: string, status: IdeaItem['status']) => {
    setIdeas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  }, []);

  const highOpportunityCount = useMemo(
    () => opportunities.filter((o) => o.opportunityScore >= 80).length,
    [opportunities]
  );

  const strongestNiche = useMemo(() => {
    if (creator.niche.length === 0) return 'Not set';
    return creator.niche.slice(0, 2).join(' + ');
  }, [creator.niche]);

  const audienceInterestDelta = useMemo(() => {
    const avg = opportunities.reduce((sum, o) => sum + o.trendVelocity, 0) / opportunities.length;
    const delta = Math.round((avg - 70) * 0.6);
    return delta > 0 ? `+${delta}%` : `${delta}%`;
  }, [opportunities]);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const triggerToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}`;
    setActiveToast({ ...toast, id });
    setTimeout(() => {
      setActiveToast((current) => (current?.id === id ? null : current));
    }, 5000);
  }, []);

  const importPerformanceData = useCallback(async () => {
    setIsLearningLoopRunning(true);
    setLearningLoopStep(1);

    // Step 1: Published Content synced
    await new Promise((r) => setTimeout(r, 600));

    // Step 2: Performance Recorded
    setLearningLoopStep(2);
    const records = learningService.getPreparedPerformanceDataset();
    setPerformanceRecords(records);
    await new Promise((r) => setTimeout(r, 700));

    // Step 3: Pattern Detected
    setLearningLoopStep(3);
    const insights = await learningService.deriveInsightsFromPerformance(records, creator);
    setLearningInsights(insights);
    await new Promise((r) => setTimeout(r, 700));

    // Step 4: Creator DNA Updated
    setLearningLoopStep(4);
    const primaryHookInsight = insights.find((i) => i.type === 'hook_style') || insights[0];
    let updatedProfile = creator;
    if (primaryHookInsight) {
      updatedProfile = learningService.applyInsightToCreator(primaryHookInsight, creator);
      primaryHookInsight.applied = true;
      primaryHookInsight.appliedAt = 'Just now';
    }
    const durationInsight = insights.find((i) => i.type === 'duration');
    if (durationInsight) {
      updatedProfile = learningService.applyInsightToCreator(durationInsight, updatedProfile);
      durationInsight.applied = true;
      durationInsight.appliedAt = 'Just now';
    }

    updatedProfile.importedPerformanceRecords = records;
    updatedProfile.learningInsights = insights;
    setCreator(updatedProfile);
    await new Promise((r) => setTimeout(r, 600));

    // Step 5: Recommendations Improved
    setLearningLoopStep(5);
    setIsLearningLoopRunning(false);

    // Global Toast alert
    triggerToast({
      title: '✨ Creator DNA Updated!',
      message: 'Question-based hooks (+30.4% retention) calibrated into your profile. Trend.Ai re-ranked.',
      type: 'success',
    });
  }, [creator, triggerToast]);

  const applyLearningInsight = useCallback((insightId: string) => {
    setLearningInsights((prev) => {
      const insight = prev.find((i) => i.id === insightId);
      if (!insight) return prev;

      setCreator((current) => {
        const updated = learningService.applyInsightToCreator(insight, current);
        return updated;
      });

      triggerToast({
        title: '✨ DNA Calibrated',
        message: `${insight.recommendedDnaUpdate.label} updated to "${insight.recommendedDnaUpdate.newValue}"`,
        type: 'success',
      });

      return prev.map((i) => (i.id === insightId ? { ...i, applied: true, appliedAt: 'Just now' } : i));
    });
  }, [triggerToast]);

  const value = useMemo<CreatorContextValue>(
    () => ({
      creator,
      opportunities,
      projects,
      ideas,
      isOnboarded,
      activeOpportunityForCreate,
      currentActiveProject,
      performanceRecords,
      learningInsights,
      isLearningLoopRunning,
      learningLoopStep,
      activeToast,
      importPerformanceData,
      applyLearningInsight,
      dismissToast,
      triggerToast,
      updateCreator,
      completeOnboarding,
      resetOnboarding,
      setActiveOpportunityForCreate,
      createProjectFromOpportunity,
      addProject,
      updateProject,
      addIdea,
      updateIdeaStatus,
      highOpportunityCount,
      strongestNiche,
      audienceInterestDelta,
    }),
    [
      creator,
      opportunities,
      projects,
      ideas,
      isOnboarded,
      activeOpportunityForCreate,
      currentActiveProject,
      performanceRecords,
      learningInsights,
      isLearningLoopRunning,
      learningLoopStep,
      activeToast,
      importPerformanceData,
      applyLearningInsight,
      dismissToast,
      triggerToast,
      updateCreator,
      completeOnboarding,
      resetOnboarding,
      setActiveOpportunityForCreate,
      createProjectFromOpportunity,
      addProject,
      updateProject,
      addIdea,
      updateIdeaStatus,
      highOpportunityCount,
      strongestNiche,
      audienceInterestDelta,
    ]
  );

  return (
    <CreatorContext.Provider value={value}>
      {children}
    </CreatorContext.Provider>
  );
}

export function useCreator(): CreatorContextValue {
  const ctx = useContext(CreatorContext);
  if (!ctx) throw new Error('useCreator must be used within CreatorProvider');
  return ctx;
}
