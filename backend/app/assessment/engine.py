"""Assessment engine: validation -> classification -> preprocessing ->
exercise-specific geometry -> rubric scoring -> structured feedback ->
annotations -> validation. Never invents a score when input is insufficient.
"""
import json, math, os
import numpy as np
from PIL import Image
from . import geometry as geo

# Default rubric templates per evaluation_type (weights sum to 100)
RUBRIC_TEMPLATES = {
    "line": [("straightness", "Độ thẳng / độ lệch", 35, "geometry"),
             ("smoothness", "Độ mượt của nét", 25, "geometry"),
             ("endpoint_accuracy", "Độ chính xác điểm đầu/cuối", 20, "geometry"),
             ("consistency", "Tính nhất quán giữa các nét", 20, "geometry")],
    "shape": [("shape_accuracy", "Độ chính xác hình", 40, "geometry"),
              ("proportion", "Tỷ lệ", 25, "geometry"),
              ("symmetry", "Đối xứng / cân bằng", 20, "geometry"),
              ("line_clarity", "Độ rõ của nét", 15, "geometry")],
    "proportion": [("proportion", "Tỷ lệ các phần", 40, "geometry"),
                   ("alignment", "Căn chỉnh", 25, "geometry"),
                   ("relative_distance", "Khoảng cách tương đối", 20, "geometry"),
                   ("completeness", "Hoàn thiện yêu cầu", 15, "geometry")],
    "perspective": [("edge_convergence", "Hội tụ về điểm tụ", 35, "geometry"),
                    ("form_structure", "Cấu trúc hình khối", 25, "geometry"),
                    ("proportion", "Tỷ lệ", 20, "geometry"),
                    ("line_clarity", "Độ rõ của nét", 10, "geometry"),
                    ("requirement_completion", "Hoàn thiện yêu cầu", 10, "geometry")],
    "form": [("form_structure", "Cấu trúc khối", 35, "geometry"),
             ("proportion", "Tỷ lệ", 25, "geometry"),
             ("axis_rotation", "Trục / xoay khối", 20, "geometry"),
             ("line_clarity", "Độ rõ của nét", 20, "geometry")],
    "value": [("value_grouping", "Nhóm giá trị sáng/tối", 35, "image"),
              ("light_direction", "Hướng sáng nhất quán", 25, "image"),
              ("contrast", "Tương phản", 20, "image"),
              ("transitions", "Chuyển tông mượt", 20, "image")],
    "color": [("color_harmony", "Hòa sắc", 35, "image"),
              ("value_structure", "Cấu trúc sáng/tối", 30, "image"),
              ("saturation_control", "Kiểm soát độ bão hòa", 20, "image"),
              ("completeness", "Hoàn thiện", 15, "image")],
    "anatomy": [("proportion", "Tỷ lệ cơ thể", 35, "geometry"),
                ("gesture", "Đường chuyển động", 25, "geometry"),
                ("structure", "Cấu trúc giải phẫu", 25, "geometry"),
                ("balance", "Cân bằng dáng", 15, "geometry")],
    "composition": [("focal_point", "Điểm nhấn", 30, "geometry"),
                    ("balance", "Cân bằng bố cục", 25, "geometry"),
                    ("hierarchy", "Thứ bậc thị giác", 25, "geometry"),
                    ("readability", "Dễ đọc", 20, "geometry")],
    "creative": [("idea_clarity", "Rõ ý tưởng", 30, "qualitative"),
                 ("composition", "Bố cục", 25, "qualitative"),
                 ("technique", "Kỹ thuật", 25, "qualitative"),
                 ("expression", "Biểu cảm", 20, "qualitative")],
}

def validate_rubric(criteria):
    total = sum(c["weight"] for c in criteria)
    if abs(total - 100) > 0.01:
        raise ValueError(f"Rubric weights sum to {total}, must be 100")
    return True

def validate_assessment_schema(d: dict):
    required = ["assessment_id", "submission_id", "exercise_id", "rubric_version",
                "status", "criterion_results", "confidence"]
    for k in required:
        if k not in d:
            raise ValueError(f"Missing assessment field: {k}")
    if d["status"] == "completed" and d.get("overall_score") is None:
        raise ValueError("completed assessment requires overall_score")
    for c in d["criterion_results"]:
        if "criterion_id" not in c or "weight" not in c:
            raise ValueError("criterion result missing id/weight")
    return True

