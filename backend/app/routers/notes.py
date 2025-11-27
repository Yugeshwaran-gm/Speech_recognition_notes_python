from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/notes", tags=["Notes"])

FAKE_USER_ID = 1  # Replace with JWT later


# ------------------------------------------
# Create Note
# ------------------------------------------
@router.post("/", response_model=schemas.NoteOut)
def create_note(data: schemas.NoteCreate, db: Session = Depends(get_db)):
    note = models.Note(user_id=FAKE_USER_ID, **data.dict())
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


# ------------------------------------------
# List Notes (No Pagination)
# ------------------------------------------
@router.get("/", response_model=list[schemas.NoteOut])
def list_notes(db: Session = Depends(get_db)):
    notes = db.query(models.Note).filter(models.Note.user_id == FAKE_USER_ID).all()
    return notes


# ------------------------------------------
# Pagination: /notes/paginated?page=1&limit=10
# ------------------------------------------
@router.get("/paginated")
def get_notes(page: int = 1, limit: int = 10, db: Session = Depends(get_db)):
    skip = (page - 1) * limit

    notes = (
        db.query(models.Note)
        .filter(models.Note.user_id == FAKE_USER_ID)
        .offset(skip)
        .limit(limit)
        .all()
    )

    total = db.query(models.Note).filter(models.Note.user_id == FAKE_USER_ID).count()

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "notes": notes,
    }


# ------------------------------------------
# Search Notes: /notes/search?q=meeting
# ------------------------------------------
@router.get("/search")
def search_notes(q: str, db: Session = Depends(get_db)):
    results = (
        db.query(models.Note)
        .filter(
            models.Note.user_id == FAKE_USER_ID,
            models.Note.title.ilike(f"%{q}%"),
        )
        .all()
    )

    return {"query": q, "results": results}
