from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProjectBase(BaseModel):
    title: str
    brief: Optional[str] = None
    origin: str # 'opportunity', 'idea', 'scratch'
    target_platform: Optional[str] = None
    format: Optional[str] = None
    stage: str # 'planning', 'scripting', 'editing', 'review', 'published'
    status: str # 'active', 'archived'
    associated_opportunity_id: Optional[str] = None
    associated_idea_id: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    brief: Optional[str] = None
    stage: Optional[str] = None
    status: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
