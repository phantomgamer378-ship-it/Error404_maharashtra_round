from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID

from app.db.session import get_db
from app.db.models import AnalysisJob
from app.schemas.phase5 import JobResponse
from app.auth.jwt import get_current_user, CurrentUser

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.get("/{id}", response_model=JobResponse)
async def get_job(
    id: UUID,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(AnalysisJob).where(AnalysisJob.id == id, AnalysisJob.user_id == user.id))
    job = res.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return JobResponse.model_validate(job)
