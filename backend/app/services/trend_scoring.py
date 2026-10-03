from app.db.models import Opportunity, CreatorDNA
from typing import Dict, Any

class TrendScoringService:
    def __init__(self, weights: Dict[str, float] = None):
        self.weights = weights or {
            "freshness": 0.30,
            "relevance": 0.30,
            "audience_fit": 0.25,
            "feasibility": 0.15
        }
        self.version = "trend-v1"

    def score_opportunity(self, opportunity: Opportunity, creator_dna: CreatorDNA) -> Opportunity:
        # Deterministic scoring based on simulated matching
        
        # Freshness (based on published_at vs detected_at)
        freshness = 85 # Simulated

        # Relevance (based on creator_dna.niche and topics)
        relevance = 75
        if opportunity.topic in creator_dna.topics:
            relevance = 95
            
        # Audience Fit (based on creator_dna.audience)
        audience_fit = 80
        
        # Feasibility (simulated difficulty)
        feasibility = 90
        
        overall = int(
            (freshness * self.weights["freshness"]) +
            (relevance * self.weights["relevance"]) +
            (audience_fit * self.weights["audience_fit"]) +
            (feasibility * self.weights["feasibility"])
        )
        
        opportunity.freshness_score = freshness
        opportunity.creator_relevance_score = relevance
        opportunity.audience_fit_score = audience_fit
        opportunity.feasibility_score = feasibility
        opportunity.overall_score = overall
        opportunity.score_version = self.version
        
        # Generate Why Now
        opportunity.why_now = {
            "summary": "This topic is accelerating right now.",
            "evidence": ["High search volume", "Recent news"],
            "freshness": freshness / 100.0
        }
        
        # Generate Why You
        opportunity.why_you = {
            "summary": "Your audience matches this trend.",
            "matched_niche": creator_dna.niche,
            "matched_audience": creator_dna.audience,
            "relevance": relevance / 100.0
        }
        
        opportunity.uncertainty = "Audience response cannot be determined from available data."
        return opportunity
