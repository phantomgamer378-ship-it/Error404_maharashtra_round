from fastapi import APIRouter, HTTPException
from typing import List
from .schemas import ProjectResponse, ProjectCreate
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/projects", tags=["projects"])

mock_projects = []

@router.get("/", response_model=List[ProjectResponse])
def get_projects():
    return mock_projects

@router.post("/", response_model=ProjectResponse)
def create_project(project: ProjectCreate):
    new_project = {
        "id": str(uuid.uuid4()),
        "user_id": "mock_user_id",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
        **project.dict()
    }
    mock_projects.append(new_project)
    return new_project

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str):
    for p in mock_projects:
        if p["id"] == project_id:
            return p
    raise HTTPException(status_code=404, detail="Project not found")
