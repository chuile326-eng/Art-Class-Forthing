"""Geometry evaluators — numpy/PIL, opencv optional (never required at import).

All scores are 0..100. Functions return (score, details dict).
Coordinates are normalised 0..1; helpers convert stroke points.
"""
import math
import numpy as np

try:
    import cv2  # optional
    HAS_CV2 = True
except Exception:
    cv2 = None
    HAS_CV2 = False


def _pts(stroke):
    """stroke points -> Nx2 float array in normalised coords."""
    pts = stroke.get("points", []) if isinstance(stroke, dict) else []
    arr = []
    for p in pts:
        if isinstance(p, dict):
            arr.append([float(p.get("x", 0)), float(p.get("y", 0))])
        elif isinstance(p, (list, tuple)) and len(p) >= 2:
            arr.append([float(p[0]), float(p[1])])
    return np.array(arr, dtype=float) if arr else np.zeros((0, 2))


def all_points(strokes):
    arrs = [_pts(s) for s in (strokes or [])]
    arrs = [a for a in arrs if len(a)]
    return np.concatenate(arrs) if arrs else np.zeros((0, 2))


def line_metrics(strokes):
    """Straightness / deviation / smoothness for line-control exercises."""
    pts = all_points(strokes)
    if len(pts) < 2:
        return 0.0, {"reason": "too few points", "n_points": int(len(pts))}
    # Per-stroke straightness: distance of points from chord vs chord length
    devs, smooth = [], []
    for s in strokes or []:
        a = _pts(s)
        if len(a) < 3:
            continue
        p0, p1 = a[0], a[-1]
        chord = np.linalg.norm(p1 - p0)
        if chord < 1e-6:
            continue
        # perpendicular distance to chord
        v = (p1 - p0) / chord
        rel = a - p0
        perp = np.abs(rel[:, 0] * v[1] - rel[:, 1] * v[0])
        devs.append(float(np.mean(perp) / max(chord, 1e-6)))
        # smoothness: total path length vs chord (1 = perfectly straight/smooth)
        seg = np.linalg.norm(np.diff(a, axis=0), axis=1)
        smooth.append(float(chord / max(seg.sum(), 1e-6)))
    if not devs:
        return 0.0, {"reason": "no usable strokes"}
    mean_dev = float(np.mean(devs))  # fraction of chord length
    straight = max(0.0, 100.0 * (1 - min(mean_dev * 4, 1.0)))
    smooth_score = max(0.0, min(100.0, float(np.mean(smooth)) * 100))
    score = 0.6 * straight + 0.4 * smooth_score
    return round(score, 1), {"mean_deviation_frac": round(mean_dev, 4),
                             "straightness": round(straight, 1), "smoothness": round(smooth_score, 1),
                             "n_strokes": len(strokes or [])}


def ellipse_metrics(strokes):
    """Fit ellipse (algebraic, via covariance) and measure radial error."""
    pts = all_points(strokes)
    if len(pts) < 8:
        return 0.0, {"reason": "too few points for ellipse", "n_points": int(len(pts))}
    c = pts.mean(axis=0)
    centered = pts - c
    cov = np.cov(centered.T)
    vals, vecs = np.linalg.eigh(cov)
    vals = np.maximum(vals, 1e-9)
    # semi-axes from covariance (approx)
    axes = 2 * np.sqrt(vals)
    if axes[0] < 1e-6:
        return 0.0, {"reason": "degenerate"}
    # radial distance in ellipse-normalised space: should be ~1 for all points
    # transform to eigenbasis, divide by axes
    rot = centered @ vecs
    norm_r = np.sqrt((rot[:, 0] / axes[1]) ** 2 + (rot[:, 1] / axes[0]) ** 2) * 2
    # norm_r ~ 1 for points on fitted ellipse (factor 2 cancels axes definition)
    err = float(np.mean(np.abs(norm_r - np.median(norm_r))))
    score = max(0.0, 100.0 * (1 - min(err * 3, 1.0)))
    return round(score, 1), {"radial_error": round(err, 4),
                             "axes": [round(float(a), 4) for a in axes],
                             "centre": [round(float(v), 4) for v in c]}


def shape_metrics(strokes):
    """Generic shape accuracy: closure + aspect + ellipse/line blend."""
    pts = all_points(strokes)
    if len(pts) < 4:
        return 0.0, {"reason": "too few points"}
    # closure: start/end distance vs perimeter
    perim = float(np.sum(np.linalg.norm(np.diff(pts, axis=0), axis=1))) if len(pts) > 1 else 0
    gap = float(np.linalg.norm(pts[-1] - pts[0])) if len(pts) else 0
    closure = max(0.0, 100.0 * (1 - min(gap / max(perim, 1e-6) * 5, 1.0)))
    ell, _ = ellipse_metrics(strokes)
    return round(0.5 * closure + 0.5 * ell, 1), {"closure": round(closure, 1),
                                                 "ellipse_score": ell, "perimeter": round(perim, 4)}


