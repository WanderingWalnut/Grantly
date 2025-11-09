from __future__ import annotations

from typing import Any, Dict, Iterable, List
from urllib.parse import urlparse

from app.models.schemas import Grant

ALLOWED_DOMAINS: Iterable[str] = ()
CANADA_TEXT_HINTS: Iterable[str] = (
    "canada",
    "canadian",
    "in canada",
    "across canada",
    "nationwide in canada",
    "pan-canadian",
    "province of",
    "territory of",
)
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
    "apply now",
    "submit your application",
    "application deadline",
    "complete the form",
    "google form",
)
NEGATIVE_AUDIENCE_PHRASES: Iterable[str] = (
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
    "non profit",
    "charity",
    "community organization",
    "community group",
    "organizations can apply",
    "eligible organizations",
    "funding for organizations",
    "for organizations",
    "service providers",
    "youth organizations",
)
GRANT_KEYWORDS: Iterable[str] = (
    "grant",
    "micro-grant",
    "funding",
    "contribution",
    "funding opportunity",
)


def parse_grants_from_search(response: Dict[str, Any]) -> List[Grant]:
    """
    Normalize a Perplexity Search API response into Grant models.

    The Search API returns a list of ranked web documents. We keep high-signal
    grant pages and convert the minimal metadata into our Grant schema.
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

        # Minimal filtering: accept Canadian hosts (hostname contains .ca or 'canada')
        host = (urlparse(url).hostname or "").lower()
        if ".ca" not in host and "canada" not in host:
            continue

        # Attempt to infer a specific program section when the page is the general hub.
        program_name = item.get("program") or item.get("title")
        if url.rstrip("/") == "https://www.alberta.ca/funding-for-non-profits":
            program_name = _infer_program_from_snippet(item.get("snippet") or "")

        sponsor = "Government of Alberta" if "alberta.ca" in url else "Government of Canada"
        region = "Alberta" if "alberta.ca" in url else "National"

        # Build a dictionary compatible with the Grant Pydantic model.
        grant_data: Dict[str, Any] = {
            "title": program_name or item.get("title") or "Unnamed Program",
            "link": url,
            "summary": item.get("snippet") or item.get("text"),
            "eligibility": item.get("extracted_eligibility"),
            "deadline": None,
            "amount_min": None,
            "amount_max": None,
            "currency": "CAD",
            "sponsor": sponsor,
            "program": item.get("program") or item.get("title"),
            "region": region,
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
    """Ensure we only surface whitelisted sources when provided."""
    return any(domain in url for domain in ALLOWED_DOMAINS)


def _mentions_grant(item: Dict[str, Any]) -> bool:
    """True when the text references a grant, funding, or contribution."""
    text_candidates = [
        str(item.get("title") or ""),
        str(item.get("snippet") or ""),
        str(item.get("text") or ""),
    ]
    combined = " ".join(text_candidates).lower()
    return any(keyword in combined for keyword in GRANT_KEYWORDS)


def _looks_canadian(url: str, item: Dict[str, Any]) -> bool:
    """Return True when the source or description clearly indicates a Canadian scope."""
    domain = url.lower()
    if domain.endswith(".ca") or "canada" in domain:
        return True

    text_candidates = [
        str(item.get("title") or ""),
        str(item.get("snippet") or ""),
        str(item.get("text") or ""),
    ]
    combined = " ".join(text_candidates).lower()

    return any(hint in combined for hint in CANADA_TEXT_HINTS)


def _infer_program_from_snippet(snippet: str) -> str | None:
    """Extract the first Alberta program heading from the main funding page snippet."""
    lowered = snippet.lower()
    for keyword, program in [
        ("cfep small", "Community Facility Enhancement Program (CFEP) Small"),
        ("cfep large", "Community Facility Enhancement Program (CFEP) Large"),
        ("project-based grant", "Community Initiatives Program (CIP) Project-Based"),
        ("operating grant", "Community Initiatives Program (CIP) Operating"),
        ("cultural heritage initiatives program", "Cultural Heritage Initiatives Program"),
        ("other initiatives program", "Other Initiatives Program"),
        ("major sport event grant", "Major Sport Event Grant Program"),
    ]:
        if keyword in lowered:
            return program
    return None


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

    # Accept Alberta government pages by default since they're pre-filtered
    url = _get_url(item) or ""
    if "alberta.ca" in url:
        return True

    # For other sources, require at least one sign that the page discusses applying.
    return any(hint in combined for hint in POSITIVE_APPLICATION_HINTS)


def _is_org_focused(item: Dict[str, Any]) -> bool:
    """Return True when the text emphasises organizational eligibility."""
    text_candidates = [
        str(item.get("snippet") or ""),
        str(item.get("text") or ""),
        str(item.get("title") or ""),
    ]
    combined = " ".join(text_candidates).lower()

    # Accept Alberta government pages by default since they're pre-filtered
    url = _get_url(item) or ""
    if "alberta.ca" in url:
        return True

    if any(phrase in combined for phrase in NEGATIVE_AUDIENCE_PHRASES):
        return False

    return any(hint in combined for hint in POSITIVE_ORG_HINTS)

