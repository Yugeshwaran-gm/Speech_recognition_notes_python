from fastapi import APIRouter
from googletrans import Translator

router = APIRouter(prefix="/translate", tags=["Translate"])
translator = Translator()

@router.post("/")
def translate_text(text: str):
    res = translator.translate(text, dest="en")
    return {
        "original": text,
        "detected_language": res.src,
        "translated_english": res.text
    }
