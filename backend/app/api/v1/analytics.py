from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from typing import List

from app.db.session import get_db
from app.db.models import PerformanceRecord, Insight, LearningProposal, CreatorDNA
from app.schemas.phase6 import PerformanceRecordCreate, InsightResponse, LearningProposalResponse
from app.auth.jwt import get_current_user, CurrentUser

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.post("/performance", status_code=status.HTTP_201_CREATED)
async def import_performance_record(
    req: PerformanceRecordCreate,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    # In a full app, we would verify project ownership if project_id is present
    
    # Calculate Engagement Rate (views / engagements) * 100 for integer storage
    engagements = req.likes + req.comments + req.shares + req.saves
    er = int((engagements / req.views) * 10000) if req.views > 0 else 0
    
    rec = PerformanceRecord(
        user_id=user.id,
        project_id=req.project_id,
        platform=req.platform,
        external_content_id=req.external_content_id,
        recorded_at=req.recorded_at,
        views=req.views,
        likes=req.likes,
        comments=req.comments,
        shares=req.shares,
        saves=req.saves,
        engagement_rate=er,
        source_type=req.source_type,
        raw_payload=req.raw_payload
    )
    db.add(rec)
    await db.commit()
    return {"status": "imported"}

@router.get("/insights", response_model=List[InsightResponse])
async def get_insights(
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Insight).where(Insight.user_id == user.id))
    return [InsightResponse.model_validate(i) for i in res.scalars().all()]

@router.get("/learning-proposals", response_model=List[LearningProposalResponse])
async def get_learning_proposals(
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(LearningProposal).where(LearningProposal.user_id == user.id, LearningProposal.status == "PENDING"))
    return [LearningProposalResponse.model_validate(lp) for lp in res.scalars().all()]

@router.post("/learning-proposals/{id}/approve")
async def approve_learning_proposal(
    id: UUID,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(LearningProposal).where(LearningProposal.id == id, LearningProposal.user_id == user.id))
    lp = res.scalars().first()
    if not lp:
        raise HTTPException(status_code=404, detail="Proposal not found")
        
    if lp.status != "PENDING":
        raise HTTPException(status_code=400, detail="Proposal already processed")
        
    lp.status = "APPROVED"
    
    # Update Creator DNA safely
    dna_res = await db.execute(select(CreatorDNA).where(CreatorDNA.user_id == user.id))
    dna = dna_res.scalars().first()
    if dna:
        # Merge proposed changes into learned_preferences safely
        current_learned = dna.learned_preferences or {}
        new_learned = {**current_learned, **lp.proposed_change_json}
        dna.learned_preferences = new_learned
        # Explicitly increment DNA version
        dna.version += 1
        db.add(dna)
        
    await db.commit()
    return {"status": "approved", "dna_updated": bool(dna)}
