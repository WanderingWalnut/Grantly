from __future__ import annotations

from datetime import date, datetime
from typing import Literal, Optional

from pydantic import AnyUrl, BaseModel, Field


class Address(BaseModel):
    street: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = Field(default="CA")


class OrganizationInfo(BaseModel):
    legal_name: str
    operating_name: Optional[str] = None
    cra_business_number: Optional[str] = None
    org_structure: Optional[Literal["nonprofit", "charity", "coop", "other"]] = None
    naics_code: Optional[str] = None
    sector_tags: Optional[list[str]] = None
    website: Optional[AnyUrl] = None
    address: Optional[Address] = None
    contact_email: Optional[str] = None


class GrantFilters(BaseModel):
    province: Optional[str] = None
    min_amount: Optional[int] = None
    deadline_before: Optional[date] = None
    max_results: int = Field(default=10, ge=1, le=50)


class Grant(BaseModel):
    title: str
    link: AnyUrl
    summary: Optional[str] = None
    eligibility: Optional[str] = None
    deadline: Optional[date] = None
    amount_min: Optional[int] = None
    amount_max: Optional[int] = None
    currency: Optional[str] = Field(default="CAD")
    sponsor: Optional[str] = Field(default="Government of Canada")
    program: Optional[str] = None
    region: Optional[str] = None
    tags: Optional[list[str]] = None
    source_citations: Optional[list[AnyUrl]] = None

    model_config = {"populate_by_name": True}


class GrantsSearchRequest(BaseModel):
    organization: OrganizationInfo
    filters: Optional[GrantFilters] = None


class GrantsSearchResponse(BaseModel):
    mode: Literal["mock", "live"]
    count: int
    results: list[Grant]
    generated_at: datetime


