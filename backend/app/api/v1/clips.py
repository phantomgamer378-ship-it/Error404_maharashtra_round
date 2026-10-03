from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID

from app.db.session import get_db
from app.db.models import Clip, Project, Asset, Moment
from app.schemas.phase5 import ClipCreate, ClipResponse
from app.auth.jwt import get_current_user, CurrentUser

router = APIRouter(prefix="/clips", tags=["clips"])

@router.post("/", response_model=ClipResponse)
async def create_clip(
    req: ClipCreate,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    # Verify Project
    proj = await db.execute(select(Project).where(Project.id == req.project_id, Project.user_id == user.id))
    if not proj.scalars().first():
        raise HTTPException(status_code=404, detail="Project not found")
        
    # Verify Asset
    asset = await db.execute(select(Asset).where(Asset.id == req.asset_id, Asset.user_id == user.id))
    if not asset.scalars().first():
        raise HTTPException(status_code=404, detail="Asset not found")
        
    clip = Clip(**req.model_dump())
    db.add(clip)
    await db.commit()
    await db.refresh(clip)
    
    return ClipResponse.model_validate(clip)

@router.get("/{id}", response_model=ClipResponse)
async def get_clip(
    id: UUID,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    # Enforce ownership through join with projects
    res = await db.execute(
        select(Clip)
        .join(Project, Clip.project_id == Project.id)
        .where(Clip.id == id, Project.user_id == user.id)
    )
    clip = res.scalars().first()
    if not clip:
        raise HTTPException(status_code=404, detail="Clip not found")
    return ClipResponse.model_validate(clip)