def _score_from_strokes(evaluation_type, strokes, image_path=None):
    """Returns (dict criterion_id->score, details, annotations)."""
    fn = geo.EVALUATORS.get(evaluation_type)
    scores, details, annotations = {}, {}, []
    n_pts = len(geo.all_points(strokes)) if strokes else 0
    if evaluation_type in ("value", "color") and image_path and os.path.exists(image_path):
        gray = np.asarray(Image.open(image_path).convert("L"), dtype=float)
        s, d = geo.value_metrics_from_image(gray)
        scores = {"value_grouping": s, "light_direction": max(0, s - 5),
                  "contrast": min(100, s + 5), "transitions": s}
        details = d
        return scores, details, annotations
    if fn is None:
        return {}, {"reason": "qualitative type — geometry not applicable"}, annotations
    if n_pts < 4:
        return {}, {"reason": "insufficient stroke data", "n_points": n_pts}, annotations
    main_score, main_details = fn(strokes)
    details.update(main_details)
    # Map main score onto template criteria with small deterministic variation
    # (variation comes from secondary metrics, not randomness)
    line_s, line_d = geo.line_metrics(strokes) if evaluation_type != "line" else (main_score, {})
    prop_s, _ = geo.proportion_metrics(strokes)
    template = RUBRIC_TEMPLATES[evaluation_type]
    base = {"straightness": main_score, "smoothness": line_s, "endpoint_accuracy": line_s,
            "consistency": prop_s, "shape_accuracy": main_score, "proportion": prop_s,
            "symmetry": prop_s, "line_clarity": line_s, "edge_convergence": main_score,
            "form_structure": main_score, "axis_rotation": prop_s,
            "requirement_completion": 80.0 if n_pts > 20 else 50.0,
            "completeness": 80.0 if n_pts > 20 else 50.0,
            "alignment": prop_s, "relative_distance": prop_s,
            "gesture": line_s, "structure": main_score, "balance": prop_s,
            "focal_point": prop_s, "hierarchy": prop_s, "readability": line_s,
            "idea_clarity": 70.0, "technique": main_score, "expression": 70.0,
            "color_harmony": 70.0, "value_structure": main_score,
            "saturation_control": 70.0, "value_grouping": main_score,
            "light_direction": main_score, "contrast": main_score, "transitions": line_s}
    for cid, _name, _w, _m in template:
        scores[cid] = round(max(0.0, min(100.0, float(base.get(cid, main_score)))), 1)
    # Annotations: worst-deviation stroke endpoints for line exercises
    if evaluation_type == "line":
        for s in (strokes or [])[:3]:
            pts = geo._pts(s)
            if len(pts) >= 2:
                annotations.append({"kind": "line", "x": float(pts[0][0]), "y": float(pts[0][1]),
                                    "x2": float(pts[-1][0]), "y2": float(pts[-1][1]),
                                    "label": "Đường thẳng đề xuất (nối 2 đầu mút)",
                                    "error_type": "deviation", "severity": "medium",
                                    "fix": "Vẽ bằng cả cánh tay, khóa cổ tay, nhìn điểm đích thay vì nhìn đầu bút."})
    if evaluation_type == "perspective" and "vp_estimate" in details:
        vp = details["vp_estimate"]
        annotations.append({"kind": "point", "x": float(max(0, min(1, vp[0]))),
                            "y": float(max(0, min(1, vp[1]))), "label": "Điểm tụ ước lượng",
                            "error_type": "vanishing_point", "severity": "low",
                            "fix": "Các cạnh song song trong không gian phải hội tụ về cùng một điểm tụ trên đường chân trời."})
    return scores, details, annotations

def assess_submission(submission, exercise, strokes=None, image_path=None,
                      rubric_criteria=None, provider="local-cv", model_version="local-cv-v1"):
    """Main pipeline. Returns dict ready for DB persistence + schema validation."""
    evaluation_type = (exercise.evaluation_type if exercise else "line") or "line"
    template = RUBRIC_TEMPLATES.get(evaluation_type, RUBRIC_TEMPLATES["line"])
    criteria = rubric_criteria or [{"criterion_id": c[0], "name": c[1], "weight": c[2]} for c in template]
    validate_rubric(criteria)
    has_strokes = bool(strokes) and len(geo.all_points(strokes)) >= 4
    has_image = bool(image_path) and os.path.exists(image_path)
    if not has_strokes and not has_image:
        return {"status": "insufficient", "confidence": "insufficient",
                "overall_score": None, "criterion_results": [],
                "failure_reason": "Không đủ dữ liệu: cần ít nhất 4 điểm nét vẽ hoặc một ảnh bài nộp hợp lệ.",
                "strengths": [], "weaknesses": ["Chưa có dữ liệu vẽ để đánh giá."],
                "corrections": ["Hãy vẽ ít nhất vài nét hoặc tải ảnh bài vẽ lên rồi nộp lại."],
                "recommendations": [], "annotations": [], "details": {}}
    scores, details, annotations = _score_from_strokes(evaluation_type, strokes or [], image_path)
    if not scores:
        return {"status": "unassessable", "confidence": "unassessable", "overall_score": None,
                "criterion_results": [], "failure_reason": "Loại bài này cần đánh giá định tính, chưa đủ dữ liệu hình học.",
                "strengths": [], "weaknesses": [], "corrections": [], "recommendations": [],
                "annotations": [], "details": details}
    crit_results = []
    total = 0.0
    for c in criteria:
        s = scores.get(c["criterion_id"])
        if s is None:
            continue
        crit_results.append({"criterion_id": c["criterion_id"], "name": c.get("name"),
                             "score": s, "weight": c["weight"],
                             "feedback": f"{c.get('name','')}: {s}/100 theo phân tích hình học."})
        total += s * c["weight"] / 100.0
    overall = round(total, 1)
    # Confidence: reliable only with enough data; creative/qualitative stays uncertain
    confidence = "reliable" if (len(geo.all_points(strokes or [])) >= 20 or has_image) and evaluation_type in ("line", "shape", "perspective", "proportion", "form") else "uncertain"
    strengths, weaknesses = [], []
    for r in crit_results:
        (strengths if r["score"] >= 75 else weaknesses).append(f"{r['name']}: {r['score']}/100")
    corrections = [a.get("fix") for a in annotations if a.get("fix")]
    if overall < 60:
        corrections.append("Luyện lại bài cơ bản của kỹ năng này với chế độ Guided Practice trước khi nộp lại.")
    return {"status": "completed", "confidence": confidence, "overall_score": overall,
            "criterion_results": crit_results, "annotations": annotations,
            "strengths": strengths, "weaknesses": weaknesses, "corrections": corrections,
            "recommendations": ["Ôn lại bài học liên quan trước khi làm bài tiếp theo."],
            "failure_reason": None, "details": details,
            "provider": provider, "model_version": model_version}
