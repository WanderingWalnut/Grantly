from __future__ import annotations

from typing import Any, Dict, Iterable, List

from app.models.schemas import Grant

ALLOWED_DOMAINS: Iterable[str] = ("canada.ca", "gc.ca")
NEGATIVE_STATUS_PHRASES: Iterable[str] = (
    "applications are closed",
    "no longer accepting applications",
    "applications closed",
    "deadline has passed",
    "submission period has ended",
    "program closed",
    "archived content",
)
POSITIVE_APPLICATION_HINTS: Iterable[str] = (
    "apply",
    "application",
    "submit",
    "how to apply",
    "online form",
    "application form",
)
NEGATIVE_AUDIENCE_PHRASES: Iterable[str] = (
    "for youth",
    "for students",
    "for individuals",
    "for parents",
    "income support",
    "benefit for",
    "parents of young",
    "student aid",
    "income benefit",
)
POSITIVE_ORG_HINTS: Iterable[str] = (
    "non-profit",
    "not-for-profit",
    "nonprofit",
    "charity",
    "community organization",
    "organizations can apply",
    "eligible organizations",
    "funding for organizations",
    "for organizations",
    "service providers",
)


def parse_grants_from_search(response: Dict[str, Any]) -> List[Grant]:
    """
    Normalize a Perplexity Search API response into Grant models.

    The Search API returns a list of ranked web documents. We keep only federal
    government sources and convert the minimal metadata into our Grant schema.
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

        if not _looks_active(item):
            # Drop hits that signal the program is closed or archived.
            continue

        if not _is_org_focused(item):
            # Skip programs clearly tailored to individuals rather than organizations.
            continue

        # Build a dictionary compatible with the Grant Pydantic model.
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
    """Normalize link field naming differences."""
    url = item.get("url") or item.get("link")
    return str(url) if url else None


def _is_allowed_domain(url: str) -> bool:
    """Ensure we only surface government sources for now."""
    return any(domain in url for domain in ALLOWED_DOMAINS)


def _looks_active(item: Dict[str, Any]) -> bool:
    """Heuristically determine whether the result refers to an active program."""
    text_candidates = [
        str(item.get("snippet") or ""),
        str(item.get("text") or ""),
        str(item.get("title") or ""),
    ]
    combined = " ".join(text_candidates).lower()

    # Skip signals that the call for applications has ended.
    if any(phrase in combined for phrase in NEGATIVE_STATUS_PHRASES):
        return False

    # Require at least one sign that the page discusses applying.
    return any(hint in combined for hint in POSITIVE_APPLICATION_HINTS)


def _is_org_focused(item: Dict[str, Any]) -> bool:
    """Return True when the text emphasises organizational eligibility."""
    text_candidates = [
        str(item.get("snippet") or ""),
        str(item.get("text") or ""),
        str(item.get("title") or ""),
    ]
    combined = " ".join(text_candidates).lower()

    if any(phrase in combined for phrase in NEGATIVE_AUDIENCE_PHRASES):
        return False

    return any(hint in combined for hint in POSITIVE_ORG_HINTS)

