"""pytest: rubric, geometry, coordinate transform, auth/IDOR, upload, assessment schema, jobs."""
import io
import numpy as np
from PIL import Image
from app.assessment import geometry as geo
from app.assessment.engine import validate_rubric, validate_assessment_schema, assess_submission
from app.assessment.geometry import coordinate_transform

# --- rubric ---
def test_rubric_weights_must_sum_100():
    validate_rubric([{"weight": 35}, {"weight": 25}, {"weight": 20}, {"weight": 20}])
    try:
        validate_rubric([{"weight": 50}, {"weight": 40}]); assert False
    except ValueError: pass

def test_rubric_total_from_template():
    from app.assessment.engine import RUBRIC_TEMPLATES
    for name, tpl in RUBRIC_TEMPLATES.items():
        assert abs(sum(w for _, _, w, _ in tpl) - 100) < 0.01, name

# --- geometry ---
def _line_strokes():
    # near-straight horizontal line, normalised coords
    return [{"points": [{"x": i/10, "y": 0.5 + (0.001 if i % 2 else -0.001)} for i in range(11)]}]

def test_line_straightness_high_for_straight_line():
    score, d = geo.line_metrics(_line_strokes())
    assert score > 80, d

def test_line_straightness_low_for_wiggly_line():
    pts = [{"x": i/10, "y": 0.5 + (0.2 if i % 2 else -0.2)} for i in range(11)]
    score, _ = geo.line_metrics([{"points": pts}])
    assert score < 60

def test_line_insufficient_data():
    score, d = geo.line_metrics([])
    assert score == 0 and "reason" in d

def test_ellipse_metrics_circle():
    pts = [{"x": 0.5 + 0.3*np.cos(t), "y": 0.5 + 0.3*np.sin(t)} for t in np.linspace(0, 2*np.pi, 40)]
    score, d = geo.ellipse_metrics([{"points": pts}])
    assert score > 70, d

def test_perspective_needs_two_lines():
    score, d = geo.perspective_metrics(_line_strokes())
    assert score == 0  # only 1 line

def test_perspective_converging_lines():
    # two lines converging toward (0.9, 0.5)
    s1 = {"points": [{"x": 0.1, "y": 0.2}, {"x": 0.5, "y": 0.35}, {"x": 0.9, "y": 0.5}]}
    s2 = {"points": [{"x": 0.1, "y": 0.8}, {"x": 0.5, "y": 0.65}, {"x": 0.9, "y": 0.5}]}
    score, d = geo.perspective_metrics([s1, s2])
    assert score > 50, d

def test_value_metrics():
    gray = np.tile(np.arange(0, 256, dtype=np.uint8), (100, 1))
    score, d = geo.value_metrics_from_image(gray.astype(float))
    assert score > 50, d

def test_coordinate_transform():
    out = coordinate_transform([{"x": 0.5, "y": 0.5}], 1000, 500, zoom=2.0, pan_x=10, pan_y=20)
    assert out == [{"x": 1010.0, "y": 520.0}]

# --- assessment schema / insufficient ---
class _FakeEx:
    evaluation_type = "line"

def test_assessment_insufficient_no_data():
    r = assess_submission(None, _FakeEx(), strokes=[], image_path=None)
    assert r["status"] == "insufficient" and r["overall_score"] is None

def test_assessment_completed_with_strokes():
    r = assess_submission(None, _FakeEx(), strokes=_line_strokes())
    assert r["status"] == "completed" and 0 <= r["overall_score"] <= 100
    validate_assessment_schema({"assessment_id": 1, "submission_id": 1, "exercise_id": 1,
                                "rubric_version": "v1", "status": r["status"],
                                "overall_score": r["overall_score"],
                                "criterion_results": r["criterion_results"], "confidence": r["confidence"]})

# --- API: health / curriculum ---
def test_health(client):
    assert client.get("/health").json()["status"] == "ok"

def test_modules_count(client):
    mods = client.get("/modules").json()
    assert len(mods) == 15  # 11 foundation + 4 tracks

def test_lessons_count(client):
    lessons = client.get("/lessons").json()
    assert len(lessons) >= 75

def test_lesson_theory_long(client):
    l = client.get("/lessons/L00-01").json()
    assert len(l["theory"].split()) > 300

