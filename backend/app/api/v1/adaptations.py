from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from typing import List

from app.db.session import get_db
from app.db.models import Adaptation, Project
from app.schemas.phase6 import AdaptationCreate, AdaptationResponse
from app.auth.jwt import get_current_user, CurrentUser

router = APIRouter(prefix="/projects", tags=["adaptations"])

@router.get("/{project_id}/adaptations", response_model=List[AdaptationResponse])
async def get_adaptations(
    project_id: UUID,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    # Verify project
    proj = await db.execute(select(Project).where(Project.id == project_id, Project.user_id == user.id))
    if not proj.scalars().first():
        raise HTTPException(status_code=404, detail="Project not found")
        
    res = await db.execute(select(Adaptation).where(Adaptation.project_id == project_id))
    return [AdaptationResponse.model_validate(a) for a in res.scalars().all()]

@router.post("/{project_id}/adaptations", response_model=AdaptationResponse)
async def create_adaptation(
    project_id: UUID,
    req: AdaptationCreate,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    proj = await db.execute(select(Project).where(Project.id == project_id, Project.user_id == user.id))
    if not proj.scalars().first():
        raise HTTPException(status_code=404, detail="Project not found")
        
    adp = Adaptation(
        project_id=project_id,
        platform=req.platform,
        target=req.target,
        content_json=req.content_json
    )
    db.add(adp)
    await db.commit()
    await db.refresh(adp)
    
    return AdaptationResponse.model_validate(adp)
