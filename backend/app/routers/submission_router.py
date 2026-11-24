"""Upload validation + submissions + assessment + corrections."""
import io, os, uuid
from datetime import datetime
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session
from PIL import Image, ImageOps
import numpy as np
from ..database import get_db
from .. import models, schemas
from ..auth import get_current_user, check_ownership, require_role
from ..assessment.engine import assess_submission, validate_assessment_schema

router = APIRouter(tags=["submissions"])
UPLOAD_DIR = os.environ.get("UPLOAD_DIR", "./uploads")
MAX_MB = int(os.environ.get("MAX_UPLOAD_MB", "10"))
ALLOWED_MIME = {"image/jpeg": "JPEG", "image/png": "PNG", "image/webp": "WEBP"}

def validate_image_bytes(data: bytes):
    """Returns (PIL image, warnings list). Raises HTTPException on invalid."""
    if len(data) > MAX_MB * 1024 * 1024:
        raise HTTPException(413, f"File too large: max {MAX_MB} MB")
    if len(data) < 100:
        raise HTTPException(400, "File too small / empty")
    try:
        img = Image.open(io.BytesIO(data))
        img.verify()
        img = Image.open(io.BytesIO(data))
    except Exception:
        raise HTTPException(400, "File is not a decodable image")
    fmt = img.format
    if fmt not in ("JPEG", "PNG", "WEBP"):
        raise HTTPException(400, f"Unsupported format {fmt}; use JPG/PNG/WebP")
    img = ImageOps.exif_transpose(img)
    fmt = img.format or fmt  # exif_transpose may drop .format; keep the verified one
    if img.width < 50 or img.height < 50:
        raise HTTPException(400, "Image resolution too low (min 50x50)")
    if img.width > 8000 or img.height > 8000:
        raise HTTPException(400, "Image resolution too high (max 8000px)")
    warnings = []
    gray = np.asarray(img.convert("L"), dtype=float)
    if gray.mean() < 30: warnings.append("image_too_dark")
    if gray.mean() > 225: warnings.append("image_too_bright")
    gy, gx = np.gradient(gray)
    if float(np.sqrt(gx**2 + gy**2).mean()) < 2: warnings.append("image_blurry_or_blank")
    return img, warnings, fmt

@router.post("/uploads", status_code=201)
def upload_file(file: UploadFile = File(...), user: models.User = Depends(get_current_user)):
    data = file.file.read()
    img, warnings, fmt = validate_image_bytes(data)
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    ext = {"JPEG": "jpg", "PNG": "png", "WEBP": "webp"}[fmt]
    name = f"{uuid.uuid4().hex}.{ext}"
    path = os.path.join(UPLOAD_DIR, name)
    img.convert("RGB").save(path)
    return {"path": path, "format": fmt, "width": img.width, "height": img.height, "warnings": warnings}

