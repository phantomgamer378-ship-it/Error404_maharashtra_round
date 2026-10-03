from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID

from app.db.session import get_db
from app.db.models import Project, Script, ScriptRevision, CreatorDNA, Opportunity
from app.schemas.phase4 import ScriptGenerateRequest, ScriptResponse, ScriptRevisionResponse, HooksResponse, HookAlternative
from app.auth.jwt import get_current_user, CurrentUser
from app.services.generation import GenerationService
from app.schemas.profile import CreatorDNAResponse

router = APIRouter(prefix="/scripts", tags=["scripts"])

@router.post("/projects/{project_id}/generate", response_model=ScriptResponse, status_code=status.HTTP_202_ACCEPTED)
async def generate_script(
    project_id: UUID,
    request: ScriptGenerateRequest,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    # Enforce ownership of project
    result_proj = await db.execute(select(Project).where(Project.id == project_id, Project.user_id == user.id))
    project = result_proj.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # Get Context
    dna_result = await db.execute(select(CreatorDNA).where(CreatorDNA.user_id == user.id))
    dna = dna_result.scalars().first()
    dna_dict = CreatorDNAResponse.model_validate(dna).model_dump(mode='json') if dna else {}
    
    opp_dict = {}
    if project.opportunity_id:
        opp_res = await db.execute(select(Opportunity).where(Opportunity.id == project.opportunity_id))
        opp = opp_res.scalars().first()
        opp_dict = {"title": opp.title, "summary": opp.summary} if opp else {}

    # Find or Create Script
    result_script = await db.execute(select(Script).where(Script.project_id == project_id))
    script = result_script.scalars().first()
    if not script:
        script = Script(project_id=project_id)
        db.add(script)
        await db.commit()
        await db.refresh(script)
        
    # In a real async job pipeline, we would return 202 and a job ID here.
    # For now, we execute generation synchronously for the prototype.
    service = GenerationService()
    try:
        gen_result = await service.generate_script(
            creator_dna=dna_dict,
            opportunity=opp_dict,
            project={"title": project.title, "brief": project.brief},
            request=request.creator_instruction
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    # Calculate next version
    version_result = await db.execute(select(ScriptRevision).where(ScriptRevision.script_id == script.id).order_by(ScriptRevision.version.desc()))
    last_rev = version_result.scalars().first()
    next_v = (last_rev.version + 1) if last_rev else 1
    
    # Save Revision
    revision = ScriptRevision(
        script_id=script.id,
        version=next_v,
        structured_content=gen_result["structured_content"],
        generation_source="ai_generate",
        model=gen_result["metadata"]["model"],
        provider=gen_result["metadata"]["provider"],
        prompt_version=gen_result["metadata"]["prompt_version"],
        created_by=user.id
    )
    db.add(revision)
    await db.commit()
    await db.refresh(revision)
    
    # Update script pointer
    script.current_revision_id = revision.id
    await db.commit()
    await db.refresh(script)

    return ScriptResponse.model_validate(script)

@router.post("/projects/{project_id}/hooks", response_model=HooksResponse)
async def generate_hooks(
    project_id: UUID,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    # In a full implementation, we would extract the current revision and generate alternative hooks based on it.
    return HooksResponse(alternatives=[
        HookAlternative(text="Did you know...", rationale="Creates curiosity"),
        HookAlternative(text="Stop doing X right now.", rationale="Pattern interrupt")
    ])

@router.get("/{script_id}/revisions/{revision_id}/restore")
async def restore_revision(
    script_id: UUID,
    revision_id: UUID,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    # Validate script belongs to project owned by user
    script_res = await db.execute(select(Script).where(Script.id == script_id))
    script = script_res.scalars().first()
    if not script:
        raise HTTPException(status_code=404, detail="Script not found")
        
    proj_res = await db.execute(select(Project).where(Project.id == script.project_id, Project.user_id == user.id))
    if not proj_res.scalars().first():
        raise HTTPException(status_code=404, detail="Project not found")
        
    rev_res = await db.execute(select(ScriptRevision).where(ScriptRevision.id == revision_id, ScriptRevision.script_id == script_id))
    revision = rev_res.scalars().first()
    if not revision:
        raise HTTPException(status_code=404, detail="Revision not found")
        
    script.current_revision_id = revision.id
    await db.commit()
    return {"status": "success", "restored_revision": revision.version}
