from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from uuid import UUID
from datetime import datetime

class OpportunityBase(BaseModel):
    title: str
    topic: Optional[str] = None
    category: Optional[str] = None
    summary: Optional[str] = None
    source: Optional[str] = None
    source_url: Optional[str] = None
    detected_at: Optional[datetime] = None
    published_at: Optional[datetime] = None

class OpportunityResponse(OpportunityBase):
    id: UUID
    freshness_score: int
    creator_relevance_score: int
    audience_fit_score: int
    feasibility_score: int
    overall_score: int
    score_version: Optional[str] = None
    why_now: Dict[str, Any]
    why_you: Dict[str, Any]
    uncertainty: Optional[str] = None
    is_demo: int
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class IdeaBase(BaseModel):
    title: str
    description: Optional[str] = None
    notes: Optional[str] = None

class IdeaCreate(IdeaBase):
    opportunity_id: Optional[UUID] = None

class IdeaUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class IdeaResponse(IdeaBase):
    id: UUID
    user_id: UUID
    opportunity_id: Optional[UUID] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    title: str
    brief: Optional[str] = None
    target_platform: Optional[str] = None
    target_format: Optional[str] = None

class ProjectCreate(ProjectBase):
    opportunity_id: Optional[UUID] = None
    idea_id: Optional[UUID] = None

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    brief: Optional[str] = None
    status: Optional[str] = None
    stage: Optional[str] = None
    target_platform: Optional[str] = None
    target_format: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: UUID
    user_id: UUID
    opportunity_id: Optional[UUID] = None
    idea_id: Optional[UUID] = None
    status: str
    stage: str
    created_at: datetime
    updated_at: datetime
    archived_at: Optional[datetime] = None

    class Config:
        from_attributes = True
