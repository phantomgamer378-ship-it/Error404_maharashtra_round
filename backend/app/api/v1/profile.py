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
    result = await db.execute(select(Profile).where(Profile.user_id == user.id))
    profile = result.scalars().first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return ProfileResponse.model_validate(profile)

@router.patch("/", response_model=ProfileResponse)
async def update_profile(
    profile_data: ProfileCreate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Profile).where(Profile.user_id == user.id))
    profile = result.scalars().first()
    
    if not profile:
        profile = Profile(user_id=user.id, **profile_data.model_dump(exclude_unset=True))
        db.add(profile)
    else:
        for key, value in profile_data.model_dump(exclude_unset=True).items():
            setattr(profile, key, value)
            
    await db.commit()
    await db.refresh(profile)
    return ProfileResponse.model_validate(profile)
