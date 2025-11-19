from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/notes", tags=["Notes"])

FAKE_USER_ID = 1  # replace with JWT later

@router.post("/", response_model=schemas.NoteOut)
def create_note(data: schemas.NoteCreate, db: Session = Depends(get_db)):
    note = models.Note(user_id=FAKE_USER_ID, **data.dict())
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.get("/", response_model=list[schemas.NoteOut])
def list_notes(db: Session = Depends(get_db)):
    return db.query(models.Note).filter(models.Note.user_id == FAKE_USER_ID).all()
