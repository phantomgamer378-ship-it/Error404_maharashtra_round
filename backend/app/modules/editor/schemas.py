from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class EditElement(BaseModel):
    id: str
    type: str # 'video', 'audio', 'caption', 'overlay'
    start_time: float
    end_time: float
    content: Optional[str] = None # text for captions, url for media
    properties: Dict[str, Any] = {} # e.g. crop, volume, transform

class EditTrack(BaseModel):
    id: str
    type: str # 'main_video', 'b_roll', 'audio_track', 'captions'
    elements: List[EditElement]

class EditDocumentBase(BaseModel):
    clip_id: str
    project_id: str
    source_asset_id: str
    revision: int
    tracks: List[EditTrack]

class EditDocumentCreate(EditDocumentBase):
    pass

class EditDocumentResponse(EditDocumentBase):
    id: str
    created_at: str

class AIEditRequest(BaseModel):
    element_id: str
    instruction: str
    creator_dna: Dict[str, Any]
