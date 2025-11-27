from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import uuid
import os

router = APIRouter()

UPLOAD_DIR = "uploads/audio"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):
    file_ext = file.filename.split(".")[-1]
    if file_ext not in ["wav", "mp3", "m4a"]:
        raise HTTPException(status_code=400, detail="Invalid audio format")

    filename = f"{uuid.uuid4()}.{file_ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"filename": filename, "path": filepath}
@router.post("/transcribe")
async def transcribe(filename: str):
    file_path = f"uploads/audio/{filename}"

    if not os.path.exists(file_path):
        raise HTTPException(404, "File not found")

    text = transcribe_audio(file_path)
    return {"transcription": text}
