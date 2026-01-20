from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, notes, speech, translate
from .database import engine, Base
from . import models
import logging

from .models import Note, User  # <-- import every model class
# ===============================================
# CREATE TABLES ON STARTUP
# ===============================================
print("✓ Creating tables...")
print("DB URL:", engine.url)
print("Engine driver:", engine.url.get_backend_name())
print("Driver:", engine.url.get_driver_name())
Base.metadata.create_all(bind=engine)

# ===============================================
# FastAPI Application
# ===============================================
app = FastAPI(title="Speech Notes App")

# ===============================================
# TEST DATABASE CONNECTION
# ===============================================
@app.on_event("startup")
async def startup_event():
    try:
        with engine.connect() as connection:
            print("✓ Database connection successful!")
    except Exception as e:
        print("✗ Database connection failed:", str(e))

# ===============================================
# ROUTERS
# ===============================================
app.include_router(auth.router)
app.include_router(notes.router)
app.include_router(speech.router)
app.include_router(translate.router)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
app.add_middleware(
    CORSMiddleware,
    # allow_origin_regex=[ "https://voicenotes-alpha.vercel.app/", r"http://(localhost|127\.0\.0\.1):\d+"],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)