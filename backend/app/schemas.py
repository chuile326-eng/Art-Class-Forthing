"""Pydantic schemas."""
from typing import Any, List, Optional
from pydantic import BaseModel, EmailStr, Field, field_validator

class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3, max_length=100)
    password: str = Field(min_length=6)
    role: str = "learner"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int; email: str; username: str; role: str; is_active: bool
    class Config: from_attributes = True

class Token(BaseModel):
    access_token: str; token_type: str = "bearer"

class ProfileIn(BaseModel):
    display_name: Optional[str] = None; goal: Optional[str] = None
    self_level: Optional[str] = None; medium: Optional[str] = None
    minutes_per_day: Optional[int] = 30; bio: Optional[str] = None

class LessonOut(BaseModel):
    id: int; lesson_id: str; module_id: int; title: str; description: Optional[str] = None
    objectives: List[Any] = []; difficulty: str; estimated_minutes: int
    prerequisites: List[Any] = []; theory: Optional[str] = None
    steps: List[Any] = []; common_mistakes: List[Any] = []; pass_condition: Optional[str] = None
    next_lesson_id: Optional[str] = None; status: str
    class Config: from_attributes = True

class ModuleOut(BaseModel):
    id: int; code: str; title: str; description: Optional[str] = None; order_index: int; status: str
    lessons: List[LessonOut] = []
    class Config: from_attributes = True

class TrackOut(BaseModel):
    id: int; slug: str; name: str; description: Optional[str] = None; kind: str
    class Config: from_attributes = True

class ExerciseOut(BaseModel):
    id: int; exercise_id: str; lesson_id: int; title: str; description: Optional[str] = None
    mode: str; evaluation_type: str; rubric_version: str
    class Config: from_attributes = True

class StrokeIn(BaseModel):
    layer_id: Optional[int] = None; tool: str = "pencil"; color: str = "#242424"
    width: float = 2.0; opacity: float = 1.0
    points: List[dict] = []

class LayerIn(BaseModel):
    name: str = "Layer 1"; order_index: int = 0; visible: bool = True; locked: bool = False; opacity: float = 1.0

class ProjectIn(BaseModel):
    title: str = "Untitled"; lesson_id: Optional[int] = None
    canvas_width: int = 1024; canvas_height: int = 768

class SubmissionIn(BaseModel):
    exercise_id: int; project_id: Optional[int] = None; source_type: str = "canvas"; note: Optional[str] = None

class AssessmentCriterionOut(BaseModel):
    criterion_id: str; name: Optional[str] = None; score: Optional[float] = None; weight: float; feedback: Optional[str] = None
    class Config: from_attributes = True

class AnnotationOut(BaseModel):
    kind: str; x: float; y: float; x2: Optional[float] = None; y2: Optional[float] = None
    label: Optional[str] = None; error_type: Optional[str] = None; severity: str; fix: Optional[str] = None
    class Config: from_attributes = True

class AssessmentOut(BaseModel):
    id: int; submission_id: int; rubric_version: str; model_version: str; provider: str
    status: str; overall_score: Optional[float] = None; confidence: str
    strengths: List[Any] = []; weaknesses: List[Any] = []; corrections: List[Any] = []
    recommendations: List[Any] = []; failure_reason: Optional[str] = None; feedback_text: Optional[str] = None
    criterion_results: List[AssessmentCriterionOut] = []; annotations: List[AnnotationOut] = []
    class Config: from_attributes = True

class TutorIn(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    lesson_id: Optional[int] = None; submission_id: Optional[int] = None

class ProgressIn(BaseModel):
    lesson_id: int; status: str = "started"; progress_pct: float = 0
    @field_validator("progress_pct")
    @classmethod
    def _pct(cls, v):
        if not 0 <= v <= 100: raise ValueError("progress_pct must be 0..100")
        return v
