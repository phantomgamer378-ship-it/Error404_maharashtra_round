from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.models import CreatorDNA, CreatorDNAVersion
from app.schemas.profile import CreatorDNAResponse, CreatorDNACreate
from app.auth.jwt import get_current_user, CurrentUser

router = APIRouter(prefix="/creator-dna", tags=["creator_dna"])

@router.get("/", response_model=CreatorDNAResponse)
async def get_creator_dna(user: CurrentUser = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return CreatorDNAResponse(
        id="00000000-0000-0000-0000-000000000000",
        user_id=user.id,
        version=1,
        learned_preferences={},
        niche=[],
        topics=[],
        audience="",
        tone="",
        platforms=[],
        goals=[]
    )

@router.put("/", response_model=CreatorDNAResponse)
async def update_creator_dna(
    dna_data: CreatorDNACreate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Mock return for onboarding
    return CreatorDNAResponse(
        id="00000000-0000-0000-0000-000000000000",
        user_id=user.id,
        version=1,
        learned_preferences={},
        **dna_data.model_dump(exclude_unset=True)
    )
