from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class JobBase(BaseModel):
    resource_id: str
    type: str # e.g. "asset_analysis"
    status: str # pending, running, completed, failed
    stage: str # QUEUED, UPLOADING, EXTRACTING, TRANSCRIBING, SEGMENTING, ANALYZING, DETECTING_MOMENTS, COMPLETE
    progress: int # 0-100
    attempt: int
    idempotency_key: str
    error: Optional[str] = None

class JobResponse(JobBase):
    id: str
    owner_id: str
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        orm_mode = True
