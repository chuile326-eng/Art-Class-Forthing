"""SQLAlchemy models — all entities from Master Prompt §17."""
from datetime import datetime
from sqlalchemy import (Boolean, Column, DateTime, Float, ForeignKey, Integer,
                        String, Text, JSON)
from sqlalchemy.orm import relationship
from .database import Base


def _now():
    return datetime.utcnow()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="learner")  # guest/learner/instructor/admin
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=_now)
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="owner")
    projects = relationship("DrawingProject", back_populates="owner")


class UserProfile(Base):
    __tablename__ = "user_profiles"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    display_name = Column(String(200))
    goal = Column(String(200))
    self_level = Column(String(50))
    medium = Column(String(50))  # paper / digital / both
    minutes_per_day = Column(Integer, default=30)
    avatar_url = Column(String(500))
    bio = Column(Text)
    user = relationship("User", back_populates="profile")


class Track(Base):
    __tablename__ = "tracks"
    id = Column(Integer, primary_key=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    kind = Column(String(50), default="specialty")  # foundation / specialty
    prerequisites = Column(JSON, default=list)
    modules = relationship("Module", back_populates="track")


class Module(Base):
    __tablename__ = "modules"
    id = Column(Integer, primary_key=True)
    code = Column(String(20), unique=True, index=True, nullable=False)  # M00..M10, T01..
    title = Column(String(300), nullable=False)
    description = Column(Text)
    order_index = Column(Integer, default=0)
    track_id = Column(Integer, ForeignKey("tracks.id"), nullable=True)
    status = Column(String(20), default="published")
    track = relationship("Track", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module", cascade="all, delete-orphan")


class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True)
    lesson_id = Column(String(50), unique=True, index=True, nullable=False)  # L00-01
    module_id = Column(Integer, ForeignKey("modules.id"), nullable=False)
    title = Column(String(300), nullable=False)
    description = Column(Text)
    objectives = Column(JSON, default=list)
    difficulty = Column(String(20), default="beginner")
    estimated_minutes = Column(Integer, default=30)
    prerequisites = Column(JSON, default=list)
    theory = Column(Text)
    correct_examples = Column(JSON, default=list)
    wrong_examples = Column(JSON, default=list)
    steps = Column(JSON, default=list)
    common_mistakes = Column(JSON, default=list)
    pass_condition = Column(Text)
    next_lesson_id = Column(String(50))
    status = Column(String(20), default="published")  # draft/in-review/published/archived
    order_index = Column(Integer, default=0)
    module = relationship("Module", back_populates="lessons")
    blocks = relationship("LessonBlock", back_populates="lesson", cascade="all, delete-orphan")
    exercises = relationship("Exercise", back_populates="lesson", cascade="all, delete-orphan")


class LessonBlock(Base):
    __tablename__ = "lesson_blocks"
    id = Column(Integer, primary_key=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    block_type = Column(String(50), default="text")  # text/heading/image/steps/diagram
    content = Column(Text)
    order_index = Column(Integer, default=0)
    lesson = relationship("Lesson", back_populates="blocks")


class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True)
    skill_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    category = Column(String(100))
    difficulty = Column(String(20), default="beginner")
    mastery_criteria = Column(Text)
    prerequisites = relationship("SkillPrerequisite", foreign_keys="SkillPrerequisite.skill_id",
                                 back_populates="skill", cascade="all, delete-orphan")


class SkillPrerequisite(Base):
    __tablename__ = "skill_prerequisites"
    id = Column(Integer, primary_key=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    prerequisite_skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    relation = Column(String(20), default="required")  # required/recommended/parallel
    skill = relationship("Skill", foreign_keys=[skill_id], back_populates="prerequisites")


class Exercise(Base):
    __tablename__ = "exercises"
    id = Column(Integer, primary_key=True)
    exercise_id = Column(String(50), unique=True, index=True, nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    title = Column(String(300), nullable=False)
    description = Column(Text)
    mode = Column(String(30), default="guided")  # guided/assisted/independent
    evaluation_type = Column(String(50), default="line")  # line/shape/proportion/form/perspective/value/color/anatomy/composition/creative
    rubric_version = Column(String(20), default="v1")
    instructions = Column(Text)
    lesson = relationship("Lesson", back_populates="exercises")
    rubrics = relationship("Rubric", back_populates="exercise", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="exercise")


class Rubric(Base):
    __tablename__ = "rubrics"
    id = Column(Integer, primary_key=True)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    version = Column(String(20), default="v1")
    name = Column(String(200))
    exercise = relationship("Exercise", back_populates="rubrics")
    criteria = relationship("RubricCriterion", back_populates="rubric", cascade="all, delete-orphan")


class RubricCriterion(Base):
    __tablename__ = "rubric_criteria"
    id = Column(Integer, primary_key=True)
    rubric_id = Column(Integer, ForeignKey("rubrics.id"), nullable=False)
    criterion_id = Column(String(50), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    weight = Column(Float, nullable=False)  # percent; sum must be 100
    score_min = Column(Float, default=0)
    score_max = Column(Float, default=100)
    evaluation_method = Column(String(50), default="geometry")
    rubric = relationship("Rubric", back_populates="criteria")


class DrawingProject(Base):
    __tablename__ = "drawing_projects"
    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(300), default="Untitled")
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    canvas_width = Column(Integer, default=1024)
    canvas_height = Column(Integer, default=768)
    version = Column(Integer, default=1)
    data = Column(JSON, default=dict)  # project file format v1
    created_at = Column(DateTime, default=_now)
    updated_at = Column(DateTime, default=_now, onupdate=_now)
    owner = relationship("User", back_populates="projects")
    layers = relationship("DrawingLayer", back_populates="project", cascade="all, delete-orphan")
    strokes = relationship("DrawingStroke", back_populates="project", cascade="all, delete-orphan")


class DrawingLayer(Base):
    __tablename__ = "drawing_layers"
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("drawing_projects.id"), nullable=False)
    name = Column(String(100), default="Layer 1")
    order_index = Column(Integer, default=0)
    visible = Column(Boolean, default=True)
    locked = Column(Boolean, default=False)
    opacity = Column(Float, default=1.0)
    project = relationship("DrawingProject", back_populates="layers")


class DrawingStroke(Base):
    __tablename__ = "drawing_strokes"
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("drawing_projects.id"), nullable=False)
    layer_id = Column(Integer, ForeignKey("drawing_layers.id"), nullable=True)
    tool = Column(String(30), default="pencil")
    color = Column(String(20), default="#242424")
    width = Column(Float, default=2.0)
    opacity = Column(Float, default=1.0)
    points = Column(JSON, default=list)  # [{x,y,pressure,tilt,t}]
    created_at = Column(DateTime, default=_now)
    project = relationship("DrawingProject", back_populates="strokes")


class Submission(Base):
    __tablename__ = "submissions"
    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("drawing_projects.id"), nullable=True)
    source_type = Column(String(20), default="canvas")  # canvas/upload
    original_path = Column(String(500))
    processed_path = Column(String(500))
    note = Column(Text)
    version = Column(Integer, default=1)
    status = Column(String(30), default="submitted")  # submitted/processing/assessed/failed
    created_at = Column(DateTime, default=_now)
    owner = relationship("User", back_populates="submissions")
    exercise = relationship("Exercise", back_populates="submissions")
    versions = relationship("SubmissionVersion", back_populates="submission", cascade="all, delete-orphan")
    assessments = relationship("Assessment", back_populates="submission", cascade="all, delete-orphan")