def perspective_metrics(strokes):
    """Convergence: fit lines per stroke (least squares), measure angle spread
    toward a common vanishing direction. Returns score + estimated VP."""
    lines = []
    for s in strokes or []:
        a = _pts(s)
        if len(a) < 3:
            continue
        # PCA direction = dominant line direction
        c = a.mean(axis=0)
        _, _, vt = np.linalg.svd(a - c, full_matrices=False)
        d = vt[0]
        lines.append((c, d))
    if len(lines) < 2:
        return 0.0, {"reason": "need >=2 long strokes for perspective", "n_lines": len(lines)}
    # Pairwise intersections of lines; spread of intersections = convergence quality
    pts = []
    for i in range(len(lines)):
        for j in range(i + 1, len(lines)):
            (c1, d1), (c2, d2) = lines[i], lines[j]
            A = np.column_stack([d1, -d2])
            if abs(np.linalg.det(A)) < 1e-6:
                continue
            t = np.linalg.solve(A, c2 - c1)
            pts.append(c1 + t[0] * d1)
    if not pts:
        return 0.0, {"reason": "lines are parallel — no vanishing point"}
    arr = np.array(pts)
    spread = float(np.std(arr, axis=0).mean())
    # spread small relative to canvas (0..1) => good convergence
    score = max(0.0, 100.0 * (1 - min(spread * 4, 1.0)))
    return round(score, 1), {"vp_estimate": [round(float(v), 3) for v in arr.mean(axis=0)],
                             "vp_spread": round(spread, 4), "n_intersections": len(pts)}


def value_metrics_from_image(gray: np.ndarray):
    """Value/shading: histogram spread, midtone coverage, highlight/shadow presence."""
    if gray.size == 0:
        return 0.0, {"reason": "empty image"}
    hist = np.histogram(gray, bins=10, range=(0, 255))[0].astype(float)
    hist /= max(hist.sum(), 1)
    # coverage: fraction of value bands with >2% pixels
    coverage = float((hist > 0.02).mean())
    # contrast: std of values
    contrast = float(gray.std()) / 128.0
    score = max(0.0, min(100.0, 100 * (0.6 * coverage + 0.4 * min(contrast, 1.0))))
    return round(score, 1), {"value_coverage": round(coverage, 3),
                             "contrast": round(contrast, 3),
                             "histogram": [round(float(v), 3) for v in hist]}


def image_edge_stats(image_path: str):
    """Edge/contour stats from an uploaded image (PIL; cv2 if available)."""
    from PIL import Image
    img = Image.open(image_path).convert("L")
    arr = np.asarray(img, dtype=float)
    gy, gx = np.gradient(arr)
    mag = np.sqrt(gx ** 2 + gy ** 2)
    edge_frac = float((mag > 30).mean())
    blur = float(mag.mean())
    mean_v = float(arr.mean()); std_v = float(arr.std())
    result = {"edge_fraction": round(edge_frac, 4), "mean_brightness": round(mean_v, 1),
              "brightness_std": round(std_v, 1), "sharpness_mean_grad": round(blur, 2),
              "width": img.width, "height": img.height}
    if HAS_CV2:
        try:
            edges = cv2.Canny(np.asarray(img, dtype=np.uint8), 50, 150)
            contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            result["n_contours"] = len(contours)
            result["largest_contour_area"] = float(max((cv2.contourArea(c) for c in contours), default=0))
        except Exception:
            pass
    return result


def proportion_metrics(strokes):
    """Proportion: bounding-box aspect vs stroke-count balance; simple but honest."""
    pts = all_points(strokes)
    if len(pts) < 4:
        return 0.0, {"reason": "too few points"}
    w = float(pts[:, 0].max() - pts[:, 0].min()); h = float(pts[:, 1].max() - pts[:, 1].min())
    if w < 1e-6 or h < 1e-6:
        return 0.0, {"reason": "degenerate bounding box"}
    # Symmetry proxy: left/right point density balance
    cx = pts[:, 0].mean()
    left = float((pts[:, 0] < cx).mean()); right = 1 - left
    balance = 100 * (1 - abs(left - right))
    return round(balance, 1), {"bbox_w": round(w, 3), "bbox_h": round(h, 3),
                               "aspect": round(w / h, 3), "left_right_balance": round(balance, 1)}


def coordinate_transform(points, canvas_w, canvas_h, zoom=1.0, pan_x=0.0, pan_y=0.0):
    """Logical (0..1) -> screen coords. Pure function, unit-tested."""
    out = []
    for p in points:
        x = (p["x"] * canvas_w * zoom) + pan_x
        y = (p["y"] * canvas_h * zoom) + pan_y
        out.append({"x": round(x, 2), "y": round(y, 2)})
    return out


EVALUATORS = {
    "line": line_metrics,
    "shape": shape_metrics,
    "ellipse": ellipse_metrics,
    "proportion": proportion_metrics,
    "perspective": perspective_metrics,
    "form": shape_metrics,
    "value": None,  # image-based, handled in engine
    "color": None,
    "anatomy": proportion_metrics,
    "composition": proportion_metrics,
    "creative": None,
}
