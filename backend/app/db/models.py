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
