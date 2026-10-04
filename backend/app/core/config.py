from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "VIDORA"
    API_V1_STR: str = "/api/v1"
    
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    SUPABASE_JWT_SECRET: str
    
    # We will derive the asyncpg URL from Supabase URL
    DATABASE_URL: str

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore", env_file_sentinel="missing")

settings = Settings()
