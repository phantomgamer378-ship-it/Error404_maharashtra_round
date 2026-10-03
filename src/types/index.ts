export type NavigationTab = 
  | 'dashboard'
  | 'trend-ai'
  | 'ideas'
  | 'create'
  | 'editor'
  | 'projects'
  | 'assets'
  | 'analytics'
  | 'creator-dna';

export interface PerformanceRecord {
  id: string;
  projectId: string;
  title: string;
  platform: 'Instagram' | 'YouTube Shorts' | 'LinkedIn' | 'TikTok' | 'X (Twitter)';
  hookText: string;
  hookStyle: 'Question' | 'Contrarian' | 'Direct Warning' | 'Storytelling';
  durationSeconds: number;
  publishedAt: string;
  views: number;
  watchTimeHours: number;
  avgRetention: number; // percentage, e.g. 78.4
  engagementRate: number; // percentage, e.g. 9.2
  shares: number;
  saves: number;
  ctr: number; // percentage, e.g. 11.5
  retentionCurve: { second: number; percentage: number }[];
  source: 'demo' | 'live';
}

export interface CreatorInsight {
  id: string;
  type: 'hook_style' | 'duration' | 'tone' | 'topic_affinity';
  statement: string;
  explanation: string;
  supportingMetrics: { label: string; value: string; benchmark: string; delta: string }[];
  confidence: number; // 0 - 100
  sampleSize: number;
  recommendedDnaUpdate: {
    field: string;
    label: string;
    oldValue: string;
    newValue: string;
    impactDescription: string;
  };
  applied: boolean;
  appliedAt?: string;
}

export interface CreatorProfile {
  name: string;
  avatar: string;
  niche: string[];
  audience: string;
  tone: string[];
  languages: string[];
  preferredFormats: string[];
  hookStyle: string;
  visualStyle: string;
  bestTopics: string[];
  averageDuration: string;
  performancePatterns: {
    hookType: string;
    retentionRate: number;
    viralProbability: number;
    bestPostingTime: string;
  }[];
  lastLearningUpdate?: {
    timestamp: string;
    summary: string;
    appliedInsights: string[];
    learnedHookStyle: string;
    learnedDuration: string;
  };
  importedPerformanceRecords?: PerformanceRecord[];
  learningInsights?: CreatorInsight[];
}

export interface TrajectoryPoint {
  date: string;
  interest: number;
  change: string;
  context: string;
}

export interface TrendOpportunity {
  id: string;
  topic: string;
  category: string;
  opportunityScore: number; // 0 - 100
  trendVelocity: number; // 0 - 100
  audienceFit: number; // 0 - 100
  creatorFit: number; // 0 - 100
  competition: 'Low' | 'Medium' | 'High';
  trendDirection: 'Rising' | 'Stable' | 'Saturated' | 'Declining';
  saturationLevel: number; // 0 - 100
  summary: string;
  whyNowReasoning: string[];
  trajectory: TrajectoryPoint[];
  contentGap?: {
    gapTopic: string;
    heavilyCovered: string[];
    potentialGap: string;
    audienceRelevance: 'HIGH' | 'MEDIUM' | 'LOW';
    creatorCoverage: 'HIGH' | 'MEDIUM' | 'LOW';
  };
}

export interface KeyMoment {
  id: string;
  timestamp: string; // e.g. "00:03:12"
  seconds: number;
  duration: string;
  topic: string;
  reason: string;
  potentialScore: number;
  previewThumbnail: string;
  hookSuggestion: string;
}

export interface PlatformVariant {
  platform: 'Instagram' | 'YouTube Shorts' | 'LinkedIn' | 'X (Twitter)' | 'TikTok';
  icon: string;
  format: string;
  length: string;
  hook: string;
  scriptSnippet: string;
  cta: string;
  estimatedReach: string;
}

export interface ContentVariant {
  id: string;
  name: string;
  duration: string;
  tone: string;
  hook: string;
  curiosityScore: number;
  audienceFitScore: number;
  creatorFitScore: number;
  estimatedOpportunityScore: number;
  previewUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  niche: string;
  status: 'Idea' | 'Draft' | 'Editing' | 'Ready' | 'Published';
  updatedAt: string;
  duration: string;
  thumbnail: string;
  hookText: string;
  scriptText: string;
  opportunityScore: number;
  keyMoments?: KeyMoment[];
  platformVariants?: PlatformVariant[];
  contentVariants?: ContentVariant[];
}

export interface Asset {
  id: string;
  title: string;
  type: 'Video' | 'Audio' | 'Script' | 'Image' | 'Project' | 'Published' | 'Generated';
  duration?: string;
  size?: string;
  tags: string[];
  thumbnail: string;
  dateAdded: string;
  aiDescription: string;
  collection?: string;
  transcriptSnippet?: string;
  sourceDerivedFrom?: {
    parentTitle: string;
    timestampRange: string;
    parentId: string;
  };
}

export interface AnalyticsData {
  totalViews: string;
  viewsGrowth: string;
  watchTime: string;
  avgRetention: string;
  engagementRate: string;
  topPerformingTopic: string;
  insights: {
    title: string;
    description: string;
    impact: 'High' | 'Medium' | 'Positive';
    action: string;
  }[];
  retentionCurve: { timestamp: string; retention: number }[];
  platformDistribution: { platform: string; percentage: number }[];
}

export interface IdeaItem {
  id: string;
  topic: string;
  angle: string;
  source: 'Trend.Ai' | 'Audience Request' | 'Content Gap' | 'Manual';
  potentialScore: number;
  status: 'Idea' | 'Planned' | 'In Progress' | 'Ready' | 'Published';
  estimatedDuration: string;
}
