from __future__ import annotations

import json
from datetime import date
from functools import lru_cache
from pathlib import Path
from typing import Iterable, List, Optional
from urllib.parse import urlparse

from app.core.config import Settings
from app.models.schemas import Grant, GrantFilters, OrganizationInfo
from app.services.parsing.grants_parser import parse_grants_from_search
from app.services.perplexity_client import PerplexityClient

SAMPLES_PATH = (
    Path(__file__).resolve().parent.parent / "data" / "samples" / "grants_sample.json"
)


class GrantFinderService:
    """Orchestrates grant discovery across mock and live Perplexity-backed modes."""

    def __init__(self, settings: Settings):
        self.settings = settings

    async def find_grants(
        self, organization: OrganizationInfo, filters: Optional[GrantFilters] = None
    ) -> list[Grant]:
        """
        Entry point used by the router.

        Args:
            organization: Profile of the nonprofit we are assisting.
            filters: Optional numeric and geographic constraints.
        """
        if self.settings.is_mock_mode:
            return self._find_grants_mock(organization, filters)

        return await self._find_grants_live(organization, filters)

    def _find_grants_mock(
        self, organization: OrganizationInfo, filters: Optional[GrantFilters]
    ) -> list[Grant]:
        """Return mock data stored on disk for quick iteration."""
        grants = list(_load_mock_grants())
        grants = self._apply_filters(grants, filters, organization)

        max_results = filters.max_results if filters and filters.max_results else 10
        return grants[:max_results]

    async def _find_grants_live(
        self, organization: OrganizationInfo, filters: Optional[GrantFilters]
    ) -> List[Grant]:
        """
        Call the Perplexity Search API and map the results to our schema.
        """
        client = PerplexityClient(self.settings)
        max_results = filters.max_results if filters and filters.max_results else 10
        # Prefer multi-query to target specific Alberta program pages and avoid hubs
        queries = self._build_multi_queries_for_alberta(organization, filters, max_results)
        domain_filter = ["alberta.ca"]
        response = await client.search(
            query=queries,
            max_results=max_results,
            search_domain_filter=domain_filter,
            max_tokens_per_page=2048,
        )
        print("Perplexity search response:", response)
        grants = parse_grants_from_search(response)
        grants = self._apply_filters(grants, filters, organization)

        return grants[:max_results]

    def _apply_filters(
        self,
        grants: Iterable[Grant],
        filters: Optional[GrantFilters],
        _organization: OrganizationInfo,
    ) -> list[Grant]:
        """
        Apply simple filtering that works for both mock and live output.
        """
        if not filters:
            return list(grants)

        filtered: list[Grant] = []
        for grant in grants:
            if filters.province and not _matches_province(grant, filters.province):
                continue

            if filters.deadline_before and not _before_deadline(
                grant, filters.deadline_before
            ):
                continue

            if filters.min_amount is not None and not _meets_min_amount(
                grant, filters.min_amount
            ):
                continue

            filtered.append(grant)

        return filtered

    def _build_search_query(
        self,
        organization: OrganizationInfo,
        filters: Optional[GrantFilters],
        max_results: int,
    ) -> str:
        """
        Construct a targeted search query string for the Perplexity Search API.
        """
        province = (
            organization.address.province
            if organization.address and organization.address.province
            else (filters.province if filters else None)
        )

        targeted_keywords = [
            '"Funding for non-profits" OR "Grants, funding and supports for non-profits"',
            '"Community Facility Enhancement Program" OR "CIP Operating grant" OR '
            '"CIP Project-Based grant" OR "Cultural Heritage Initiatives Program" OR '
            '"Other Initiatives Program"',
            '"grant program" OR "micro-grant" OR "funding opportunity" OR "call for proposals"',
            '"application form" OR "apply now" OR "online application" OR "application portal" OR "Google Form"',
            '"program details" OR "how to apply" OR "eligibility requirements"',
            '"currently accepting applications" OR "applications open" OR "intake open"',
            '"deadline" OR "closing date" OR "apply by"',
            '"for nonprofits" OR "for community organizations" OR "for registered charities" OR "for youth organizations"',
            '"Alberta" OR "Province of Alberta" OR "Government of Alberta"',
        ]

        query_parts = [
            "site:alberta.ca/funding-for-non-profits OR site:alberta.ca/community-facility-enhancement-program- OR site:alberta.ca/community-initiatives-program",
            f'"{organization.legal_name}" nonprofit',
            f"NAICS {organization.naics_code}" if organization.naics_code else "",
            f'"{province}"' if province else "",
            *targeted_keywords,
        ]

        if organization.sector_tags:
            query_parts.append(" ".join(organization.sector_tags))

        if filters:
            if filters.min_amount is not None:
                query_parts.append(f"minimum funding {filters.min_amount} CAD")
            if filters.deadline_before:
                query_parts.append("currently open funding 2025")

        query_parts.append(f"limit results {max_results}")

        # Encourage the search engine to avoid outdated or archived programs.
        query_parts.append('"last updated" OR "2024" OR "2025"')

        return " ".join(part for part in query_parts if part)

    def _build_multi_queries_for_alberta(
        self,
        organization: OrganizationInfo,
        filters: Optional[GrantFilters],
        max_results: int,
    ) -> List[str]:
        """
        Build multiple focused queries to directly hit Alberta program sub-pages
        and avoid generic hub pages.
        """
        province = (
            organization.address.province
            if organization.address and organization.address.province
            else (filters.province if filters else None)
        )

        apply_terms = '("apply" OR "application" OR "how to apply" OR "application form" OR "apply now")'
        common_suffix = f'{apply_terms}'

        seeds: List[str] = [
            # CFEP program pages
            "site:alberta.ca/community-facility-enhancement-program-small",
            "site:alberta.ca/community-facility-enhancement-program-large",
            # CIP program pages
            "site:alberta.ca/cip-project-based-grant",
            "site:alberta.ca/cip-operating-grant",
            # Cultural Heritage and Other Initiatives
            "site:alberta.ca/cultural-heritage-initiatives-program",
            "site:alberta.ca/other-initiatives-program",
        ]

        queries: List[str] = []
        for base in seeds:
            parts: List[str] = [base, common_suffix]
            if organization.sector_tags:
                parts.append(" ".join(organization.sector_tags))
            # Province hint (should already be Alberta, but include if provided)
            if province:
                parts.append(f'"{province}"')
            # Keep it concise; NAICS or legal name can be too specific and miss pages
            queries.append(" ".join(p for p in parts if p))

        # Limit to max_results number of queries to keep the call efficient
        return queries[: max_results if max_results > 0 else 3]


