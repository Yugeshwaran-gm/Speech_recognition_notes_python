from fastapi import FastAPI

from .routers import auth, notes, speech, translate



app = FastAPI(title="Speech Notes App")

app.include_router(auth.router)
app.include_router(notes.router)
app.include_router(speech.router)
app.include_router(translate.router)
