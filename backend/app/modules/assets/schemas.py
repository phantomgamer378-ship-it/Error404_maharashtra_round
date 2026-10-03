from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class AssetBase(BaseModel):
    project_id: Optional[str] = None
    filename: str
    content_type: str
    size: int
    storage_path: str
    duration: Optional[float] = None
    metadata: Dict[str, Any] = {}
    upload_status: str # pending, complete, failed
    processing_status: str # pending, processing, complete, failed

class AssetCreate(AssetBase):
    pass

class AssetResponse(AssetBase):
    id: str
    owner_id: str
    created_at: datetime

    class Config:
        orm_mode = True

class UploadRequest(BaseModel):
    filename: str
    content_type: str
    size: int
    project_id: Optional[str] = None

class UploadResponse(BaseModel):
    asset_id: str
    upload_url: str # signed URL
    storage_path: str