@lru_cache(maxsize=1)
def _load_mock_grants() -> tuple[Grant, ...]:
    """Load and cache mock grants from JSON."""
    if not SAMPLES_PATH.exists():
        raise FileNotFoundError(
            f"Could not find mock grants data at {SAMPLES_PATH}. "
            "Add the sample file or switch to live mode."
        )

    with SAMPLES_PATH.open("r", encoding="utf-8") as file:
        raw_data = json.load(file)

    return tuple(Grant.model_validate(item) for item in raw_data)


def _matches_province(grant: Grant, province: str) -> bool:
    """
    Return True if the grant appears applicable to the requested province.
    - Treat missing region or 'National' as applicable everywhere.
    - Consider common province code/name aliases (e.g., 'AB' <-> 'Alberta').
    - If the source link is on an official provincial domain (e.g., alberta.ca),
      infer the province from the domain.
    """
    if not province:
        return True

    if not grant.region or (isinstance(grant.region, str) and grant.region.strip().lower() == "national"):
        return True

    province_aliases = {
        "ab": "alberta",
        "bc": "british columbia",
        "mb": "manitoba",
        "nb": "new brunswick",
        "nl": "newfoundland and labrador",
        "ns": "nova scotia",
        "nt": "northwest territories",
        "nu": "nunavut",
        "on": "ontario",
        "pe": "prince edward island",
        "qc": "quebec",
        "sk": "saskatchewan",
        "yt": "yukon",
    }

    requested = province.strip().lower()
    requested_name = province_aliases.get(requested, requested)

    region = (grant.region or "").strip().lower()
    if region == requested or region == requested_name:
        return True

    # Infer province via domain when possible
    try:
        host = urlparse(str(grant.link)).hostname or ""
    except Exception:
        host = ""
    host = host.lower()
    if requested in ("ab", "alberta") and "alberta.ca" in host:
        return True
    if requested in ("on", "ontario") and ("ontario.ca" in host):
        return True
    if requested in ("bc", "british columbia") and ("gov.bc.ca" in host):
        return True
    if requested in ("mb", "manitoba") and ("gov.mb.ca" in host):
        return True
    if requested in ("sk", "saskatchewan") and ("gov.sk.ca" in host):
        return True
    if requested in ("ns", "nova scotia") and ("novascotia.ca" in host or "gov.ns.ca" in host):
        return True
    if requested in ("nl", "newfoundland and labrador") and ("gov.nl.ca" in host):
        return True
    if requested in ("qc", "quebec") and ("quebec.ca" in host):
        return True
    if requested in ("pe", "prince edward island") and ("princeedwardisland.ca" in host):
        return True
    if requested in ("yt", "yukon") and ("gov.yk.ca" in host):
        return True
    if requested in ("nt", "northwest territories") and ("gov.nt.ca" in host):
        return True
    if requested in ("nu", "nunavut") and ("gov.nu.ca" in host):
        return True

    return False


def _before_deadline(grant: Grant, deadline_before: date) -> bool:
    """True if the grant deadline is earlier than the cutoff."""
    if grant.deadline is None:
        return True
    return grant.deadline < deadline_before


def _meets_min_amount(grant: Grant, min_amount: int) -> bool:
    """True if the grant offers at least the desired minimum funding."""
    amount_fields = [grant.amount_max, grant.amount_min]
    available_amounts = [amt for amt in amount_fields if isinstance(amt, int)]
    if not available_amounts:
        return True
    return max(available_amounts) >= min_amount


