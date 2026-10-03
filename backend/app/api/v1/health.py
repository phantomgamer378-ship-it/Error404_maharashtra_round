from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/health", tags=["health"])

class HealthStatus(BaseModel):
    status: str
    version: str

@router.get("/live", response_model=HealthStatus)
async def liveness():
    # Simple check to ensure the API process is running
    return {"status": "ok", "version": "1.0.0"}

@router.get("/ready", response_model=HealthStatus)
async def readiness():
    # In a full app, this would ping the database, Redis, and storage
    # For now, we simulate a successful readiness check
    return {"status": "ready", "version": "1.0.0"}
