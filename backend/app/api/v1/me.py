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
    return MeResponse(
        user={"id": str(user.id), "email": user.email},
        profile=ProfileResponse(
            id="00000000-0000-0000-0000-000000000000",
            user_id=user.id,
            display_name="Mock User",
            onboarding_completed=1,
            onboarding_step="completed"
        ),
        creator_dna=CreatorDNAResponse(
            id="00000000-0000-0000-0000-000000000000",
            user_id=user.id,
            version=1,
            learned_preferences={},
            niche=["Tech"],
            topics=["Programming"],
            audience="Developers",
            tone="Educational",
            platforms=["YouTube"],
            goals=["Growth"]
        )
    )
