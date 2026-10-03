from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from uuid import UUID
from datetime import datetime

class ScriptGenerateRequest(BaseModel):
    target_platform: Optional[str] = None
    desired_tone: Optional[str] = None
    length: Optional[str] = None
    creator_instruction: str

class ScriptRevisionResponse(BaseModel):
    id: UUID
    script_id: UUID
    version: int
    content: Optional[str] = None
    structured_content: Optional[Dict[str, Any]] = None
    generation_source: str
    model: str
    provider: str
    prompt_version: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ScriptResponse(BaseModel):
    id: UUID
    project_id: UUID
    current_revision_id: Optional[UUID] = None
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class HookAlternative(BaseModel):
    text: str
    rationale: str

class HooksResponse(BaseModel):
    alternatives: List[HookAlternative]
