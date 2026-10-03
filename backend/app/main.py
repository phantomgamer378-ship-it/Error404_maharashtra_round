from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="VIDORA API",
    description="AI-powered creator operating platform API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}

from app.modules.opportunities.router import router as opp_router
from app.modules.ideas.router import router as ideas_router
from app.modules.projects.router import router as projects_router
from app.modules.scripts.router import router as scripts_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(opp_router)
api_router.include_router(ideas_router)
api_router.include_router(projects_router)
api_router.include_router(scripts_router)

app.include_router(api_router)
