from fastapi import APIRouter, HTTPException
from typing import List
from .schemas import JobResponse
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/jobs", tags=["jobs"])

mock_jobs = {}

@router.get("/resource/{resource_id}", response_model=List[JobResponse])
def get_jobs_by_resource(resource_id: str):
    return [j for j in mock_jobs.values() if j["resource_id"] == resource_id]

@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: str):
    if job_id not in mock_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return mock_jobs[job_id]
