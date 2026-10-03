from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from uuid import UUID
from datetime import datetime

class UploadUrlRequest(BaseModel):
    filename: str
    mime_type: str
    size_bytes: int
    project_id: Optional[UUID] = None

class UploadUrlResponse(BaseModel):
    asset_id: UUID
    storage_path: str
    signed_url: str
    
class AssetConfirmRequest(BaseModel):
    # Usually empty, just triggers the confirmation check
    pass

class AssetResponse(BaseModel):
    id: UUID
    user_id: UUID
    project_id: Optional[UUID] = None
    filename: str
    mime_type: str
    upload_status: str
    processing_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class JobResponse(BaseModel):
    id: UUID
    job_type: str
    status: str
    stage: Optional[str] = None
    progress: int
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ClipCreate(BaseModel):
    asset_id: UUID
    project_id: UUID
    moment_id: Optional[UUID] = None
    source_start_ms: int
    source_end_ms: int
    name: Optional[str] = None

class ClipResponse(ClipCreate):
    id: UUID
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