class SubmissionVersion(Base):
    __tablename__ = "submission_versions"
    id = Column(Integer, primary_key=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"), nullable=False)
    version = Column(Integer, default=1)
    image_path = Column(String(500))
    stroke_data = Column(JSON, default=dict)
    created_at = Column(DateTime, default=_now)
    submission = relationship("Submission", back_populates="versions")


class Assessment(Base):
    __tablename__ = "assessments"
    id = Column(Integer, primary_key=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=True)
    rubric_version = Column(String(20), default="v1")
    model_version = Column(String(100), default="local-cv-v1")
    provider = Column(String(100), default="local-cv")
    status = Column(String(30), default="completed")  # completed/insufficient/unassessable/failed
    overall_score = Column(Float, nullable=True)
    confidence = Column(String(20), default="uncertain")  # reliable/uncertain/insufficient/unassessable
    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    corrections = Column(JSON, default=list)
    recommendations = Column(JSON, default=list)
    failure_reason = Column(Text)
    feedback_text = Column(Text)
    processing_metadata = Column(JSON, default=dict)
    created_at = Column(DateTime, default=_now)
    submission = relationship("Submission", back_populates="assessments")
    criterion_results = relationship("AssessmentCriterionResult", back_populates="assessment", cascade="all, delete-orphan")
    annotations = relationship("AssessmentAnnotation", back_populates="assessment", cascade="all, delete-orphan")


class AssessmentCriterionResult(Base):
    __tablename__ = "assessment_criterion_results"
    id = Column(Integer, primary_key=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    criterion_id = Column(String(50), nullable=False)
    name = Column(String(200))
    score = Column(Float, nullable=True)
    weight = Column(Float, default=0)
    feedback = Column(Text)
    assessment = relationship("Assessment", back_populates="criterion_results")


class AssessmentAnnotation(Base):
    __tablename__ = "assessment_annotations"
    id = Column(Integer, primary_key=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    kind = Column(String(50), default="point")  # point/line/region/correction_line
    x = Column(Float, default=0)  # normalized 0..1
    y = Column(Float, default=0)
    x2 = Column(Float, nullable=True)
    y2 = Column(Float, nullable=True)
    label = Column(String(300))
    error_type = Column(String(100))
    severity = Column(String(20), default="medium")
    fix = Column(Text)
    assessment = relationship("Assessment", back_populates="annotations")


class AIJob(Base):
    __tablename__ = "ai_jobs"
    id = Column(Integer, primary_key=True)
    job_id = Column(String(50), unique=True, index=True, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    submission_id = Column(Integer, ForeignKey("submissions.id"), nullable=True)
    kind = Column(String(50), default="assessment")
    model = Column(String(100))
    provider = Column(String(100))
    state = Column(String(20), default="QUEUED")  # QUEUED/PROCESSING/COMPLETED/FAILED/CANCELLED/EXPIRED
    retry_count = Column(Integer, default=0)
    error_code = Column(String(100))
    usage_metadata = Column(JSON, default=dict)
    created_at = Column(DateTime, default=_now)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)


class AIConversation(Base):
    __tablename__ = "ai_conversations"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"), nullable=True)
    role = Column(String(20))  # user/assistant
    content = Column(Text, nullable=False)
    provider = Column(String(100))
    created_at = Column(DateTime, default=_now)


class LearningProgress(Base):
    __tablename__ = "learning_progress"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    status = Column(String(30), default="started")  # started/completed
    progress_pct = Column(Float, default=0)
    completed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=_now, onupdate=_now)


class SkillMastery(Base):
    __tablename__ = "skill_mastery"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    level = Column(String(30), default="not_started")  # not_started/learning/needs_practice/proficient/mastered
    score = Column(Float, default=0)
    evidence_count = Column(Integer, default=0)
    updated_at = Column(DateTime, default=_now, onupdate=_now)


class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    reason = Column(Text)
    priority = Column(Integer, default=1)
    created_at = Column(DateTime, default=_now)


class PortfolioItem(Base):
    __tablename__ = "portfolio_items"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    submission_id = Column(Integer, ForeignKey("submissions.id"), nullable=True)
    title = Column(String(300))
    image_path = Column(String(500))
    is_public = Column(Boolean, default=False)
    created_at = Column(DateTime, default=_now)


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    entity = Column(String(100))
    entity_id = Column(Integer, nullable=True)
    detail = Column(Text)
    created_at = Column(DateTime, default=_now)
