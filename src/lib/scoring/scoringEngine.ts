import { DEFAULT_SCORING_WEIGHTS, ScoringWeights } from './weights.config';
import { ScoreFactors, ScoreBreakdown, ScoreTermContribution } from './types';

/**
 * Interpretable Weighted Opportunity Scoring Engine.
 * 
 * Computes:
 * Opportunity = (w_m * Momentum) + (w_a * AudienceFit) + (w_c * CreatorFit)
 *              + (w_g * ContentGap) + (w_t * TimingContext)
 *              - (w_p * CompetitionPenalty) - (w_u * UncertaintyPenalty)
 * 
 * Every term has a visible contribution and human-readable explanation.
 */
export function calculateOpportunityScore(
  factors: ScoreFactors,
  customWeights?: Partial<ScoringWeights>
): ScoreBreakdown {
  const w: ScoringWeights = {
    ...DEFAULT_SCORING_WEIGHTS,
    ...customWeights,
  };

  const momentumContribution = +(factors.trendMomentum * w.trendMomentum).toFixed(1);
  const audienceContribution = +(factors.audienceFit * w.audienceFit).toFixed(1);
  const creatorContribution = +(factors.creatorFit * w.creatorFit).toFixed(1);
  const gapContribution = +(factors.contentGapScore * w.contentGap).toFixed(1);
  const timingContribution = +(factors.timingContextScore * w.timingContext).toFixed(1);
  
  const competitionDeduction = +(factors.competitionLevel * w.competitionPenalty).toFixed(1);
  const uncertaintyDeduction = +(factors.uncertaintyScore * w.uncertaintyPenalty).toFixed(1);

  const rawScore = +(
    momentumContribution +
    audienceContribution +
    creatorContribution +
    gapContribution +
    timingContribution -
    competitionDeduction -
    uncertaintyDeduction
  ).toFixed(1);

  const finalScore = Math.max(0, Math.min(100, Math.round(rawScore)));
  const confidence = Math.max(0, Math.min(100, Math.round(100 - factors.uncertaintyScore)));

  const terms: ScoreTermContribution[] = [
    {
      label: 'Trend Momentum',
      factorValue: factors.trendMomentum,
      weight: w.trendMomentum,
      contribution: momentumContribution,
      isPenalty: false,
      explanation: `Topic velocity & search trajectory contributing +${momentumContribution} pts (${Math.round(w.trendMomentum * 100)}% weight).`,
    },
    {
      label: 'Audience Fit',
      factorValue: factors.audienceFit,
      weight: w.audienceFit,
      contribution: audienceContribution,
      isPenalty: false,
      explanation: `Match with demographic affinity & historical watch time: +${audienceContribution} pts.`,
    },
    {
      label: 'Creator Fit (DNA)',
      factorValue: factors.creatorFit,
      weight: w.creatorFit,
      contribution: creatorContribution,
      isPenalty: false,
      explanation: `Alignment with creator niche, past retention hooks & tone: +${creatorContribution} pts.`,
    },
    {
      label: 'Content Gap Advantage',
      factorValue: factors.contentGapScore,
      weight: w.contentGap,
      contribution: gapContribution,
      isPenalty: false,
      explanation: `Underserved angle with high viewer curiosity: +${gapContribution} pts.`,
    },
    {
      label: 'Timing & Context',
      factorValue: factors.timingContextScore,
      weight: w.timingContext,
      contribution: timingContribution,
      isPenalty: false,
      explanation: `Recent real-world news hooks & event catalysts: +${timingContribution} pts.`,
    },
    {
      label: 'Competition Saturation',
      factorValue: factors.competitionLevel,
      weight: w.competitionPenalty,
      contribution: -competitionDeduction,
      isPenalty: true,
      explanation: `Deduction for existing creator market saturation: -${competitionDeduction} pts.`,
    },
    {
      label: 'Signal Uncertainty',
      factorValue: factors.uncertaintyScore,
      weight: w.uncertaintyPenalty,
      contribution: -uncertaintyDeduction,
      isPenalty: true,
      explanation: `Conservative penalty for nascent or volatile data signals: -${uncertaintyDeduction} pts.`,
    },
  ];

  return {
    finalScore,
    rawScore,
    confidence,
    weights: w,
    terms,
  };
}
