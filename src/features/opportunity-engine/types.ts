import { ScoreBreakdown, ScoreFactors } from '../../lib/scoring/types';
import { TrajectoryPoint } from '../../types';

export type TrendState = 'Rising' | 'Stable' | 'Saturated' | 'Declining';

export interface SupportingSignal {
  id: string;
  label: string;
  source: string;
  metric: string;
  change: string;
  type: 'search' | 'social' | 'news' | 'momentum';
  confidence: number; // 0 - 100
  isDemo: boolean;
}

export interface ContentGapAnalysis {
  gapTopic: string;
  heavilyCovered: string[];
  potentialGap: string;
  audienceRelevance: 'HIGH' | 'MEDIUM' | 'LOW';
  creatorCoverage: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedApproach: string;
}

export interface RadarCoordinate {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  size: number;
  color: string;
}

export interface RawTrendSignal {
  id: string;
  topic: string;
  category: string;
  primaryNiches: string[];
  trendState: TrendState;
  rawVelocity: number;       // 0 - 100
  searchVolumeGrowth: string; // e.g. "+340% 7d"
  competitionLevel: number;  // 0 - 100
  uncertaintyScore: number;  // 0 - 100
  timingContextScore: number;// 0 - 100
  contentGapScore: number;   // 0 - 100
  suggestedPlatform: 'TikTok' | 'YouTube Shorts' | 'LinkedIn' | 'X (Twitter)' | 'Instagram';
  suggestedFormat: string;
  suggestedAngle: string;
  hookTemplate: string;
  ctaTemplate: string;
  summary: string;
  trajectory: TrajectoryPoint[];
  supportingSignals: SupportingSignal[];
  contentGap: ContentGapAnalysis;
  radarPos: RadarCoordinate;
  relatedTopicIds: string[];
  source: 'demo' | 'live';
}

export interface OpportunityEvidence {
  whyNow: string[];
  whyYou: string[];
  supportingSignals: SupportingSignal[];
  contentGap: ContentGapAnalysis;
  uncertainty: number;        // 0 - 100
  confidence: number;         // 0 - 100
  trendState: TrendState;
  suggestedAngle: string;
  platform: string;
  format: string;
  hook: string;
  cta: string;
  breakdown: ScoreBreakdown;
}

export interface ScoredOpportunity {
  id: string;
  topic: string;
  category: string;
  opportunityScore: number;   // 0 - 100 (final score)
  trendVelocity: number;      // 0 - 100
  audienceFit: number;        // 0 - 100
  creatorFit: number;         // 0 - 100
  competition: 'Low' | 'Medium' | 'High';
  competitionScore: number;   // 0 - 100
  trendDirection: TrendState;
  saturationLevel: number;    // 0 - 100
  summary: string;
  whyNowReasoning: string[];
  contentGap?: ContentGapAnalysis;
  factors: ScoreFactors;
  evidence: OpportunityEvidence;
  trajectory: TrajectoryPoint[];
  radarPos: RadarCoordinate;
  relatedTopicIds: string[];
  source: 'demo' | 'live';
  isLearnedReRank?: boolean;
  learningBoostReason?: string;
}
