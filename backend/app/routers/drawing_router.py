from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from ..auth import get_current_user, check_ownership

router = APIRouter(prefix="/drawing", tags=["drawing"])

@router.post("/projects", status_code=201)
def create_project(data: schemas.ProjectIn, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = models.DrawingProject(owner_id=user.id, title=data.title, lesson_id=data.lesson_id,
                              canvas_width=data.canvas_width, canvas_height=data.canvas_height)
    db.add(p); db.commit(); db.refresh(p)
    db.add(models.DrawingLayer(project_id=p.id, name="Layer 1", order_index=0)); db.commit()
    return {"id": p.id, "title": p.title, "canvas_width": p.canvas_width, "canvas_height": p.canvas_height, "version": p.version}

@router.get("/projects")
def list_projects(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return [{"id": p.id, "title": p.title, "updated_at": str(p.updated_at)} for p in
            db.query(models.DrawingProject).filter(models.DrawingProject.owner_id == user.id).all()]

def _get_project(pid, user, db):
    p = db.query(models.DrawingProject).filter(models.DrawingProject.id == pid).first()
    if not p: raise HTTPException(404, "Project not found")
    check_ownership(user, p.owner_id)
    return p

@router.get("/projects/{pid}")
def get_project(pid: int, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = _get_project(pid, user, db)
    return {"id": p.id, "title": p.title, "canvas_width": p.canvas_width, "canvas_height": p.canvas_height,
            "version": p.version,
            "layers": [{"id": l.id, "name": l.name, "order_index": l.order_index, "visible": l.visible, "locked": l.locked} for l in p.layers],
            "strokes": [{"id": s.id, "layer_id": s.layer_id, "tool": s.tool, "color": s.color, "width": s.width, "points": s.points} for s in p.strokes]}

@router.put("/projects/{pid}")
def update_project(pid: int, data: dict, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = _get_project(pid, user, db)
    if "title" in data: p.title = data["title"]
    if "data" in data: p.data = data["data"]
    p.version += 1
    db.commit()
    return {"id": p.id, "version": p.version}

@router.delete("/projects/{pid}")
def delete_project(pid: int, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = _get_project(pid, user, db)
    db.delete(p); db.commit()
    return {"deleted": pid}

@router.post("/projects/{pid}/layers", status_code=201)
def add_layer(pid: int, data: schemas.LayerIn, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = _get_project(pid, user, db)
    l = models.DrawingLayer(project_id=p.id, name=data.name, order_index=data.order_index, visible=data.visible, locked=data.locked, opacity=data.opacity)
    db.add(l); db.commit(); db.refresh(l)
    return {"id": l.id, "name": l.name}

@router.put("/projects/{pid}/layers/{lid}")
def update_layer(pid: int, lid: int, data: dict, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = _get_project(pid, user, db)
    l = db.query(models.DrawingLayer).filter(models.DrawingLayer.id == lid, models.DrawingLayer.project_id == p.id).first()
    if not l: raise HTTPException(404, "Layer not found")
    for k in ("name", "order_index", "visible", "locked", "opacity"):
        if k in data: setattr(l, k, data[k])
    db.commit()
    return {"id": l.id, "name": l.name, "visible": l.visible, "locked": l.locked}

@router.delete("/projects/{pid}/layers/{lid}")
def delete_layer(pid: int, lid: int, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = _get_project(pid, user, db)
    l = db.query(models.DrawingLayer).filter(models.DrawingLayer.id == lid, models.DrawingLayer.project_id == p.id).first()
    if not l: raise HTTPException(404, "Layer not found")
    db.delete(l); db.commit()
    return {"deleted": lid}

@router.post("/projects/{pid}/strokes", status_code=201)
def add_stroke(pid: int, data: schemas.StrokeIn, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = _get_project(pid, user, db)
    if not data.points or len(data.points) < 1:
        raise HTTPException(400, "Stroke needs at least 1 point")
    for pt in data.points:
        if not (0 <= pt.get("x", -1) <= 1 and 0 <= pt.get("y", -1) <= 1):
            raise HTTPException(400, "Stroke points must be normalised 0..1")
    s = models.DrawingStroke(project_id=p.id, layer_id=data.layer_id, tool=data.tool, color=data.color,
                             width=data.width, opacity=data.opacity, points=data.points)
    db.add(s); db.commit(); db.refresh(s)
    return {"id": s.id, "points": len(data.points)}

@router.delete("/projects/{pid}/strokes/{sid}")
def delete_stroke(pid: int, sid: int, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = _get_project(pid, user, db)
    s = db.query(models.DrawingStroke).filter(models.DrawingStroke.id == sid, models.DrawingStroke.project_id == p.id).first()
    if not s: raise HTTPException(404, "Stroke not found")
    db.delete(s); db.commit()
    return {"deleted": sid}

@router.get("/projects/{pid}/export")
def export_png(pid: int, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Render strokes to a PNG (PIL) and return as downloadable file."""
    from fastapi.responses import FileResponse
    import os
    from PIL import Image, ImageDraw
    p = _get_project(pid, user, db)
    img = Image.new("RGB", (p.canvas_width, p.canvas_height), "white")
    d = ImageDraw.Draw(img)
    for s in p.strokes:
        pts = [(pt["x"] * p.canvas_width, pt["y"] * p.canvas_height) for pt in s.points]
        if len(pts) >= 2:
            d.line(pts, fill=s.color, width=max(1, int(s.width)), joint="curve")
        elif len(pts) == 1:
            d.ellipse([pts[0][0]-s.width, pts[0][1]-s.width, pts[0][0]+s.width, pts[0][1]+s.width], fill=s.color)
    os.makedirs("uploads", exist_ok=True)
    path = f"uploads/project-{p.id}.png"
    img.save(path)
    return FileResponse(path, media_type="image/png", filename=f"project-{p.id}.png")
