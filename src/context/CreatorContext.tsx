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

import { useAuthStore } from '../store/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

const CreatorContext = createContext<CreatorContextValue | null>(null);

export function CreatorProvider({ children }: { children: React.ReactNode }) {
  const { profile, dna, initialize } = useAuthStore();
  const creator = useMemo(() => ({ 
    ...profile, 
    ...dna, 
    name: profile?.display_name || 'Creator',
    avatar: profile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
    niche: (dna as any)?.niche || ['AI', 'Tech'],
    audience: (dna as any)?.audience || 'Founders & Engineers',
    tone: (dna as any)?.tone ? (Array.isArray((dna as any).tone) ? (dna as any).tone : [(dna as any).tone]) : ['Authoritative', 'Direct'],
    languages: (dna as any)?.languages || ['English'],
    preferredFormats: (dna as any)?.preferredFormats || ['Short-Form Video', 'Long-Form Educational'],
    hookStyle: (dna as any)?.hookStyle || 'Direct Question / Curiosity Gap',
    visualStyle: (dna as any)?.visualStyle || 'Dark Mode Minimalist + Neon Accents',
    bestTopics: (dna as any)?.bestTopics || ['Cybersecurity Threats', 'AI Tools', 'Software Engineering Tips'],
    averageDuration: (dna as any)?.averageDuration || '38s - 45s',
    performancePatterns: (dna as any)?.performancePatterns || [
      { hookType: 'Direct Warning', retentionRate: 72.4, viralProbability: 84, bestPostingTime: 'Tuesday 4PM' },
      { hookType: 'Curiosity Question', retentionRate: 68.2, viralProbability: 91, bestPostingTime: 'Thursday 11AM' }
    ]
  }) as any, [profile, dna]);
  const [isOnboarded, setIsOnboarded] = useState(true);
  
  const queryClient = useQueryClient();

  // Phase 10: Learning Loop & Performance records
  const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>([]);
  const [learningInsights, setLearningInsights] = useState<CreatorInsight[]>([]);
  const [isLearningLoopRunning, setIsLearningLoopRunning] = useState(false);
  const [learningLoopStep, setLearningLoopStep] = useState(0);
  const [activeToast, setActiveToast] = useState<ToastNotification | null>(null);

  const { data: rawOpportunities = [] } = useQuery({
    queryKey: ['opportunities'],
    queryFn: () => apiClient.opportunities.list()
  });

  const opportunities = useMemo(() => {
    return rawOpportunities.map((op: any) => {
      if (op.evidence) return op; // Already in frontend format

      return {
        ...op,
        id: op.id || `opp-${Math.random()}`,
        topic: op.topic || op.title || 'Trending Topic',
        category: op.category || 'General',
        opportunityScore: op.overall_score || 85,
        trendVelocity: op.freshness_score || 70,
        audienceFit: op.audience_fit_score || 80,
        creatorFit: op.creator_relevance_score || 75,
        competition: 'Medium',
        competitionScore: 50,
        trendDirection: op.status === 'active' ? 'Rising' : 'Stable',
        saturationLevel: 30,
        summary: op.summary || 'A high-potential opportunity based on your creator profile.',
        whyNowReasoning: [op.why_now?.summary || 'Currently trending in your niche'],
        factors: {},
        evidence: {
          platform: 'All',
          format: 'Short-Form Video',
          hook: 'Check this out...',
          cta: 'Follow for more!',
          suggestedAngle: op.summary || 'A unique perspective on the trend',
          whyNow: [op.why_now?.summary || 'Trending'],
          whyYou: [op.why_you?.summary || 'Good fit']
        },
        trajectory: [
          { date: 'Last month', interest: 40, change: '+10%', context: 'Rising' },
          { date: 'Now', interest: 80, change: '+40%', context: 'Peak' }
        ]
      } as ScoredOpportunity;
    });
  }, [rawOpportunities]);

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => apiClient.projects.list()
  });

  const { data: ideas = [] } = useQuery({
    queryKey: ['ideas'],
    queryFn: () => apiClient.ideas.list()
  });

  const [activeOpportunityForCreate, setActiveOpportunityForCreate] = useState<ScoredOpportunity | null>(null);
  const [currentActiveProject, setCurrentActiveProject] = useState<Project | null>(null);

  const updateCreatorMutation = useMutation({
    mutationFn: (updates: any) => apiClient.profile.update(updates), // Simple wrapper for hackathon
    onSuccess: () => {
      initialize();
    }
  });

  const updateCreator = useCallback((updates: Partial<CreatorProfile>) => {
    updateCreatorMutation.mutate(updates);
  }, [updateCreatorMutation]);

  const completeOnboarding = useCallback((profileUpdates: Partial<CreatorProfile>) => {
    updateCreatorMutation.mutate(profileUpdates);
    setIsOnboarded(true);
  }, [updateCreatorMutation]);

  const resetOnboarding = useCallback(() => {
    setIsOnboarded(false);
  }, []);

  const createProjectMutation = useMutation({
    mutationFn: (data: Partial<Project>) => apiClient.projects.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] })
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<Project> }) => apiClient.patch(`/projects/${id}`, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] })
  });

  const createIdeaMutation = useMutation({
    mutationFn: (data: Partial<IdeaItem>) => apiClient.ideas.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ideas'] })
  });

  const updateIdeaMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<IdeaItem> }) => apiClient.patch(`/ideas/${id}`, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ideas'] })
  });

  // Opportunity to Project conversion
  const createProjectFromOpportunity = useCallback((opp: ScoredOpportunity): Project => {
    const newProject: any = {
      title: `${opp.topic}: ${opp.evidence.suggestedAngle.slice(0, 45)}...`,
      niche: opp.category,
      status: 'Idea',
      duration: opp.evidence.format || '35s',
      thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
      hookText: opp.evidence.hook,
      scriptText: `[Angle]: ${opp.evidence.suggestedAngle}\n\n[Why Now]: ${opp.evidence.whyNow.join(' ')}\n\n[Actionable CTA]: ${opp.evidence.cta}`,
      opportunityScore: opp.opportunityScore,
    };

    createProjectMutation.mutate(newProject);
    setActiveOpportunityForCreate(opp);

    // Also add to Ideas page as 'In Progress'
    const newIdea: any = {
      topic: opp.topic,
      angle: opp.evidence.suggestedAngle,
      source: 'Trend.Ai',
      potentialScore: opp.opportunityScore,
      status: 'In Progress',
      estimatedDuration: opp.evidence.format || '35s'
    };
    createIdeaMutation.mutate(newIdea);

    return newProject as Project;
  }, [createProjectMutation, createIdeaMutation]);

  const addProject = useCallback((project: Project) => {
    createProjectMutation.mutate(project);
  }, [createProjectMutation]);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    updateProjectMutation.mutate({ id, updates });
  }, [updateProjectMutation]);

  const addIdea = useCallback((idea: IdeaItem) => {
    createIdeaMutation.mutate(idea);
  }, [createIdeaMutation]);

  const updateIdeaStatus = useCallback((id: string, status: IdeaItem['status']) => {
    updateIdeaMutation.mutate({ id, updates: { status } });
  }, [updateIdeaMutation]);

  const highOpportunityCount = useMemo(
    () => opportunities.filter((o: ScoredOpportunity) => o.opportunityScore >= 80).length,
    [opportunities]
  );

  const strongestNiche = useMemo(() => {
    if (!creator?.niche || creator.niche.length === 0) return 'Not set';
    return creator.niche.slice(0, 2).join(' + ');
  }, [creator?.niche]);

  const audienceInterestDelta = useMemo(() => {
    if (!opportunities || opportunities.length === 0) return '0%';
    const avg = opportunities.reduce((sum: number, o: ScoredOpportunity) => sum + o.trendVelocity, 0) / opportunities.length;
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
    updateCreator(updatedProfile);
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

      updateCreator(learningService.applyInsightToCreator(insight, creator));

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
