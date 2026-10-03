from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID
from datetime import datetime, timezone

from app.db.session import get_db
from app.db.models import Project, Idea, Opportunity
from app.schemas.phase3 import ProjectCreate, ProjectUpdate, ProjectResponse
from app.auth.jwt import get_current_user, CurrentUser

router = APIRouter(prefix="/projects", tags=["projects"])

VALID_STAGES = ["IDEA", "SCRIPTING", "FOOTAGE", "EDITING", "ADAPTATION", "COMPLETED"]

@router.get("/", response_model=List[ProjectResponse])
async def get_projects(
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Project).where(Project.user_id == user.id))
    return [ProjectResponse.model_validate(p) for p in result.scalars().all()]

@router.post("/", response_model=ProjectResponse)
async def create_project(
    proj_in: ProjectCreate,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    if proj_in.opportunity_id:
        res_o = await db.execute(select(Opportunity).where(Opportunity.id == proj_in.opportunity_id))
        if not res_o.scalars().first():
            raise HTTPException(status_code=404, detail="Opportunity not found")
            
    if proj_in.idea_id:
        res_i = await db.execute(select(Idea).where(Idea.id == proj_in.idea_id, Idea.user_id == user.id))
        idea = res_i.scalars().first()
        if not idea:
            raise HTTPException(status_code=404, detail="Idea not found")
        # Update idea status to converted
        idea.status = "converted"
        db.add(idea)
            
    project = Project(user_id=user.id, **proj_in.model_dump(exclude_unset=True))
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return ProjectResponse.model_validate(project)

@router.get("/{id}", response_model=ProjectResponse)
async def get_project(
    id: UUID,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Project).where(Project.id == id, Project.user_id == user.id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectResponse.model_validate(project)

@router.patch("/{id}", response_model=ProjectResponse)
async def update_project(
    id: UUID,
    proj_in: ProjectUpdate,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Project).where(Project.id == id, Project.user_id == user.id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    if proj_in.stage and proj_in.stage not in VALID_STAGES:
        raise HTTPException(status_code=422, detail="Invalid stage transition")
        
    for key, val in proj_in.model_dump(exclude_unset=True).items():
        setattr(project, key, val)
        
    await db.commit()
    await db.refresh(project)
    return ProjectResponse.model_validate(project)

@router.delete("/{id}")
async def delete_project(
    id: UUID,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Project).where(Project.id == id, Project.user_id == user.id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project.archived_at = datetime.now(timezone.utc)
    project.status = "archived"
    await db.commit()
    return {"status": "success"}
