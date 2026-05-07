from __future__ import annotations

import json
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",           # silently ignore unknown env vars
        protected_namespaces=(),  # silence model_ field warnings
    )

    # ── API ──────────────────────────────────────────────
    api_title: str = "Catalyst Discovery Platform"
    api_version: str = "0.1.0"
    # True for local dev; override with DEBUG=False on Render
    debug: bool = True

    # ── Database ─────────────────────────────────────────
    # Render injects DATABASE_URL from its managed Postgres add-on.
    # Local dev falls back to SQLite.
    database_url: str = "sqlite:///./catalyst.db"

    # ── Security ─────────────────────────────────────────
    secret_key: str = "CHANGE-ME-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # ── CORS ─────────────────────────────────────────────
    # Set FRONTEND_URL on Render after your Vercel URL is known.
    # Comma-separated for multiple:
    #   FRONTEND_URL=https://app.vercel.app,https://custom.domain
    frontend_url: str = ""

    # Stored as a raw string so pydantic-settings never tries to
    # JSON-parse it automatically. Supports two formats:
    #   JSON array:    BACKEND_CORS_ORIGINS='["http://a","http://b"]'
    #   Comma-sep:     BACKEND_CORS_ORIGINS=http://a,http://b
    backend_cors_origins: str = (
        "http://localhost:3000,http://localhost:5173,http://localhost:8000"
    )

    # ── Derived ──────────────────────────────────────────

    @staticmethod
    def _parse_str_list(value: str) -> List[str]:
        """Parse a JSON array string or a comma-separated string into a list."""
        value = value.strip()
        if value.startswith("["):
            try:
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    return [str(item).strip().rstrip("/") for item in parsed if item]
            except json.JSONDecodeError:
                pass
        # Fallback: comma-separated
        return [u.strip().rstrip("/") for u in value.split(",") if u.strip()]

    @property
    def cors_origins_list(self) -> List[str]:
        """backend_cors_origins parsed into a proper list."""
        return self._parse_str_list(self.backend_cors_origins)

    @property
    def all_cors_origins(self) -> List[str]:
        """Merge cors_origins_list + FRONTEND_URL into one allow-list."""
        origins: List[str] = list(self.cors_origins_list)
        if self.frontend_url:
            for url in self.frontend_url.split(","):
                url = url.strip().rstrip("/")
                if url and url not in origins:
                    origins.append(url)
        return origins


settings = Settings()
