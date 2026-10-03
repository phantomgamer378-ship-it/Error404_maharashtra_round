from fastapi import APIRouter, HTTPException
from typing import List
import uuid
from datetime import datetime, timezone
from .schemas import EditDocumentResponse, EditDocumentCreate, AIEditRequest
from ...services.generation_service import generation_service

router = APIRouter(prefix="/editor", tags=["editor"])

mock_documents = {}

@router.get("/{clip_id}", response_model=EditDocumentResponse)
def get_document(clip_id: str):
    if clip_id not in mock_documents:
        # Return a blank document
        return {
            "id": str(uuid.uuid4()),
            "clip_id": clip_id,
            "project_id": "mock",
            "source_asset_id": "mock",
            "revision": 1,
            "tracks": [],
            "created_at": str(datetime.now(timezone.utc))
        }
    return mock_documents[clip_id]

@router.post("/{clip_id}", response_model=EditDocumentResponse)
def save_document(clip_id: str, doc: EditDocumentCreate):
    # Optimistic concurrency check
    current = mock_documents.get(clip_id)
    if current and current["revision"] != doc.revision:
        raise HTTPException(status_code=409, detail="Conflict: Server revision is newer.")
    
    new_doc = {
        "id": str(uuid.uuid4()),
        "clip_id": clip_id,
        "project_id": doc.project_id,
        "source_asset_id": doc.source_asset_id,
        "revision": doc.revision + 1,
        "tracks": [t.dict() for t in doc.tracks],
        "created_at": str(datetime.now(timezone.utc))
    }
    mock_documents[clip_id] = new_doc
    return new_doc

@router.post("/ai-edit")
async def request_ai_edit(req: AIEditRequest):
    # Scope AI edits to single elements as instructed
    result = await generation_service.regenerate_section(
        "element", 
        "Mock element content", 
        req.instruction, 
        req.creator_dna
    )
    return {"proposed_edit": result}
