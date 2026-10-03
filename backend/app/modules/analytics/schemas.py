from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AnalyticMetricBase(BaseModel):
    project_id: str
    source: str # e.g. "manual", "instagram", "tiktok"
    views: int
    engagement: int
    is_demo: bool = False

class AnalyticMetricCreate(AnalyticMetricBase):
    pass

class AnalyticMetricResponse(AnalyticMetricBase):
    id: str
    created_at: datetime

    class Config:
        orm_mode = True

class InsightResponse(BaseModel):
    id: str
    project_id: str
    observation: str
    evidence: str
    interpretation: str
    uncertainty: str
    suggested_dna_update: Optional[str] = None
    created_at: datetime
