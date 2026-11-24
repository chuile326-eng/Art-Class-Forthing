"""Admin: curriculum CRUD, publish workflow, users, AI jobs, audit logs."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models
from ..auth import require_role

router = APIRouter(prefix="/admin", tags=["admin"])
admin = require_role("admin", "instructor")

@router.get("/overview")
def overview(user: models.User = Depends(admin), db: Session = Depends(get_db)):
    return {"users": db.query(models.User).count(), "lessons": db.query(models.Lesson).count(),
            "submissions": db.query(models.Submission).count(), "assessments": db.query(models.Assessment).count(),
            "ai_jobs_by_state": {s: db.query(models.AIJob).filter(models.AIJob.state == s).count() for s in ["QUEUED", "PROCESSING", "COMPLETED", "FAILED"]}}

@router.get("/users")
def list_users(user: models.User = Depends(admin), db: Session = Depends(get_db)):
    return [{"id": u.id, "email": u.email, "username": u.username, "role": u.role, "is_active": u.is_active}
            for u in db.query(models.User).all()]

@router.put("/users/{uid}/role")
def set_role(uid: int, data: dict, user: models.User = Depends(require_role("admin")), db: Session = Depends(get_db)):
    u = db.query(models.User).filter(models.User.id == uid).first()
    if not u: raise HTTPException(404, "User not found")
    if data.get("role") not in ("learner", "instructor", "admin"):
        raise HTTPException(400, "Invalid role")
    u.role = data["role"]; db.commit()
    db.add(models.AuditLog(user_id=user.id, action="set_role", entity="user", entity_id=uid, detail=f"role={u.role}")); db.commit()
    return {"id": u.id, "role": u.role}

@router.post("/lessons", status_code=201)
def create_lesson(data: dict, user: models.User = Depends(admin), db: Session = Depends(get_db)):
    mod = db.query(models.Module).filter(models.Module.code == data.get("module_code")).first()
    if not mod: raise HTTPException(404, "Module not found")
    if db.query(models.Lesson).filter(models.Lesson.lesson_id == data["lesson_id"]).first():
        raise HTTPException(400, "lesson_id already exists")
    l = models.Lesson(lesson_id=data["lesson_id"], module_id=mod.id, title=data["title"],
                      description=data.get("description"), theory=data.get("theory", ""),
                      difficulty=data.get("difficulty", "beginner"),
                      estimated_minutes=data.get("estimated_minutes", 30), status="draft")
    db.add(l); db.commit(); db.refresh(l)
    db.add(models.AuditLog(user_id=user.id, action="create_lesson", entity="lesson", entity_id=l.id)); db.commit()
    return {"id": l.id, "lesson_id": l.lesson_id, "status": l.status}

@router.put("/lessons/{lesson_id}/status")
def set_lesson_status(lesson_id: str, data: dict, user: models.User = Depends(admin), db: Session = Depends(get_db)):
    l = db.query(models.Lesson).filter(models.Lesson.lesson_id == lesson_id).first()
    if not l: raise HTTPException(404, "Lesson not found")
    new = data.get("status")
    allowed = {"draft": ["in-review", "archived"], "in-review": ["published", "draft"],
               "published": ["archived"], "archived": ["draft"]}
    if new not in allowed.get(l.status, []):
        raise HTTPException(400, f"Invalid transition {l.status} -> {new}; allowed: {allowed.get(l.status)}")
    if new == "published" and (not l.theory or len(l.theory.split()) < 50):
        raise HTTPException(400, "Cannot publish: theory too short (<50 words)")
    l.status = new; db.commit()
    db.add(models.AuditLog(user_id=user.id, action="lesson_status", entity="lesson", entity_id=l.id, detail=f"{lesson_id} -> {new}")); db.commit()
    return {"lesson_id": lesson_id, "status": new}

@router.get("/ai-jobs")
def list_jobs(user: models.User = Depends(admin), db: Session = Depends(get_db)):
    return [{"job_id": j.job_id, "kind": j.kind, "provider": j.provider, "model": j.model,
             "state": j.state, "retry_count": j.retry_count, "error_code": j.error_code}
            for j in db.query(models.AIJob).order_by(models.AIJob.id.desc()).limit(100).all()]

@router.get("/audit-logs")
def list_logs(user: models.User = Depends(admin), db: Session = Depends(get_db)):
    return [{"id": a.id, "user_id": a.user_id, "action": a.action, "entity": a.entity,
             "entity_id": a.entity_id, "detail": a.detail, "created_at": str(a.created_at)}
            for a in db.query(models.AuditLog).order_by(models.AuditLog.id.desc()).limit(200).all()]
