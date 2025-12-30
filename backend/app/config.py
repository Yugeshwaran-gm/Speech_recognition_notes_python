from pydantic_settings import BaseSettings
class Settings(BaseSettings):
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "rootsql"
    DB_NAME: str = "speech_notes_app"

    SECRET_KEY: str = "eywcjoguyhoiyoieuryc"
    ALGORITHM: str = "HS256"

    class Config:
        env_file = ".env"

settings = Settings()
