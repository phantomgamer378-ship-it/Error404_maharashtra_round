from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func
import uuid

Base = declarative_base()

class Profile(Base):
    __tablename__ = 'profiles'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), unique=True, nullable=False) # Maps to auth.users
    display_name = Column(String)
    bio = Column(String)
    onboarding_completed = Column(Integer, default=0) # 0 or 1
    onboarding_step = Column(String, default="profile")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CreatorDNA(Base):
    __tablename__ = 'creator_dna'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), unique=True, nullable=False)
    niche = Column(ARRAY(String), default=[])
    audience = Column(String)
    tone = Column(String)
    topics = Column(ARRAY(String), default=[])
    platforms = Column(ARRAY(String), default=[])
    goals = Column(ARRAY(String), default=[])
    explicit_preferences = Column(JSONB, default={})
    learned_preferences = Column(JSONB, default={})
    version = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class CreatorDNAVersion(Base):
    __tablename__ = 'creator_dna_versions'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    creator_dna_id = Column(UUID(as_uuid=True), ForeignKey('creator_dna.id', ondelete='CASCADE'), nullable=False)
    version = Column(Integer, nullable=False)
    snapshot = Column(JSONB, nullable=False)
    change_reason = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Opportunity(Base):
    __tablename__ = 'opportunities'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    topic = Column(String)
    category = Column(String)
    summary = Column(String)
    source = Column(String)
    source_url = Column(String)
    detected_at = Column(DateTime(timezone=True))
    published_at = Column(DateTime(timezone=True))
    freshness_score = Column(Integer, default=0)
    creator_relevance_score = Column(Integer, default=0)
    audience_fit_score = Column(Integer, default=0)
    feasibility_score = Column(Integer, default=0)
    overall_score = Column(Integer, default=0)
    score_version = Column(String)
    why_now = Column(JSONB, default={})
    why_you = Column(JSONB, default={})
    uncertainty = Column(String)
    is_demo = Column(Integer, default=0)
    status = Column(String, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Idea(Base):
    __tablename__ = 'ideas'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    opportunity_id = Column(UUID(as_uuid=True), ForeignKey('opportunities.id'), nullable=True)
    title = Column(String, nullable=False)
    description = Column(String)
    status = Column(String, default="saved") # saved, exploring, ready, converted, archived
    notes = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Project(Base):
    __tablename__ = 'projects'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    opportunity_id = Column(UUID(as_uuid=True), ForeignKey('opportunities.id'), nullable=True)
    idea_id = Column(UUID(as_uuid=True), ForeignKey('ideas.id'), nullable=True)
    title = Column(String, nullable=False)
    brief = Column(String)
    status = Column(String, default="active")
    stage = Column(String, default="IDEA") # IDEA, SCRIPTING, FOOTAGE, EDITING, ADAPTATION, COMPLETED
    target_platform = Column(String)
    target_format = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    archived_at = Column(DateTime(timezone=True))

class Script(Base):
    __tablename__ = 'scripts'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey('projects.id'), nullable=False)
    current_revision_id = Column(UUID(as_uuid=True), nullable=True) # Will point to script_revisions.id
    status = Column(String, default="draft")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class ScriptRevision(Base):
    __tablename__ = 'script_revisions'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    script_id = Column(UUID(as_uuid=True), ForeignKey('scripts.id', ondelete='CASCADE'), nullable=False)
    version = Column(Integer, nullable=False)
    content = Column(String, nullable=True)
    structured_content = Column(JSONB, nullable=True)
    generation_source = Column(String) # human, ai_generate, ai_rewrite
    model = Column(String)
    provider = Column(String)
    prompt_version = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    created_by = Column(UUID(as_uuid=True))

class Asset(Base):
    __tablename__ = 'assets'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    project_id = Column(UUID(as_uuid=True), ForeignKey('projects.id'), nullable=True)
    storage_path = Column(String, nullable=False)
    filename = Column(String)
    mime_type = Column(String)
    size_bytes = Column(Integer)
    duration_ms = Column(Integer)
    upload_status = Column(String, default="pending")
    processing_status = Column(String, default="none")
    metadata_json = Column(JSONB, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class AnalysisJob(Base):
    __tablename__ = 'analysis_jobs'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    resource_type = Column(String, nullable=False) # 'asset', 'project', etc.
    resource_id = Column(UUID(as_uuid=True), nullable=False)
    job_type = Column(String, nullable=False)
    status = Column(String, default="pending") # pending, queued, running, succeeded, failed, retrying
    stage = Column(String)
    progress = Column(Integer, default=0)
    attempt = Column(Integer, default=1)
    idempotency_key = Column(String, nullable=True, unique=True)
    error_code = Column(String)
    error_message = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))

