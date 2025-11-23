from fastapi import APIRouter
from deep_translator import GoogleTranslator

router = APIRouter(prefix="/translate", tags=["Translate"])

@router.post("/")
def translate_text(text: str):
    translated = GoogleTranslator(source="auto", target="en").translate(text)
    return {
        "original": text,
        "translated": translated
    }
