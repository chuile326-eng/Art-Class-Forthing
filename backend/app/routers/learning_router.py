"""Tutor, progress, mastery, recommendations, portfolio, users."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from ..auth import get_current_user, check_ownership
from ..ai_providers import generate_text, sanitize_user_text, available_providers

router = APIRouter(tags=["learning"])

@router.post("/tutor/chat")
def tutor_chat(data: schemas.TutorIn, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    msg = sanitize_user_text(data.message)
    if not msg: raise HTTPException(400, "Message empty after sanitisation")
    context = "Bạn là gia sư vẽ DrawPath AI, trả lời bằng tiếng Việt, ngắn gọn, thực tế."
    if data.lesson_id:
        lesson = db.query(models.Lesson).filter(models.Lesson.id == data.lesson_id).first()
        if lesson: context += f"\nBài học hiện tại: {lesson.title}. Lý thuyết tóm tắt: {lesson.theory[:800]}"
    if data.submission_id:
        sub = db.query(models.Submission).filter(models.Submission.id == data.submission_id).first()
        if sub:
            check_ownership(user, sub.owner_id)
            a = db.query(models.Assessment).filter(models.Assessment.submission_id == sub.id).order_by(models.Assessment.id.desc()).first()
            if a: context += f"\nBài nộp gần nhất: điểm {a.overall_score}/100, điểm yếu: {a.weaknesses}, gợi ý sửa: {a.corrections}"
    db.add(models.AIConversation(user_id=user.id, lesson_id=data.lesson_id, submission_id=data.submission_id, role="user", content=msg))
    db.commit()
    try:
        gen = generate_text(msg, system=context)
        reply, provider = gen["text"], gen["provider"]
    except Exception as e:
        reply = ("Gia sư AI tạm thời không kết nối được tới nhà cung cấp miễn phí "
                 "(Pollinations/HuggingFace/OpenRouter đều không phản hồi). "
                 "Bạn vẫn có thể xem lại lý thuyết bài học và rubric của bài luyện; hãy thử lại sau vài phút.")
        provider = "unavailable"
    db.add(models.AIConversation(user_id=user.id, lesson_id=data.lesson_id, submission_id=data.submission_id, role="assistant", content=reply, provider=provider))
    db.commit()
    return {"reply": reply, "provider": provider, "available_providers": available_providers()}

@router.post("/progress", status_code=201)
def upsert_progress(data: schemas.ProgressIn, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == data.lesson_id).first()
    if not lesson: raise HTTPException(404, "Lesson not found")
    p = db.query(models.LearningProgress).filter(models.LearningProgress.user_id == user.id, models.LearningProgress.lesson_id == data.lesson_id).first()
    if not p:
        p = models.LearningProgress(user_id=user.id, lesson_id=data.lesson_id)
        db.add(p)
    p.status = data.status; p.progress_pct = data.progress_pct
    if data.status == "completed" and data.progress_pct >= 100:
        from datetime import datetime; p.completed_at = datetime.utcnow()
    db.commit()
    return {"lesson_id": data.lesson_id, "status": p.status, "progress_pct": p.progress_pct}

@router.get("/progress")
def get_progress(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.query(models.LearningProgress).filter(models.LearningProgress.user_id == user.id).all()
    total = db.query(models.Lesson).count()
    done = sum(1 for r in rows if r.status == "completed")
    return {"total_lessons": total, "completed": done,
            "items": [{"lesson_id": r.lesson_id, "status": r.status, "progress_pct": r.progress_pct} for r in rows]}

@router.get("/mastery")
def get_mastery(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.query(models.SkillMastery).filter(models.SkillMastery.user_id == user.id).all()
    skills = db.query(models.Skill).all()
    m = {r.skill_id: r for r in rows}
    return [{"skill_id": s.skill_id, "name": s.name, "level": m[s.id].level if s.id in m else "not_started",
             "score": m[s.id].score if s.id in m else 0, "evidence_count": m[s.id].evidence_count if s.id in m else 0} for s in skills]

@router.get("/recommendations")
def get_recommendations(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Rule-based: weakest assessed criteria -> lessons of that skill's module; else next uncompleted lesson.
    recs = db.query(models.Recommendation).filter(models.Recommendation.user_id == user.id).order_by(models.Recommendation.priority).all()
    if recs:
        return [{"lesson_id": db.query(models.Lesson).get(r.lesson_id).lesson_id, "reason": r.reason} for r in recs]
    done_ids = {r.lesson_id for r in db.query(models.LearningProgress).filter(models.LearningProgress.user_id == user.id, models.LearningProgress.status == "completed").all()}
    nxt = db.query(models.Lesson).filter(~models.Lesson.id.in_(done_ids)).order_by(models.Lesson.id).first() if done_ids else db.query(models.Lesson).order_by(models.Lesson.id).first()
    if not nxt: return []
    return [{"lesson_id": nxt.lesson_id, "reason": "Bài tiếp theo trong lộ trình nền tảng của bạn."}]

@router.post("/portfolio", status_code=201)
def add_portfolio(data: dict, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if data.get("submission_id"):
        sub = db.query(models.Submission).filter(models.Submission.id == data["submission_id"]).first()
        if not sub: raise HTTPException(404, "Submission not found")
        check_ownership(user, sub.owner_id)
    item = models.PortfolioItem(user_id=user.id, submission_id=data.get("submission_id"),
                                title=data.get("title", "Untitled"), image_path=data.get("image_path"),
                                is_public=bool(data.get("is_public", False)))
    db.add(item); db.commit(); db.refresh(item)
    return {"id": item.id, "title": item.title, "is_public": item.is_public}

@router.get("/portfolio")
def list_portfolio(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return [{"id": i.id, "title": i.title, "submission_id": i.submission_id, "is_public": i.is_public}
            for i in db.query(models.PortfolioItem).filter(models.PortfolioItem.user_id == user.id).all()]

@router.get("/users/me/profile")
def get_profile(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = db.query(models.UserProfile).filter(models.UserProfile.user_id == user.id).first()
    return {"email": user.email, "username": user.username, "role": user.role,
            "display_name": p.display_name if p else None, "goal": p.goal if p else None,
            "self_level": p.self_level if p else None, "medium": p.medium if p else None,
            "minutes_per_day": p.minutes_per_day if p else 30}

@router.put("/users/me/profile")
def update_profile(data: schemas.ProfileIn, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = db.query(models.UserProfile).filter(models.UserProfile.user_id == user.id).first()
    if not p:
        p = models.UserProfile(user_id=user.id); db.add(p)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(p, k, v)
    db.commit()
    return {"updated": True}