class TranscriptSegment(Base):
    __tablename__ = 'transcript_segments'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_id = Column(UUID(as_uuid=True), ForeignKey('assets.id', ondelete='CASCADE'), nullable=False)
    sequence = Column(Integer, nullable=False)
    start_ms = Column(Integer, nullable=False)
    end_ms = Column(Integer, nullable=False)
    text = Column(String, nullable=False)
    language = Column(String)
    confidence = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Moment(Base):
    __tablename__ = 'moments'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_id = Column(UUID(as_uuid=True), ForeignKey('assets.id', ondelete='CASCADE'), nullable=False)
    project_id = Column(UUID(as_uuid=True), ForeignKey('projects.id', ondelete='CASCADE'), nullable=True)
    start_ms = Column(Integer, nullable=False)
    end_ms = Column(Integer, nullable=False)
    title = Column(String)
    reason = Column(String)
    score = Column(Integer)
    detection_method = Column(String)
    detection_version = Column(String)
    status = Column(String, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Clip(Base):
    __tablename__ = 'clips'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    asset_id = Column(UUID(as_uuid=True), ForeignKey('assets.id', ondelete='CASCADE'), nullable=False)
    moment_id = Column(UUID(as_uuid=True), ForeignKey('moments.id', ondelete='SET NULL'), nullable=True)
    source_start_ms = Column(Integer, nullable=False)
    source_end_ms = Column(Integer, nullable=False)
    name = Column(String)
    status = Column(String, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class EditDocument(Base):
    __tablename__ = 'edit_documents'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clip_id = Column(UUID(as_uuid=True), ForeignKey('clips.id', ondelete='CASCADE'), nullable=False)
    current_revision = Column(Integer, default=1)
    document_json = Column(JSONB, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class EditRevision(Base):
    __tablename__ = 'edit_revisions'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    edit_document_id = Column(UUID(as_uuid=True), ForeignKey('edit_documents.id', ondelete='CASCADE'), nullable=False)
    revision = Column(Integer, nullable=False)
    document_json = Column(JSONB, nullable=False)
    created_by = Column(UUID(as_uuid=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class EditOperation(Base):
    __tablename__ = 'edit_operations'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    edit_document_id = Column(UUID(as_uuid=True), ForeignKey('edit_documents.id', ondelete='CASCADE'), nullable=False)
    revision = Column(Integer, nullable=False)
    operation_type = Column(String, nullable=False)
    payload_json = Column(JSONB, nullable=False)
    created_by = Column(UUID(as_uuid=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Adaptation(Base):
    __tablename__ = 'adaptations'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    platform = Column(String, nullable=False)
    target = Column(String)
    content_json = Column(JSONB, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class PerformanceRecord(Base):
    __tablename__ = 'performance_records'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    project_id = Column(UUID(as_uuid=True), ForeignKey('projects.id', ondelete='SET NULL'), nullable=True)
    platform = Column(String, nullable=False)
    external_content_id = Column(String)
    recorded_at = Column(DateTime(timezone=True), nullable=False)
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    shares = Column(Integer, default=0)
    saves = Column(Integer, default=0)
    engagement_rate = Column(Integer)
    source_type = Column(String, nullable=False) # IMPORT, MANUAL, DEMO
    raw_payload = Column(JSONB, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Insight(Base):
    __tablename__ = 'insights'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    scope = Column(String)
    title = Column(String, nullable=False)
    summary = Column(String)
    evidence_json = Column(JSONB, default={})
    interpretation = Column(String)
    uncertainty = Column(String)
    insight_version = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class LearningProposal(Base):
    __tablename__ = 'learning_proposals'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    source_insight_id = Column(UUID(as_uuid=True), ForeignKey('insights.id', ondelete='SET NULL'), nullable=True)
    proposed_change_json = Column(JSONB, nullable=False)
    reason = Column(String)
    confidence = Column(Integer)
    status = Column(String, default="PENDING") # PENDING, APPROVED, REJECTED
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    reviewed_at = Column(DateTime(timezone=True))
