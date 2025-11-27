import speech_recognition as sr

def transcribe_audio(file_path: str):
    recognizer = sr.Recognizer()
    with sr.AudioFile(file_path) as source:
        audio_data = recognizer.record(source)
        try:
            text = recognizer.recognize_google(audio_data)
            return text
        except Exception as e:
            return f"Error: {str(e)}"
