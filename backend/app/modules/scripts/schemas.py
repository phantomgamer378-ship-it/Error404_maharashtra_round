from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ScriptSection(BaseModel):
    id: str
    type: str # hook, context, main_points, evidence, cta
    content: str
    status: str # generated, edited, approved

class ScriptBase(BaseModel):
    project_id: str
    version: int
    status: str # draft, final
    sections: List[ScriptSection]

class ScriptCreate(ScriptBase):
    pass

class ScriptResponse(ScriptBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ScriptRevisionBase(BaseModel):
    script_id: str
    version: int
    sections: List[ScriptSection]

class ScriptRevisionResponse(ScriptRevisionBase):
    id: str
    created_at: datetime
