from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    class Config:
        orm_mode = True


class NoteBase(BaseModel):
    original_text: Optional[str]
    translated_text: Optional[str]
    category: Optional[str] = None
    is_pinned: bool = False

class NoteCreate(NoteBase):
    pass

class NoteUpdate(NoteBase):
    pass

class NoteOut(NoteBase):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True
