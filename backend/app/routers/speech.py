from fastapi import APIRouter, UploadFile, File, Depends
import uuid, os
from sqlalchemy.orm import Session

from ..utils.stt_utils import convert_speech_to_text
from deep_translator import GoogleTranslator
from ..voice_commands import parse_command
from ..database import get_db
from .. import models

router = APIRouter(prefix="/speech", tags=["Speech"])

TEMP = "temp_audio"
os.makedirs(TEMP, exist_ok=True)


# ===========================
# SPEECH → TEXT (multi-language)
# ===========================
@router.post("/stt")
async def stt(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    file_path = f"{TEMP}/{file_id}.wav"

    # Save file
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Speech to Text
    original_text = convert_speech_to_text(file_path)

    if not original_text:
        return {"error": "STT failed"}

    # Auto translate to English
    translated_text = GoogleTranslator(source="auto", target="en").translate(original_text)

    return {
        "original_text": original_text,
        "english_text": translated_text
    }


# ===========================
# SPEECH COMMAND → CRUD ACTION
# ===========================
@router.post("/command")
async def speech_command(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Save audio
    file_id = str(uuid.uuid4())
    file_path = f"{TEMP}/{file_id}.wav"
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Convert to text
    original_text = convert_speech_to_text(file_path)

    if not original_text:
        return {"error": "Could not detect speech"}

    # Translate to English
    english_text = GoogleTranslator(source="auto", target="en").translate(original_text)

    # Parse voice command
    command = parse_command(english_text)
    action = command["action"]


    # ===========================
    # CREATE NOTE
    # ===========================
    if action == "CREATE":
        new_note = models.Note(
            user_id=1,
            original_text=original_text,
            translated_text=english_text,
            category="general"
        )
        db.add(new_note)
        db.commit()
        db.refresh(new_note)

        return {
            "status": "created",
            "note_id": new_note.id,
            "original": original_text,
            "translated": english_text
        }


    # ===========================
    # UPDATE NOTE
    # ===========================
    if action == "UPDATE":
        note_id = command.get("note_id")

        if not note_id:
            return {"error": "No note ID detected in your speech"}

        note = db.query(models.Note).filter(models.Note.id == note_id).first()
        if not note:
            return {"error": "Note not found"}

        note.original_text = original_text
        note.translated_text = english_text
        db.commit()

        return {"status": "updated", "note_id": note.id}


    # ===========================
    # DELETE NOTE
    # ===========================
    if action == "DELETE":
        note_id = command.get("note_id")

        if not note_id:
            return {"error": "No note ID found in your delete command"}

        note = db.query(models.Note).filter(models.Note.id == note_id).first()
        if not note:
            return {"error": "Note not found"}

        db.delete(note)
        db.commit()

        return {"status": "deleted", "note_id": note_id}


    # ===========================
    # SEARCH
    # ===========================
    if action == "SEARCH":
        keyword = command["keyword"]

        results = db.query(models.Note).filter(
            models.Note.translated_text.like(f"%{keyword}%")
        ).all()

        return {
            "status": "found",
            "keyword": keyword,
            "results": [
                {"id": r.id, "text": r.translated_text} for r in results
            ]
        }


    # ===========================
    # UNKNOWN COMMAND
    # ===========================
    return {"error": "Unknown command", "input": english_text}
