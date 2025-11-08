from __future__ import annotations

from typing import Any, Dict, List, Optional

import httpx

from app.core.config import Settings


class PerplexityClient:
    def __init__(self, settings: Settings):
        self.settings = settings
        if not self.settings.perplexity_api_key:
            raise ValueError("PERPLEXITY_API_KEY is required for live mode.")

    async def search(
        self,
        *,
        query: str,
        max_results: int,
        search_domain_filter: Optional[List[str]] = None,
        max_tokens_per_page: Optional[int] = None,
    ) -> Dict[str, Any]:
        payload: Dict[str, Any] = {
            "query": query,
            "max_results": max_results,
        }

        if search_domain_filter:
            payload["search_domain_filter"] = search_domain_filter

        if max_tokens_per_page:
            payload["max_tokens_per_page"] = max_tokens_per_page

        headers = {
            "Authorization": f"Bearer {self.settings.perplexity_api_key}",
            "Content-Type": "application/json",
        }

        base_url = str(self.settings.perplexity_base_url).rstrip("/")

        async with httpx.AsyncClient(timeout=self.settings.http_timeout_seconds) as client:
            response = await client.post(
                f"{base_url}/search",
                headers=headers,
                json=payload,
            )
            response.raise_for_status()
            return response.json()

