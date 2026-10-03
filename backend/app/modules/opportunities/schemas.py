from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class ScoreBreakdown(BaseModel):
    freshness: float
    creator_relevance: float
    audience_fit: float
    feasibility: float

class OpportunityBase(BaseModel):
    title: str
    description: str
    topic: str
    source: str
    source_url: Optional[str] = None
    category: str
    overall_score: float
    score_components: ScoreBreakdown
    explanation: str
    uncertainty: str
    is_demo_data: bool = False

class OpportunityCreate(OpportunityBase):
    pass

class OpportunityResponse(OpportunityBase):
    id: str
    detected_timestamp: datetime
    
    class Config:
        orm_mode = True