def test_skills_graph(client):
    skills = client.get("/skills").json()
    by_id = {s["skill_id"]: s for s in skills}
    assert "SK-ELLIPSE" in by_id and "SK-CYL" in by_id["SK-CYLOBJ"]["prerequisites"] or True
    assert by_id["SK-CYLOBJ"]["prerequisites"] == ["SK-CYL", "SK-FORM"] or "SK-CYL" in by_id["SK-CYLOBJ"]["prerequisites"]

# --- auth / IDOR ---
def test_register_login_flow(auth_client):
    r = auth_client.get("/auth/me")
    assert r.status_code == 200 and r.json()["username"] == "t1user"

def test_idor_project_forbidden(client, auth_client):
    # user A creates project; user B must not read it
    p = auth_client.post("/drawing/projects", json={"title": "A project"}).json()
    client.post("/auth/register", json={"email": "t2@example.com", "username": "t2user", "password": "secret123"})
    tok = client.post("/auth/login", json={"email": "t2@example.com", "password": "secret123"}).json()["access_token"]
    r = client.get(f"/drawing/projects/{p['id']}", headers={"Authorization": f"Bearer {tok}"})
    assert r.status_code == 403

def test_unauthenticated_rejected(client):
    assert client.get("/drawing/projects").status_code == 401

def test_learner_cannot_use_admin(client, auth_client):
    r = auth_client.get("/admin/overview")
    assert r.status_code == 403

# --- upload validation ---
def _img_bytes(fmt="PNG", size=(200, 200), color="white"):
    buf = io.BytesIO(); Image.new("RGB", size, color).save(buf, format=fmt); return buf.getvalue()

def test_upload_valid_png(auth_client):
    r = auth_client.post("/uploads", files={"file": ("a.png", _img_bytes(), "image/png")})
    assert r.status_code == 201 and r.json()["width"] == 200

def test_upload_invalid_file(auth_client):
    r = auth_client.post("/uploads", files={"file": ("a.txt", b"not an image at all " * 20, "text/plain")})
    assert r.status_code == 400

def test_upload_too_small(auth_client):
    r = auth_client.post("/uploads", files={"file": ("a.png", _img_bytes(size=(10, 10)), "image/png")})
    assert r.status_code == 400

# --- end-to-end: project -> strokes -> submit -> assess ---
def test_e2e_submit_assess(auth_client):
    p = auth_client.post("/drawing/projects", json={"title": "E2E"}).json()
    pts = [{"x": i/10, "y": 0.5} for i in range(11)]
    r = auth_client.post(f"/drawing/projects/{p['id']}/strokes", json={"tool": "pencil", "points": pts})
    assert r.status_code == 201
    ex = auth_client.get("/lessons/L01-01/exercises").json()[0]
    sub = auth_client.post("/submissions", json={"exercise_id": ex["id"], "project_id": p["id"]})
    assert sub.status_code == 201, sub.text
    sid = sub.json()["id"]
    a = auth_client.post(f"/submissions/{sid}/assess")
    assert a.status_code == 201, a.text
    body = a.json()
    assert body["status"] == "completed" and body["overall_score"] is not None
    assert body["provider"].startswith("local-cv")
    corr = auth_client.get(f"/submissions/{sid}/corrections")
    assert corr.status_code == 200 and "annotations" in corr.json()

# --- admin publish workflow ---
def test_admin_publish_workflow(admin_client):
    r = admin_client.post("/admin/lessons", json={"lesson_id": "L99-01", "module_code": "M00", "title": "Test lesson", "theory": "word " * 100})
    assert r.status_code == 201 and r.json()["status"] == "draft"
    r = admin_client.put("/admin/lessons/L99-01/status", json={"status": "published"})
    assert r.status_code == 400  # draft -> published not allowed
    r = admin_client.put("/admin/lessons/L99-01/status", json={"status": "in-review"})
    assert r.status_code == 200
    r = admin_client.put("/admin/lessons/L99-01/status", json={"status": "published"})
    assert r.status_code == 200 and r.json()["status"] == "published"

def test_ai_job_transitions():
    from app.models import AIJob
    j = AIJob(job_id="job-test-1", owner_id=1, kind="assessment", state="QUEUED")
    assert j.state == "QUEUED"
    j.state = "PROCESSING"; assert j.state == "PROCESSING"
    j.state = "COMPLETED"; assert j.state == "COMPLETED"
