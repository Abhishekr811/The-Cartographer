"""
RSE Knowledge Engine — Configuration

Loads settings from environment variables / .env file.
Controls LLM mode, API keys, and external service URLs.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from backend directory
_env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(_env_path)


class Settings:
    """Application settings — reads from environment with sensible defaults."""

    # --- LLM Configuration ---
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    # Optional toggle for LLM-enhanced analysis paths.
    # Core pipeline remains topic-driven via external retrieval and processors.
    USE_LLM: bool = os.getenv("USE_LLM", "false").lower() == "true"

    # --- External APIs ---
    ARXIV_BASE_URL: str = "http://export.arxiv.org/api/query"
    SEMANTIC_SCHOLAR_BASE_URL: str = "https://api.semanticscholar.org/graph/v1"

    # --- Server ---
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"

    # --- CORS ---
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",   # Vite dev server
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]

    @property
    def llm_available(self) -> bool:
        """Check if LLM mode is both enabled and has a valid API key."""
        return self.USE_LLM and bool(self.OPENAI_API_KEY)


# Singleton instance
settings = Settings()
