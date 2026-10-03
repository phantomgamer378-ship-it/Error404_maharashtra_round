from fastapi import APIRouter
from typing import List
import uuid
from datetime import datetime, timezone
from .schemas import AnalyticMetricResponse, AnalyticMetricCreate, InsightResponse

router = APIRouter(prefix="/analytics", tags=["analytics"])

mock_metrics = []
mock_insights = [
    {
        "id": str(uuid.uuid4()),
        "project_id": "all",
        "observation": "High retention in first 5 seconds.",
        "evidence": "Data across 3 recent videos shows < 5% dropoff initially.",
        "interpretation": "Your aggressive hook strategy is working well for your audience.",
        "uncertainty": "Low",
        "suggested_dna_update": "Maintain fast-paced, direct-to-camera hooks.",
        "created_at": datetime.now(timezone.utc)
    }
]

@router.get("/", response_model=List[AnalyticMetricResponse])
def get_metrics():
    return mock_metrics

@router.post("/", response_model=AnalyticMetricResponse)
def add_metric(metric: AnalyticMetricCreate):
    new_metric = {
        "id": str(uuid.uuid4()),
        "created_at": datetime.now(timezone.utc),
        **metric.dict()
    }
    mock_metrics.append(new_metric)
    return new_metric

@router.get("/insights", response_model=List[InsightResponse])
def get_insights():
    return mock_insights
