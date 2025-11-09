from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path
from typing import Literal, Optional

from dotenv import load_dotenv
from pydantic import BaseModel, Field, HttpUrl

# Load .env file from server directory (parent of app directory)
server_dir = Path(__file__).parent.parent.parent
env_path = server_dir / '.env'
load_dotenv(dotenv_path=env_path)


class Settings(BaseModel):
    mode: Literal["mock", "live"] = Field(default="mock")
    perplexity_api_key: Optional[str] = None
    perplexity_model: str = Field(default="sonar-small-online")
    perplexity_base_url: HttpUrl = Field(default="https://api.perplexity.ai")
    http_timeout_seconds: int = Field(default=20)
    browserbase_api_key: Optional[str] = None
    browserbase_project_id: Optional[str] = None
    browserbase_region: Optional[str] = None
    gemini_api_key: Optional[str] = None

    @classmethod
    def load(cls) -> "Settings":
        mode_value = os.getenv("GRANT_FINDER_MODE", "mock") or "mock"
        return cls(
            mode=mode_value.strip().lower(),
            perplexity_api_key=os.getenv("PERPLEXITY_API_KEY"),
            perplexity_model=os.getenv("PERPLEXITY_MODEL", "sonar-small-online"),
            perplexity_base_url=os.getenv("PERPLEXITY_BASE_URL", "https://api.perplexity.ai"),
            http_timeout_seconds=os.getenv("HTTP_TIMEOUT_SECONDS", "20"),
            browserbase_api_key=os.getenv("BROWSERBASE_API_KEY"),
            browserbase_project_id=os.getenv("BROWSERBASE_PROJECT_ID"),
            browserbase_region=os.getenv("BROWSERBASE_REGION"),
            gemini_api_key=os.getenv("GEMINI_API_KEY"),
        )

    @property
    def is_mock_mode(self) -> bool:
        return self.mode == "mock"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings.load()


settings = get_settings()
