from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.models import Profile, CreatorDNA
from app.schemas.profile import MeResponse, ProfileResponse, CreatorDNAResponse
from app.auth.jwt import get_current_user, CurrentUser

router = APIRouter(tags=["me"])

@router.get("/me", response_model=MeResponse)
async def get_me(user: CurrentUser = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result_profile = await db.execute(select(Profile).where(Profile.user_id == user.id))
    profile = result_profile.scalars().first()

    result_dna = await db.execute(select(CreatorDNA).where(CreatorDNA.user_id == user.id))
    dna = result_dna.scalars().first()

    return MeResponse(
        user={"id": str(user.id), "email": user.email},
        profile=ProfileResponse.model_validate(profile) if profile else None,
        creator_dna=CreatorDNAResponse.model_validate(dna) if dna else None
    )
