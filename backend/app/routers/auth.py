from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from ..database import get_db
from ..models import User
from ..auth import hash_password, verify_password, create_token


router = APIRouter(prefix="/auth", tags=["Authentication"])


# ========= Pydantic Models ===============
class RegisterUser(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginUser(BaseModel):
    email: EmailStr
    password: str


# =========== REGISTER ====================
@router.post("/register")
def register(user: RegisterUser, db: Session = Depends(get_db)):
    # Check if email exists
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash password
    hashed_pw = hash_password(user.password)

    # Create new user
    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_pw
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    token = create_token({"user_id": new_user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": new_user.id
    }


# ============= LOGIN ======================
@router.post("/login")
def login(user: LoginUser, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Create token
    token = create_token({"user_id": db_user.id})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": db_user.id
    }
