from pydantic_settings import BaseSettings
class Settings(BaseSettings):
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = "mysql"
    DB_NAME: str = "speech_notes_app"

    JWT_SECRET: str = "eywcjoguyhoiyoieuryc"
    JWT_ALGO: str = "HS256"

    class Config:
        env_file = ".env"

settings = Settings()
