/**
 * Scoring weights configuration for the Opportunity Engine.
 * Single source of truth for all scoring formulas.
 * 
 * Formula:
 * Opportunity Score = 
 *   (w_momentum * TrendMomentum) +
 *   (w_audience * AudienceFit) +
 *   (w_creator * CreatorFit) +
 *   (w_gap * ContentGapScore) +
 *   (w_timing * TimingContextScore)
 *   - (w_competition * CompetitionSaturationPenalty)
 *   - (w_uncertainty * UncertaintyPenalty)
 * 
 * Clamped strictly to [0, 100].
 */

export interface ScoringWeights {
  trendMomentum: number;       // default: 0.28
  audienceFit: number;         // default: 0.24
  creatorFit: number;          // default: 0.24
  contentGap: number;          // default: 0.14
  timingContext: number;       // default: 0.10
  competitionPenalty: number;  // default: 0.12
  uncertaintyPenalty: number;  // default: 0.08
}

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  trendMomentum: 0.28,
  audienceFit: 0.24,
  creatorFit: 0.24,
  contentGap: 0.14,
  timingContext: 0.10,
  competitionPenalty: 0.12,
  uncertaintyPenalty: 0.08,
};
