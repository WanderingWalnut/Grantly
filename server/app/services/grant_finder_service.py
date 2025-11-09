from __future__ import annotations

import json
from datetime import date
from functools import lru_cache
from pathlib import Path
from typing import Iterable, Optional

from app.core.config import Settings
from app.models.schemas import Grant, GrantFilters, OrganizationInfo

SAMPLES_PATH = (
    Path(__file__).resolve().parent.parent / "data" / "samples" / "grants_sample.json"
)


class GrantFinderService:
    def __init__(self, settings: Settings):
        self.settings = settings

    async def find_grants(
        self, organization: OrganizationInfo, filters: Optional[GrantFilters] = None
    ) -> list[Grant]:
        if self.settings.is_mock_mode:
            return self._find_grants_mock(organization, filters)

        raise NotImplementedError("Live mode is not yet implemented.")

    def _find_grants_mock(
        self, organization: OrganizationInfo, filters: Optional[GrantFilters]
    ) -> list[Grant]:
        grants = list(_load_mock_grants())
        grants = self._apply_filters(grants, filters, organization)

        max_results = filters.max_results if filters and filters.max_results else 10
        return grants[:max_results]

    def _apply_filters(
        self,
        grants: Iterable[Grant],
        filters: Optional[GrantFilters],
        _organization: OrganizationInfo,
    ) -> list[Grant]:
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


@lru_cache(maxsize=1)
def _load_mock_grants() -> tuple[Grant, ...]:
    if not SAMPLES_PATH.exists():
        raise FileNotFoundError(
            f"Could not find mock grants data at {SAMPLES_PATH}. "
            "Add the sample file or switch to live mode."
        )

    with SAMPLES_PATH.open("r", encoding="utf-8") as file:
        raw_data = json.load(file)

    return tuple(Grant.model_validate(item) for item in raw_data)


def _matches_province(grant: Grant, province: str) -> bool:
    if not grant.region or grant.region.lower() == "national":
        return True
    return grant.region.strip().lower() == province.strip().lower()


def _before_deadline(grant: Grant, deadline_before: date) -> bool:
    if grant.deadline is None:
        return True
    return grant.deadline < deadline_before


def _meets_min_amount(grant: Grant, min_amount: int) -> bool:
    amount_fields = [grant.amount_max, grant.amount_min]
    available_amounts = [amt for amt in amount_fields if isinstance(amt, int)]
    if not available_amounts:
        return True
    return max(available_amounts) >= min_amount


