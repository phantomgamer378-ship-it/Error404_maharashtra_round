from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID

class ProfileBase(BaseModel):
    display_name: Optional[str] = None
    bio: Optional[str] = None
    onboarding_completed: int = 0
    onboarding_step: str = "profile"

class ProfileCreate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: UUID
    user_id: UUID
    
    class Config:
        from_attributes = True

class CreatorDNABase(BaseModel):
    niche: List[str] = []
    audience: Optional[str] = None
    tone: Optional[str] = None
    topics: List[str] = []
    platforms: List[str] = []
    goals: List[str] = []
    explicit_preferences: Dict[str, Any] = {}

class CreatorDNACreate(CreatorDNABase):
    pass

class CreatorDNAResponse(CreatorDNABase):
    id: UUID
    user_id: UUID
    version: int
    learned_preferences: Dict[str, Any] = {}

    class Config:
        from_attributes = True

class MeResponse(BaseModel):
    user: Dict[str, str]
    profile: Optional[ProfileResponse] = None
    creator_dna: Optional[CreatorDNAResponse] = None
