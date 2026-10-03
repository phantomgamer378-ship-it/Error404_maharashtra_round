# VIDORA API Documentation

All APIs are namespaced under `/api/v1`.

## Modules

### Opportunities (`/opportunities`)
- `GET /` - List scored market opportunities
- `POST /{id}/action` - Trigger AI generation from an opportunity

### Ideas (`/ideas`)
- `GET /` - List generated concepts
- `POST /` - Manually save a new idea

### Projects (`/projects`)
- `POST /` - Initialize a new project workflow
- `GET /{id}` - Get project state

### Scripts (`/scripts`)
- `POST /generate/outline` - Generate structural outline
- `POST /generate/section` - AI co-write a specific section

### Assets (`/assets`)
- `POST /request-upload` - Request signed storage URL
- `POST /{id}/confirm-upload` - Confirm direct upload and trigger processing

### Editor (`/editor`)
- `GET /{clipId}` - Fetch EditDocument
- `POST /{clipId}` - Save revision (Optimistic Concurrency via `revision` int)
- `POST /ai-edit` - Scoped element modification

### Analytics (`/analytics`)
- `GET /` - List metrics
- `GET /insights` - Fetch observed performance insights
