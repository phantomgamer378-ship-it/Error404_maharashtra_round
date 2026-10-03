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
from app.modules.assets.router import router as assets_router
from app.modules.jobs.router import router as jobs_router
from app.modules.editor.router import router as editor_router
from app.modules.analytics.router import router as analytics_router

from app.api.v1.me import router as me_router
from app.api.v1.profile import router as profile_router
from app.api.v1.creator_dna import router as creator_dna_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(me_router)
api_router.include_router(profile_router)
api_router.include_router(creator_dna_router)
api_router.include_router(opp_router)
api_router.include_router(ideas_router)
api_router.include_router(projects_router)
api_router.include_router(scripts_router)
api_router.include_router(assets_router)
api_router.include_router(jobs_router)
api_router.include_router(editor_router)
api_router.include_router(analytics_router)

app.include_router(api_router)
