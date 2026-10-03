from fastapi import APIRouter, HTTPException
from typing import List
from .schemas import IdeaResponse, IdeaCreate
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/ideas", tags=["ideas"])

mock_ideas = []

@router.get("/", response_model=List[IdeaResponse])
def get_ideas():
    return mock_ideas

@router.post("/", response_model=IdeaResponse)
def create_idea(idea: IdeaCreate):
    new_idea = {
        "id": str(uuid.uuid4()),
        "user_id": "mock_user_id",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
        **idea.dict()
    }
    mock_ideas.append(new_idea)
    return new_idea
