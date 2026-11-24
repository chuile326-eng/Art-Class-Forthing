"""DrawPath AI — FastAPI backend entrypoint."""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine, SessionLocal
from .seed import seed
from .routers import auth_router, curriculum_router, drawing_router, submission_router, learning_router, admin_router

app = FastAPI(title="DrawPath AI", version="0.1.0",
              description="AI-Powered Drawing Learning Platform — backend (FastAPI + SQLAlchemy).")
_cors = os.environ.get("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
app.add_middleware(CORSMiddleware, allow_origins=[o.strip() for o in _cors.split(",") if o.strip()],
                   allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(auth_router.router)
app.include_router(curriculum_router.router)
app.include_router(drawing_router.router)
app.include_router(submission_router.router)
app.include_router(learning_router.router)
app.include_router(admin_router.router)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()

@app.get("/health")
def health():
    return {"status": "ok", "service": "drawpath-ai", "version": "0.1.0"}

@app.get("/")
def root():
    return {"service": "DrawPath AI", "docs": "/docs", "health": "/health"}
