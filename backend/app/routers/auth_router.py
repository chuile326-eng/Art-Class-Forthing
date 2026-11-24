from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from ..auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=schemas.UserOut, status_code=201)
def register(data: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == data.email).first():
        raise HTTPException(400, "Email already registered")
    if db.query(models.User).filter(models.User.username == data.username).first():
        raise HTTPException(400, "Username taken")
    if data.role not in ("learner", "instructor"):
        raise HTTPException(400, "role must be learner or instructor (admin created by seed/admin)")
    u = models.User(email=data.email, username=data.username, hashed_password=hash_password(data.password), role=data.role)
    db.add(u); db.commit(); db.refresh(u)
    db.add(models.UserProfile(user_id=u.id, display_name=data.username)); db.commit()
    db.add(models.AuditLog(user_id=u.id, action="register", entity="user", entity_id=u.id)); db.commit()
    return u

@router.post("/login", response_model=schemas.Token)
def login(data: schemas.UserLogin, db: Session = Depends(get_db)):
    u = db.query(models.User).filter(models.User.email == data.email).first()
    if not u or not verify_password(data.password, u.hashed_password):
        raise HTTPException(401, "Invalid email or password")
    return {"access_token": create_access_token({"sub": str(u.id), "role": u.role}), "token_type": "bearer"}

@router.get("/me", response_model=schemas.UserOut)
def me(user: models.User = Depends(get_current_user)):
    return user

@router.post("/forgot-password")
def forgot(data: dict, db: Session = Depends(get_db)):
    # No email configured: return honest status, do not pretend an email was sent.
    return {"status": "not_configured", "detail": "Email sending is not configured in this deployment; contact an admin to reset your password."}
