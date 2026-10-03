from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID

from app.db.session import get_db
from app.db.models import Idea, Opportunity
from app.schemas.phase3 import IdeaCreate, IdeaUpdate, IdeaResponse
from app.auth.jwt import get_current_user, CurrentUser

router = APIRouter(prefix="/ideas", tags=["ideas"])

@router.get("/", response_model=List[IdeaResponse])
async def get_ideas(
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Idea).where(Idea.user_id == user.id))
    return [IdeaResponse.model_validate(i) for i in result.scalars().all()]

@router.post("/", response_model=IdeaResponse)
async def create_idea(
    idea_in: IdeaCreate,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    if idea_in.opportunity_id:
        res = await db.execute(select(Opportunity).where(Opportunity.id == idea_in.opportunity_id))
        if not res.scalars().first():
            raise HTTPException(status_code=404, detail="Opportunity not found")
            
    idea = Idea(user_id=user.id, **idea_in.model_dump(exclude_unset=True))
    db.add(idea)
    await db.commit()
    await db.refresh(idea)
    return IdeaResponse.model_validate(idea)

@router.get("/{id}", response_model=IdeaResponse)
async def get_idea(
    id: UUID,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Idea).where(Idea.id == id, Idea.user_id == user.id))
    idea = result.scalars().first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    return IdeaResponse.model_validate(idea)

@router.patch("/{id}", response_model=IdeaResponse)
async def update_idea(
    id: UUID,
    idea_in: IdeaUpdate,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Idea).where(Idea.id == id, Idea.user_id == user.id))
    idea = result.scalars().first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
        
    for key, val in idea_in.model_dump(exclude_unset=True).items():
        setattr(idea, key, val)
        
    await db.commit()
    await db.refresh(idea)
    return IdeaResponse.model_validate(idea)

@router.delete("/{id}")
async def delete_idea(
    id: UUID,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Idea).where(Idea.id == id, Idea.user_id == user.id))
    idea = result.scalars().first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    await db.delete(idea)
    await db.commit()
    return {"status": "success"}
