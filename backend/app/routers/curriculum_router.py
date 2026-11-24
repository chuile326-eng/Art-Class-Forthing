from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas

router = APIRouter(tags=["curriculum"])

@router.get("/tracks", response_model=list[schemas.TrackOut])
def list_tracks(db: Session = Depends(get_db)):
    return db.query(models.Track).all()

@router.get("/modules", response_model=list[schemas.ModuleOut])
def list_modules(db: Session = Depends(get_db)):
    return db.query(models.Module).order_by(models.Module.order_index).all()

@router.get("/modules/{code}", response_model=schemas.ModuleOut)
def get_module(code: str, db: Session = Depends(get_db)):
    m = db.query(models.Module).filter(models.Module.code == code).first()
    if not m: raise HTTPException(404, "Module not found")
    return m

@router.get("/lessons/{lesson_id}", response_model=schemas.LessonOut)
def get_lesson(lesson_id: str, db: Session = Depends(get_db)):
    l = db.query(models.Lesson).filter(models.Lesson.lesson_id == lesson_id).first()
    if not l: raise HTTPException(404, "Lesson not found")
    return l

@router.get("/lessons")
def list_lessons(module_code: str | None = None, db: Session = Depends(get_db)):
    q = db.query(models.Lesson)
    if module_code:
        mod = db.query(models.Module).filter(models.Module.code == module_code).first()
        if not mod: raise HTTPException(404, "Module not found")
        q = q.filter(models.Lesson.module_id == mod.id)
    return [{"lesson_id": l.lesson_id, "title": l.title, "difficulty": l.difficulty,
             "estimated_minutes": l.estimated_minutes, "status": l.status} for l in q.order_by(models.Lesson.id).all()]

@router.get("/lessons/{lesson_id}/exercises", response_model=list[schemas.ExerciseOut])
def lesson_exercises(lesson_id: str, db: Session = Depends(get_db)):
    l = db.query(models.Lesson).filter(models.Lesson.lesson_id == lesson_id).first()
    if not l: raise HTTPException(404, "Lesson not found")
    return l.exercises

@router.get("/skills")
def list_skills(db: Session = Depends(get_db)):
    out = []
    for s in db.query(models.Skill).all():
        out.append({"skill_id": s.skill_id, "name": s.name, "category": s.category,
                    "description": s.description,
                    "prerequisites": [db.query(models.Skill).get(p.prerequisite_skill_id).skill_id
                                      for p in s.prerequisites]})
    return out

@router.get("/exercises/{exercise_id}")
def get_exercise(exercise_id: str, db: Session = Depends(get_db)):
    e = db.query(models.Exercise).filter(models.Exercise.exercise_id == exercise_id).first()
    if not e: raise HTTPException(404, "Exercise not found")
    rubrics = []
    for r in e.rubrics:
        rubrics.append({"version": r.version, "criteria": [{"criterion_id": c.criterion_id, "name": c.name, "weight": c.weight} for c in r.criteria]})
    return {"exercise_id": e.exercise_id, "title": e.title, "mode": e.mode,
            "evaluation_type": e.evaluation_type, "rubric_version": e.rubric_version, "rubrics": rubrics}
