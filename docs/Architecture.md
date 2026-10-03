# Backend Architecture

## Overview
VIDORA's backend is a Modular Monolith built on FastAPI and SQLAlchemy 2.0 (Async). It enforces strict boundaries between domains (Identity, Content, Media, Editor, Analytics) while running as a single deployment unit to maximize engineering velocity and minimize operational complexity.

## Core Components
- **API Layer**: FastAPI (`app.api.v1`). Validates input, parses tokens via dependency injection, and returns Pydantic responses.
- **Domain Services**: Business logic (`app.services`). Handlers for LLM Generation, Trend Scoring, Media Alignment. 
- **Data Access Layer**: SQLAlchemy Async (`app.db`).
- **Background Orchestration**: Celery/Redis (`analysis_jobs` table as durable source of truth).
- **Authentication**: JWT validation against Supabase Auth using asymmetric public keys.
- **Storage**: Supabase Storage with strict RLS and signed URLs. No public footage bucket.

## Data Flow
1. **Request**: Arrives at FastAPI.
2. **Auth**: `get_current_user` decodes JWT and asserts validity.
3. **Authorization**: Route queries database using the verified `user.id`.
4. **Service**: Core logic executes (e.g., scoring, AI generation).
5. **Persistence**: Mutations are written to Postgres.
6. **Background**: Expensive tasks (Whisper, LLM) drop durable job records into `analysis_jobs` and dispatch Celery tasks.

## Security Principles
- **Never Trust the Client**: Writable paths, owner IDs, and state transitions are always server-controlled.
- **Idempotency**: All background operations expect duplicate delivery and handle it gracefully.
- **Optimistic Concurrency**: The timeline editor rejects concurrent mutation without silently overwriting.
