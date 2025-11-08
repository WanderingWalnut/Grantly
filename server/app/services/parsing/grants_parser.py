from __future__ import annotations

from typing import Any, Dict, Iterable, List

from app.models.schemas import Grant

ALLOWED_DOMAINS: Iterable[str] = ("canada.ca", "gc.ca")


def parse_grants_from_search(response: Dict[str, Any]) -> List[Grant]:
    """
    Normalize a Perplexity Search API response into Grant models.
    """
    results = response.get("results")
    if not isinstance(results, list):
        raise ValueError("Perplexity response did not contain search results.")

    grants: List[Grant] = []
    for item in results:
        if not isinstance(item, dict):
            continue

        url = _get_url(item)
        if not url:
            continue

        if not _is_allowed_domain(url):
            # Skip non-federal sources to stay aligned with Canada-wide federal grants.
            continue

        grant_data: Dict[str, Any] = {
            "title": item.get("title") or "Unnamed Program",
            "link": url,
            "summary": item.get("snippet") or item.get("text"),
            "eligibility": item.get("extracted_eligibility"),
            "deadline": None,
            "amount_min": None,
            "amount_max": None,
            "currency": "CAD",
            "sponsor": "Government of Canada",
            "program": item.get("program") or item.get("title"),
            "region": "National",
            "tags": item.get("tags"),
            "source_citations": [url],
        }

        grants.append(Grant.model_validate(grant_data))

    return grants


def _get_url(item: Dict[str, Any]) -> str | None:
    url = item.get("url") or item.get("link")
    return str(url) if url else None


def _is_allowed_domain(url: str) -> bool:
    return any(domain in url for domain in ALLOWED_DOMAINS)

