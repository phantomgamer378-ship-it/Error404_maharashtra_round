from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.models import Profile
from app.schemas.profile import ProfileResponse, ProfileCreate
from app.auth.jwt import get_current_user, CurrentUser

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("/", response_model=ProfileResponse)
async def get_profile(user: CurrentUser = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return ProfileResponse(
        id="00000000-0000-0000-0000-000000000000",
        user_id=user.id,
        display_name="Mock User",
        onboarding_completed=1,
        onboarding_step="completed"
    )

@router.patch("/", response_model=ProfileResponse)
async def update_profile(
    profile_data: ProfileCreate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return ProfileResponse(
        id="00000000-0000-0000-0000-000000000000",
        user_id=user.id,
        **profile_data.model_dump(exclude_unset=True)
    )
