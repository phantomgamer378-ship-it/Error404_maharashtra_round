import { ScoringWeights } from './weights.config';

export interface ScoreFactors {
  trendMomentum: number;      // 0 - 100
  audienceFit: number;        // 0 - 100
  creatorFit: number;         // 0 - 100
  contentGapScore: number;    // 0 - 100
  timingContextScore: number; // 0 - 100
  competitionLevel: number;   // 0 - 100 (saturation)
  uncertaintyScore: number;   // 0 - 100 (inverse of signal confidence)
}

export interface ScoreTermContribution {
  label: string;
  factorValue: number;       // raw factor 0-100
  weight: number;            // weight applied
  contribution: number;      // positive or negative points added/subtracted
  isPenalty: boolean;
  explanation: string;
}

export interface ScoreBreakdown {
  finalScore: number;         // 0 - 100 integer
  rawScore: number;           // before clamping
  confidence: number;         // 0 - 100 (100 - uncertainty)
  weights: ScoringWeights;
  terms: ScoreTermContribution[];
}
