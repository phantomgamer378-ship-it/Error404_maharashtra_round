from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class IdeaBase(BaseModel):
    title: str
    description: str
    topic: str
    status: str # Saved, Exploring, Ready to Create, Converted to Project
    opportunity_id: Optional[str] = None

class IdeaCreate(IdeaBase):
    pass

class IdeaUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class IdeaResponse(IdeaBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
