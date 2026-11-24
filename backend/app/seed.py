"""Seed DB from app/data/curriculum.json + default admin/learner accounts.
Idempotent: skips if lessons already exist.
Default accounts (change passwords in production):
  admin@drawpath.app / admin123  (role admin)
  learner@drawpath.app / learner123 (role learner)
"""
import json, os
from sqlalchemy.orm import Session
from . import models
from .auth import hash_password

def _module_code_for(lesson_id: str):
    # Track lessons first: "LA-01" also starts with "L", so check it before L00-style.
    prefix = lesson_id.split("-")[0]
    track_map = {"PO": "T01", "AN": "T02", "LA": "T03", "DI": "T04"}
    if prefix in track_map:
        return track_map[prefix]
    if lesson_id.startswith("L") and lesson_id[1:3].isdigit():
        return "M" + lesson_id[1:3]
    return None

def seed(db: Session):
    if db.query(models.Lesson).count() > 0:
        return {"seeded": False, "reason": "lessons already exist"}
    path = os.path.join(os.path.dirname(__file__), "data", "curriculum.json")
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    for t in data.get("tracks", []):
        db.add(models.Track(slug=t["slug"], name=t["name"], kind=t.get("kind", "specialty")))
    db.flush()
    track_by_slug = {t.slug: t for t in db.query(models.Track).all()}
    mod_by_code = {}
    for m in data["modules"]:
        track = track_by_slug.get(m.get("track") or "foundation")
        mod = models.Module(code=m["code"], title=m["title"], description=m.get("description"),
                            order_index=m.get("order_index", 0),
                            track_id=track.id if track else None, status=m.get("status", "published"))
        db.add(mod); db.flush(); mod_by_code[m["code"]] = mod
    skill_by_id = {}
    for s in data.get("skills", []):
        sk = models.Skill(skill_id=s["skill_id"], name=s["name"], description=s.get("description"),
                          category=s.get("category"), mastery_criteria=s.get("mastery_criteria"))
        db.add(sk); db.flush(); skill_by_id[s["skill_id"]] = sk
    for s in data.get("skills", []):
        for pre in s.get("prerequisites", []):
            if pre in skill_by_id:
                db.add(models.SkillPrerequisite(skill_id=skill_by_id[s["skill_id"]].id,
                                                prerequisite_skill_id=skill_by_id[pre].id, relation="required"))
    for L in data["lessons"]:
        mod = mod_by_code.get(_module_code_for(L["lesson_id"]))
        if not mod: continue
        lesson = models.Lesson(lesson_id=L["lesson_id"], module_id=mod.id, title=L["title"],
                               description=L.get("description"), objectives=L.get("objectives", []),
                               difficulty=L.get("difficulty", "beginner"),
                               estimated_minutes=L.get("estimated_minutes", 30),
                               prerequisites=L.get("prerequisites", []), theory=L.get("theory"),
                               correct_examples=L.get("correct_examples", []),
                               wrong_examples=L.get("wrong_examples", []), steps=L.get("steps", []),
                               common_mistakes=L.get("common_mistakes", []),
                               pass_condition=L.get("pass_condition"),
                               next_lesson_id=L.get("next_lesson_id"), status=L.get("status", "published"))
        db.add(lesson); db.flush()
        for ex in L.get("exercises", []):
            e = models.Exercise(exercise_id=ex["exercise_id"], lesson_id=lesson.id, title=ex["title"],
                                description=ex.get("description"), mode=ex.get("mode", "guided"),
                                evaluation_type=ex.get("evaluation_type", "line"), rubric_version="v1")
            db.add(e); db.flush()
            r = models.Rubric(exercise_id=e.id, version="v1", name=f"Rubric {ex['exercise_id']}")
            db.add(r); db.flush()
            for c in ex.get("rubric", []):
                db.add(models.RubricCriterion(rubric_id=r.id, criterion_id=c["criterion_id"],
                                              name=c["name"], weight=c["weight"], evaluation_method="geometry"))
    for email, username, pw, role in [("admin@drawpath.app", "admin", "admin123", "admin"),
                                      ("learner@drawpath.app", "learner", "learner123", "learner")]:
        if not db.query(models.User).filter(models.User.email == email).first():
            u = models.User(email=email, username=username, hashed_password=hash_password(pw), role=role, is_verified=True)
            db.add(u); db.flush()
            db.add(models.UserProfile(user_id=u.id, display_name=username, goal="Học vẽ từ cơ bản"))
    db.commit()
    return {"seeded": True, "lessons": db.query(models.Lesson).count(),
            "modules": db.query(models.Module).count(), "exercises": db.query(models.Exercise).count()}
