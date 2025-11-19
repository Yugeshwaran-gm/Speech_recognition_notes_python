from fastapi import FastAPI
from .database import Base, engine
from .routers import auth, notes, speech, translate

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Speech Notes App")

app.include_router(auth.router)
app.include_router(notes.router)
app.include_router(speech.router)
app.include_router(translate.router)
