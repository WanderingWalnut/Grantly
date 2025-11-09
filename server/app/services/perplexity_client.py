from __future__ import annotations

from typing import Any, Dict, List, Optional, Union

import httpx

from app.core.config import Settings


class PerplexityClient:
    """Minimal client for Perplexity's Search API."""

    def __init__(self, settings: Settings):
        """
        Store the shared settings object.

        Raises:
            ValueError: When the Perplexity API key is missing while live mode is enabled.
        """
        self.settings = settings
        if not self.settings.perplexity_api_key:
            raise ValueError("PERPLEXITY_API_KEY is required for live mode.")

    async def search(
        self,
        *,
        query: Union[str, List[str]],
        max_results: int,
        search_domain_filter: Optional[List[str]] = None,
        max_tokens_per_page: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Execute a search request against Perplexity.

        Args:
            query: Natural language search string, or a list of strings for multi-query search.
            max_results: Number of documents to retrieve (1-20 per docs).
            search_domain_filter: Optional whitelist of allowed host names.
            max_tokens_per_page: Optional cap on extracted content per result.

        Returns:
            Raw JSON dictionary provided by Perplexity Search API.
        """

        # Build request payload based on official Search API schema.
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

        # Ensure callers can override PERPLEXITY_BASE_URL without duplicating slashes.
        base_url = str(self.settings.perplexity_base_url).rstrip("/")

        async with httpx.AsyncClient(timeout=self.settings.http_timeout_seconds) as client:
            # POST /search returns ranked documents relevant to the query.
            response = await client.post(
                f"{base_url}/search",
                headers=headers,
                json=payload,
            )
            response.raise_for_status()
            return response.json()

