"""JWT auth, password hashing, roles, ownership checks."""
import os
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from .database import get_db
from . import models

SECRET_KEY = os.environ.get("SECRET_KEY")
if not SECRET_KEY:
    if os.environ.get("ENV", "development") == "production":
        raise RuntimeError("SECRET_KEY env var is required in production")
    # Dev-only fallback; tokens issued with it must never be trusted in production.
    SECRET_KEY = "dev-secret-change-me-drawpath"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
ROLES = ["guest", "learner", "instructor", "admin"]

def hash_password(p): return pwd_context.hash(p)
def verify_password(p, h): return pwd_context.verify(p, h)

def create_access_token(data: dict, expires_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES):
    to_encode = dict(data); to_encode["exp"] = datetime.utcnow() + timedelta(minutes=expires_minutes)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    cred = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials",
                         headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
    except (JWTError, ValueError, TypeError):
        raise cred
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user or not user.is_active: raise cred
    return user

def require_role(*roles):
    def _check(user: models.User = Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(status_code=403, detail=f"Requires role: {roles}")
        return user
    return _check

def check_ownership(user: models.User, owner_id: int):
    """IDOR guard: only owner or admin may access."""
    if user.role != "admin" and user.id != owner_id:
        raise HTTPException(status_code=403, detail="Forbidden: not the owner")
