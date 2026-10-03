# VIDORA Development Guide

## Environment Setup
1. Copy `.env.example` to `.env.local`
2. Populate `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Add backend secrets to `backend/.env` (e.g. `SUPABASE_SERVICE_ROLE_KEY`)

## Local Development Commands
**Frontend:**
```bash
npm install
npm run dev
```

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Database Setup
Execute `database/schema.sql` in the Supabase SQL Editor to initialize required tables (`profiles`, `creator_dna`).

## Known Limitations
- The Video Editor uses optimistic UI and requires FFmpeg integration for real playback.
- Async media processing is mocked synchronously for rapid UI testing.
