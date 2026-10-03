from fastapi import APIRouter, HTTPException, Depends
from typing import List
from .schemas import OpportunityResponse
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/opportunities", tags=["opportunities"])

# Mock data for Phase 3 since we don't have Supabase tables live yet
mock_opportunities = [
    {
        "id": str(uuid.uuid4()),
        "title": "AI Voice Scams on the Rise",
        "description": "Expose the latest AI voice cloning scams.",
        "topic": "Cybersecurity",
        "source": "Trend.AI Engine",
        "source_url": "https://example.com/trend",
        "category": "Education",
        "overall_score": 92.5,
        "score_components": {
            "freshness": 95.0,
            "creator_relevance": 90.0,
            "audience_fit": 92.0,
            "feasibility": 93.0
        },
        "explanation": "High engagement on tech channels regarding recent AI security breaches.",
        "uncertainty": "Medium",
        "is_demo_data": True,
        "detected_timestamp": datetime.now(timezone.utc)
    }
]

@router.get("/", response_model=List[OpportunityResponse])
def get_opportunities():
    """Retrieve all current opportunities"""
    return mock_opportunities

@router.get("/{opportunity_id}", response_model=OpportunityResponse)
def get_opportunity(opportunity_id: str):
    """Retrieve a single opportunity by ID"""
    for opp in mock_opportunities:
        if opp["id"] == opportunity_id:
            return opp
    raise HTTPException(status_code=404, detail="Opportunity not found")
