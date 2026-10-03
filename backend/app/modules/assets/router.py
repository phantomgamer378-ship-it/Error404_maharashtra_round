from fastapi import APIRouter, HTTPException
from typing import List
import uuid
from datetime import datetime, timezone
from .schemas import AssetResponse, UploadRequest, UploadResponse

router = APIRouter(prefix="/assets", tags=["assets"])

mock_assets = {}

@router.post("/request-upload", response_model=UploadResponse)
def request_upload(req: UploadRequest):
    asset_id = str(uuid.uuid4())
    storage_path = f"projects/{req.project_id}/{asset_id}_{req.filename}" if req.project_id else f"general/{asset_id}_{req.filename}"
    
    # In reality, this contacts Supabase to get a signed URL for direct upload
    upload_url = f"https://mock-supabase.co/storage/v1/object/sign/{storage_path}"
    
    new_asset = {
        "id": asset_id,
        "owner_id": "mock_user",
        "project_id": req.project_id,
        "filename": req.filename,
        "content_type": req.content_type,
        "size": req.size,
        "storage_path": storage_path,
        "upload_status": "pending",
        "processing_status": "pending",
        "metadata": {},
        "created_at": datetime.now(timezone.utc)
    }
    mock_assets[asset_id] = new_asset
    
    return UploadResponse(
        asset_id=asset_id,
        upload_url=upload_url,
        storage_path=storage_path
    )

@router.post("/{asset_id}/confirm-upload")
def confirm_upload(asset_id: str):
    if asset_id not in mock_assets:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    mock_assets[asset_id]["upload_status"] = "complete"
    # Here we would typically spawn the analysis job
    return {"status": "success", "asset_id": asset_id}

@router.get("/project/{project_id}", response_model=List[AssetResponse])
def get_project_assets(project_id: str):
    return [a for a in mock_assets.values() if a["project_id"] == project_id]
