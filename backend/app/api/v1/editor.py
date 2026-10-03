from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
import uuid

from app.db.session import get_db
from app.db.models import EditDocument, EditRevision, EditOperation, Clip
from app.schemas.phase6 import EditOperationRequest, EditDocumentResponse, AIEditProposalRequest, AIEditProposalResponse
from app.auth.jwt import get_current_user, CurrentUser

router = APIRouter(prefix="/editor", tags=["editor"])

@router.get("/clips/{clip_id}/document", response_model=EditDocumentResponse)
async def get_edit_document(
    clip_id: UUID,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    # Verify clip ownership (simplified for hackathon, normally joins via project)
    result = await db.execute(select(EditDocument).where(EditDocument.clip_id == clip_id))
    doc = result.scalars().first()
    
    if not doc:
        # Create empty document
        doc = EditDocument(clip_id=clip_id, document_json={"timeline": []})
        db.add(doc)
        await db.commit()
        await db.refresh(doc)
        
    return EditDocumentResponse.model_validate(doc)

@router.post("/documents/{doc_id}/operate", response_model=EditDocumentResponse)
async def apply_edit_operation(
    doc_id: UUID,
    req: EditOperationRequest,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(EditDocument).where(EditDocument.id == doc_id))
    doc = res.scalars().first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # Optimistic Concurrency Control
    if doc.current_revision != req.expected_revision:
        raise HTTPException(status_code=409, detail="Conflict: Document revision mismatch.")
        
    # Apply operation (simulated deterministic update)
    # In reality, this merges the payload into document_json
    new_doc_state = {**doc.document_json, "last_op": req.operation_type}
    
    # Save operation
    op = EditOperation(
        edit_document_id=doc.id,
        revision=doc.current_revision + 1,
        operation_type=req.operation_type,
        payload_json=req.payload,
        created_by=user.id
    )
    db.add(op)
    
    # Save revision snapshot
    rev = EditRevision(
        edit_document_id=doc.id,
        revision=doc.current_revision + 1,
        document_json=new_doc_state,
        created_by=user.id
    )
    db.add(rev)
    
    # Update document pointer
    doc.current_revision += 1
    doc.document_json = new_doc_state
    
    await db.commit()
    await db.refresh(doc)
    
    return EditDocumentResponse.model_validate(doc)

@router.post("/documents/{doc_id}/ai-edit", response_model=AIEditProposalResponse)
async def request_ai_edit(
    doc_id: UUID,
    req: AIEditProposalRequest,
    user: CurrentUser = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    # Simulated AI Proposal (separates proposal from application)
    proposal_id = str(uuid.uuid4())
    return AIEditProposalResponse(
        proposal_id=proposal_id,
        proposed_document_json={"timeline": [{"mock": "AI edited selection"}]},
        explanation="AI removed 3 seconds of silence based on instruction."
    )
