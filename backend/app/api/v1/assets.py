from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
import uuid

from app.db.session import get_db
from app.db.models import Asset, AnalysisJob, Project
from app.schemas.phase5 import UploadUrlRequest, UploadUrlResponse, AssetResponse, AssetConfirmRequest
from app.auth.jwt import get_current_user, CurrentUser

router = APIRouter(prefix="/assets", tags=["assets"])

@router.post("/upload-url", response_model=UploadUrlResponse)
async def request_upload_url(
    req: UploadUrlRequest,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    if req.project_id:
        proj_res = await db.execute(select(Project).where(Project.id == req.project_id, Project.user_id == user.id))
        if not proj_res.scalars().first():
            raise HTTPException(status_code=404, detail="Project not found")
            
    asset_id = uuid.uuid4()
    storage_path = f"users/{user.id}/assets/{asset_id}/{req.filename}"
    
    asset = Asset(
        id=asset_id,
        user_id=user.id,
        project_id=req.project_id,
        storage_path=storage_path,
        filename=req.filename,
        mime_type=req.mime_type,
        size_bytes=req.size_bytes,
        upload_status="pending"
    )
    db.add(asset)
    await db.commit()
    
    # In a real environment, we'd generate a Supabase signed upload URL here using the service key
    # For now, we return a mock signed URL that the frontend will pretend to use.
    signed_url = f"https://mock-storage.supabase.co/storage/v1/object/upload/sign/{storage_path}?token=mock-token"
    
    return UploadUrlResponse(
        asset_id=asset_id,
        storage_path=storage_path,
        signed_url=signed_url
    )

@router.post("/{asset_id}/confirm", response_model=AssetResponse, status_code=status.HTTP_202_ACCEPTED)
async def confirm_upload(
    asset_id: UUID,
    req: AssetConfirmRequest,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Asset).where(Asset.id == asset_id, Asset.user_id == user.id))
    asset = res.scalars().first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
        
    if asset.upload_status == "uploaded":
        return AssetResponse.model_validate(asset)
        
    # Mark asset as uploaded
    asset.upload_status = "uploaded"
    asset.processing_status = "queued"
    await db.commit()
    await db.refresh(asset)
    
    # Create Analysis Job (Idempotent by asset_id)
    job_res = await db.execute(select(AnalysisJob).where(AnalysisJob.resource_id == asset.id))
    job = job_res.scalars().first()
    if not job:
        job = AnalysisJob(
            user_id=user.id,
            resource_type="asset",
            resource_id=asset.id,
            job_type="MEDIA_ANALYSIS",
            status="queued",
            idempotency_key=f"analysis_{asset.id}"
        )
        db.add(job)
        await db.commit()
        
        # We would dispatch to Celery here
        # MediaJobOrchestrator.dispatch_analysis_job(job.id)
        
    return AssetResponse.model_validate(asset)

@router.get("/{asset_id}", response_model=AssetResponse)
async def get_asset(
    asset_id: UUID,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Asset).where(Asset.id == asset_id, Asset.user_id == user.id))
    asset = res.scalars().first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return AssetResponse.model_validate(asset)
