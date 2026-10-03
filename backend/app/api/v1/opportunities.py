from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID

from app.db.session import get_db
from app.db.models import Opportunity, CreatorDNA
from app.schemas.phase3 import OpportunityResponse
from app.auth.jwt import get_current_user, CurrentUser
from app.services.trend_scoring import TrendScoringService

router = APIRouter(prefix="/opportunities", tags=["opportunities"])

@router.get("/", response_model=List[OpportunityResponse])
async def get_opportunities(
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    # Get Creator DNA
    result_dna = await db.execute(select(CreatorDNA).where(CreatorDNA.user_id == user.id))
    dna = result_dna.scalars().first()
    
    # Get all active opportunities (system-wide or demo)
    result = await db.execute(select(Opportunity).where(Opportunity.status == 'active'))
    ops = result.scalars().all()
    
    if dna:
        scorer = TrendScoringService()
        for op in ops:
            if not op.score_version: # Only score if not already scored
                scorer.score_opportunity(op, dna)
                db.add(op)
        await db.commit()
        
    return [OpportunityResponse.model_validate(op) for op in ops]

@router.get("/{id}", response_model=OpportunityResponse)
async def get_opportunity(
    id: UUID,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Opportunity).where(Opportunity.id == id))
    op = result.scalars().first()
    if not op:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return OpportunityResponse.model_validate(op)
