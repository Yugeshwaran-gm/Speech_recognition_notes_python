from fastapi import APIRouter, UploadFile, File
import uuid, os
from ..utils.stt_utils import convert_speech_to_text
from googletrans import Translator

router = APIRouter(prefix="/speech", tags=["Speech"])

translator = Translator()

TEMP = "temp_audio"
os.makedirs(TEMP, exist_ok=True)

@router.post("/stt")
async def stt(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    file_path = f"{TEMP}/{file_id}.wav"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    original_text = convert_speech_to_text(file_path)

    if not original_text:
        return {"error": "STT failed"}

    translated = translator.translate(original_text, dest="en")

    return {
        "original_text": original_text,
        "language": translated.src,
        "english_text": translated.text
    }
