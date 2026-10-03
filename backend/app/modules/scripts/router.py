from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel
from .schemas import ScriptResponse, ScriptCreate, ScriptRevisionResponse
from ...services.generation_service import generation_service
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/scripts", tags=["scripts"])

# Mock DB
mock_scripts = {}
mock_revisions = {}

class GenerateRequest(BaseModel):
    creator_dna: Dict[str, Any]
    project_context: Dict[str, Any]

class RegenerateSectionRequest(BaseModel):
    section_type: str
    current_content: str
    instructions: str
    creator_dna: Dict[str, Any]

@router.post("/generate-hooks")
async def generate_hooks(req: GenerateRequest):
    result = await generation_service.generate_hook(req.creator_dna, req.project_context)
    return {"generated_text": result}

@router.post("/regenerate-section")
async def regenerate_section(req: RegenerateSectionRequest):
    result = await generation_service.regenerate_section(
        req.section_type, req.current_content, req.instructions, req.creator_dna
    )
    return {"generated_text": result}

@router.get("/{project_id}", response_model=ScriptResponse)
def get_script(project_id: str):
    if project_id not in mock_scripts:
        # Create an empty shell for a new project
        mock_scripts[project_id] = {
            "id": str(uuid.uuid4()),
            "project_id": project_id,
            "version": 1,
            "status": "draft",
            "sections": [],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        mock_revisions[project_id] = []
    return mock_scripts[project_id]

@router.put("/{project_id}", response_model=ScriptResponse)
def update_script(project_id: str, script: ScriptCreate):
    # Save current as revision
    if project_id in mock_scripts:
        current = mock_scripts[project_id]
        revision = {
            "id": str(uuid.uuid4()),
            "script_id": current["id"],
            "version": current["version"],
            "sections": current["sections"],
            "created_at": current["updated_at"]
        }
        mock_revisions[project_id].append(revision)
    
    updated = {
        "id": mock_scripts.get(project_id, {}).get("id", str(uuid.uuid4())),
        "project_id": project_id,
        "version": mock_scripts.get(project_id, {}).get("version", 0) + 1,
        "status": script.status,
        "sections": [s.dict() for s in script.sections],
        "created_at": mock_scripts.get(project_id, {}).get("created_at", datetime.now(timezone.utc)),
        "updated_at": datetime.now(timezone.utc)
    }
    mock_scripts[project_id] = updated
    return updated

@router.get("/{project_id}/revisions", response_model=List[ScriptRevisionResponse])
def get_revisions(project_id: str):
    return mock_revisions.get(project_id, [])
