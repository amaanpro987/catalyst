import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # API Configuration
    api_title: str = "Catalyst Discovery Platform"
    api_version: str = "0.1.0"
    debug: bool = os.getenv("DEBUG", "True") == "True"
    
    # Database
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./catalyst.db")
    
    # Security
    secret_key: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS
    backend_cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
