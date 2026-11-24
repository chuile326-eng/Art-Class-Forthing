# DrawPath AI — Backend

FastAPI + SQLAlchemy backend for the AI-Powered Drawing Learning Platform.

## Quick start

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # edit SECRET_KEY
uvicorn app.main:app --reload --port 8000
# docs: http://localhost:8000/docs   health: http://localhost:8000/health
```

Default DB is SQLite (`drawpath.db`, created on startup + seeded).
Set `DATABASE_URL=postgresql://...` to use PostgreSQL.

Default seeded accounts: `admin@drawpath.app / admin123`,
`learner@drawpath.app / learner123` — change in production.

## Structure

- `app/main.py` — FastAPI app, CORS, routers, startup seed
- `app/models.py`, `app/schemas.py`, `app/auth.py` (JWT + roles + ownership/IDOR checks)
- `app/seed.py` + `app/data/curriculum.json` — 15 modules, 75 lessons, 14 skills
- `app/assessment/` — geometry evaluators (numpy/PIL; cv2 optional) + rubric engine
- `app/ai_providers.py` — free fallback chain: local-cv → Pollinations (keyless) → HuggingFace (HF_TOKEN) → OpenRouter free (key) → OpenAI-compatible (key). Timeout 15s, 1 retry/provider. Provider is always recorded; local-CV results are labelled `local-cv`, never claimed as LLM output.
- `app/routers/` — auth, curriculum, drawing, submissions/uploads/assessments, learning (tutor/progress/mastery/recommendations/portfolio), admin

## Tests

```bash
pytest -q
```

## Known limitations (honest)

- AI tutor / feedback-text enrichment depends on the free Pollinations endpoint; if it is down, geometry assessment still works and tutor returns an honest "unavailable" message.
- Creative/composition exercises get geometry proxies + `uncertain` confidence, not a true aesthetic judgement.
- Email verification / password-reset email is not configured (`/auth/forgot-password` returns `not_configured`).
- Migrations: `create_all` on startup; Alembic folder is a stub (see `alembic/README.md`).
- OpenCV is optional; without it, contour stats are skipped (PIL gradient stats still run).
