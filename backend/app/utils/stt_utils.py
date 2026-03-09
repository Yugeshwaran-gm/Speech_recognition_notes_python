# import speech_recognition as sr

# SUPPORTED_LANGS = (
#     "en-IN,ta-IN,hi-IN,ml-IN,kn-IN,te-IN,gu-IN,bn-IN,mr-IN,pa-IN"
# )

# def convert_speech_to_text(file_path: str):
#     recognizer = sr.Recognizer()
#     with sr.AudioFile(file_path) as source:
#         audio = recognizer.record(source)

#     try:
#         return recognizer.recognize_google(audio, language=SUPPORTED_LANGS)
#     except Exception as e:
#         return None


from faster_whisper import WhisperModel

print("Loading Whisper model...")

model = WhisperModel("tiny", compute_type="int8")

def convert_speech_to_text(file_path: str):
    print("Transcribing:", file_path)

    segments, info = model.transcribe(file_path)

    text = ""
    for segment in segments:
        text += segment.text + " "

    print("Transcription complete")

    return text.strip()