@router.post("/submissions", status_code=201)
def create_submission(data: schemas.SubmissionIn, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    ex = db.query(models.Exercise).filter(models.Exercise.id == data.exercise_id).first()
    if not ex: raise HTTPException(404, "Exercise not found")
    project = None
    if data.project_id:
        project = db.query(models.DrawingProject).filter(models.DrawingProject.id == data.project_id).first()
        if not project: raise HTTPException(404, "Project not found")
        check_ownership(user, project.owner_id)
    sub = models.Submission(owner_id=user.id, exercise_id=ex.id,
                            project_id=project.id if project else None,
                            source_type=data.source_type, note=data.note, status="submitted")
    db.add(sub); db.commit(); db.refresh(sub)
    db.add(models.SubmissionVersion(submission_id=sub.id, version=1,
                                    stroke_data={"project_id": project.id} if project else {}))
    db.commit()
    return {"id": sub.id, "status": sub.status, "version": 1}

@router.get("/submissions")
def list_submissions(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    subs = db.query(models.Submission).filter(models.Submission.owner_id == user.id).order_by(models.Submission.id.desc()).all()
    return [{"id": s.id, "exercise_id": s.exercise_id, "status": s.status, "version": s.version, "created_at": str(s.created_at)} for s in subs]

@router.get("/submissions/{sid}")
def get_submission(sid: int, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    s = db.query(models.Submission).filter(models.Submission.id == sid).first()
    if not s: raise HTTPException(404, "Submission not found")
    check_ownership(user, s.owner_id)
    return {"id": s.id, "exercise_id": s.exercise_id, "project_id": s.project_id,
            "source_type": s.source_type, "status": s.status, "version": s.version,
            "assessments": [a.id for a in s.assessments],
            "versions": [{"version": v.version, "created_at": str(v.created_at)} for v in s.versions]}

@router.post("/submissions/{sid}/assess", response_model=schemas.AssessmentOut, status_code=201)
def assess(sid: int, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Run the local CV/geometry assessment pipeline (provider=local-cv).
    Optionally enriches feedback_text via the free text-provider chain; if that
    chain is unreachable the geometry result still stands and is labelled local-cv."""
    s = db.query(models.Submission).filter(models.Submission.id == sid).first()
    if not s: raise HTTPException(404, "Submission not found")
    check_ownership(user, s.owner_id)
    if db.query(models.Assessment).filter(models.Assessment.submission_id == sid).first():
        raise HTTPException(409, "Submission already assessed — create a new submission version to re-assess")
    ex = s.exercise
    strokes = []
    if s.project_id:
        strokes = [{"points": st.points, "tool": st.tool} for st in
                   db.query(models.DrawingStroke).filter(models.DrawingStroke.project_id == s.project_id).all()]
    rubric = ex.rubrics[0] if ex.rubrics else None
    criteria = [{"criterion_id": c.criterion_id, "name": c.name, "weight": c.weight} for c in rubric.criteria] if rubric else None
    job = models.AIJob(job_id=f"job-{uuid.uuid4().hex[:12]}", owner_id=user.id, submission_id=sid,
                       kind="assessment", model="local-cv-v1", provider="local-cv", state="PROCESSING",
                       started_at=datetime.utcnow())
    db.add(job); db.commit()
    try:
        result = assess_submission(s, ex, strokes=strokes, image_path=s.original_path,
                                   rubric_criteria=criteria)
    except Exception as e:
        job.state = "FAILED"; job.error_code = str(e); db.commit()
        raise HTTPException(500, f"Assessment failed: {e}")
    # Optional free-text enrichment (never replaces geometry scores)
    feedback_text = None; provider_used = "local-cv"
    if result["status"] == "completed":
        try:
            from ..ai_providers import generate_text, sanitize_user_text
            prompt = sanitize_user_text(
                f"Bạn là gia sư vẽ. Học viên vừa làm bài '{ex.title}' và được chấm {result['overall_score']}/100. "
                f"Điểm mạnh: {result['strengths']}. Điểm yếu: {result['weaknesses']}. "
                "Viết 3-4 câu động viên bằng tiếng Việt và 2 gợi ý luyện tập cụ thể, ngắn gọn.")
            gen = generate_text(prompt, system="Trả lời bằng tiếng Việt, ngắn gọn, khích lệ.")
            feedback_text = gen["text"]; provider_used = gen["provider"]
        except Exception:
            feedback_text = None  # offline / providers down — geometry result still valid
    a = models.Assessment(submission_id=sid, exercise_id=ex.id,
                          rubric_version=rubric.version if rubric else "v1",
                          model_version="local-cv-v1" if not feedback_text else f"local-cv-v1+{provider_used}",
                          provider="local-cv" if not feedback_text else f"local-cv+{provider_used}",
                          status=result["status"], overall_score=result["overall_score"],
                          confidence=result["confidence"], strengths=result["strengths"],
                          weaknesses=result["weaknesses"], corrections=result["corrections"],
                          recommendations=result["recommendations"],
                          failure_reason=result.get("failure_reason"), feedback_text=feedback_text,
                          processing_metadata={"details": result.get("details", {}), "text_provider": provider_used})
    db.add(a); db.flush()
    for cr in result["criterion_results"]:
        db.add(models.AssessmentCriterionResult(assessment_id=a.id, criterion_id=cr["criterion_id"],
                                                name=cr.get("name"), score=cr["score"], weight=cr["weight"], feedback=cr.get("feedback")))
    for an in result["annotations"]:
        db.add(models.AssessmentAnnotation(assessment_id=a.id, kind=an["kind"], x=an["x"], y=an["y"],
                                           x2=an.get("x2"), y2=an.get("y2"), label=an.get("label"),
                                           error_type=an.get("error_type"), severity=an.get("severity", "medium"), fix=an.get("fix")))
    s.status = "assessed" if result["status"] == "completed" else "failed"
    job.state = "COMPLETED"; job.completed_at = datetime.utcnow()
    db.commit(); db.refresh(a)
    validate_assessment_schema({"assessment_id": a.id, "submission_id": a.submission_id,
                                "exercise_id": a.exercise_id, "rubric_version": a.rubric_version,
                                "status": a.status, "overall_score": a.overall_score,
                                "criterion_results": [{"criterion_id": c.criterion_id, "weight": c.weight} for c in a.criterion_results],
                                "confidence": a.confidence})
    return a

@router.get("/assessments/{aid}", response_model=schemas.AssessmentOut)
def get_assessment(aid: int, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    a = db.query(models.Assessment).filter(models.Assessment.id == aid).first()
    if not a: raise HTTPException(404, "Assessment not found")
    check_ownership(user, a.submission.owner_id)
    return a

@router.get("/submissions/{sid}/corrections")
def get_corrections(sid: int, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    s = db.query(models.Submission).filter(models.Submission.id == sid).first()
    if not s: raise HTTPException(404, "Submission not found")
    check_ownership(user, s.owner_id)
    a = db.query(models.Assessment).filter(models.Assessment.submission_id == sid).order_by(models.Assessment.id.desc()).first()
    if not a: raise HTTPException(404, "No assessment yet for this submission")
    return {"assessment_id": a.id, "overall_score": a.overall_score, "confidence": a.confidence,
            "annotations": [{"kind": an.kind, "x": an.x, "y": an.y, "x2": an.x2, "y2": an.y2,
                             "label": an.label, "error_type": an.error_type, "severity": an.severity, "fix": an.fix}
                            for an in a.annotations],
            "corrections": a.corrections, "strengths": a.strengths, "weaknesses": a.weaknesses,
            "note": "Annotations are on a separate overlay layer; the original artwork is never overwritten."}
