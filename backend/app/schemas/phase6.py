from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from uuid import UUID
from datetime import datetime

class EditOperationRequest(BaseModel):
    expected_revision: int
    operation_type: str # TRIM, SPLIT, DELETE, CAPTION_UPDATE, CAPTION_TIMING
    payload: Dict[str, Any]

class EditDocumentResponse(BaseModel):
    id: UUID
    clip_id: UUID
    current_revision: int
    document_json: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class AIEditProposalRequest(BaseModel):
    selection: Dict[str, Any]
    instruction: str

class AIEditProposalResponse(BaseModel):
    proposal_id: str
    proposed_document_json: Dict[str, Any]
    explanation: str

class AdaptationCreate(BaseModel):
    platform: str
    target: Optional[str] = None
    content_json: Dict[str, Any]

class AdaptationResponse(AdaptationCreate):
    id: UUID
    project_id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class PerformanceRecordCreate(BaseModel):
    project_id: Optional[UUID] = None
    platform: str
    external_content_id: Optional[str] = None
    recorded_at: datetime
    views: int = 0
    likes: int = 0
    comments: int = 0
    shares: int = 0
    saves: int = 0
    source_type: str # IMPORT, MANUAL, DEMO
    raw_payload: Optional[Dict[str, Any]] = {}

class InsightResponse(BaseModel):
    id: UUID
    title: str
    summary: str
    evidence_json: Dict[str, Any]
    interpretation: str
    recommendation: Optional[str] = None
    uncertainty: str
    
    class Config:
        from_attributes = True

class LearningProposalResponse(BaseModel):
    id: UUID
    proposed_change_json: Dict[str, Any]
    reason: str
    confidence: int
    status: str
    
    class Config:
        from_attributes = True
