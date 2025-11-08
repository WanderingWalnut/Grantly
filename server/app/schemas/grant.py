from typing import Optional

from pydantic import BaseModel, HttpUrl


class GrantBase(BaseModel):
	title: str
	description: Optional[str] = None
	funder: Optional[str] = None
	amount_min: Optional[float] = None
	amount_max: Optional[float] = None
	deadline: Optional[str] = None  # ISO date
	eligibility: Optional[str] = None
	url: Optional[HttpUrl] = None


class GrantCreate(GrantBase):
	pass


class GrantRead(GrantBase):
	id: Optional[int]


__all__ = ["GrantBase", "GrantCreate", "GrantRead"]
