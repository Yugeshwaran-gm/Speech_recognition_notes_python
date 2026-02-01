from pydantic_settings import BaseSettings
class Settings(BaseSettings):
    # DB_HOST: str = "localhost"
    # DB_PORT: int = 5432
    # DB_USER: str = "postgres"
    # DB_PASSWORD: str = "rootsql"
    # DB_NAME: str = "speech_notes_app"
    DATABASE_URL: str="postgresql://echo_note_db_user:Vg6L40AgPTJ0I3EpPOD0T0RiWjVMeu8u@dpg-d5prhljvbchc739dbfo0-a.singapore-postgres.render.com/echo_note_db"
    SECRET_KEY: str = "eywcjoguyhoiyoieuryc"
    ALGORITHM: str = "HS256"

    class Config:
        env_file = ".env"

settings = Settings()
