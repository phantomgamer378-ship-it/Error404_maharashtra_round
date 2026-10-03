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
    result = await db.execute(select(CreatorDNA).where(CreatorDNA.user_id == user.id))
    dna = result.scalars().first()
    if not dna:
        raise HTTPException(status_code=404, detail="Creator DNA not found")
    return CreatorDNAResponse.model_validate(dna)

@router.put("/", response_model=CreatorDNAResponse)
async def update_creator_dna(
    dna_data: CreatorDNACreate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(CreatorDNA).where(CreatorDNA.user_id == user.id))
    dna = result.scalars().first()
    
    if not dna:
        dna = CreatorDNA(user_id=user.id, version=1, **dna_data.model_dump(exclude_unset=True))
        db.add(dna)
    else:
        # Increment version for version history
        dna.version += 1
        for key, value in dna_data.model_dump(exclude_unset=True).items():
            setattr(dna, key, value)
            
    await db.commit()
    await db.refresh(dna)
    
    # Save to version history
    dna_version = CreatorDNAVersion(
        creator_dna_id=dna.id,
        version=dna.version,
        snapshot=CreatorDNAResponse.model_validate(dna).model_dump(mode='json'),
        change_reason="Explicit update via API"
    )
    db.add(dna_version)
    await db.commit()
    
    return CreatorDNAResponse.model_validate(dna)
