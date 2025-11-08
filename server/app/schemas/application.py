from typing import Any, Dict, Optional

from pydantic import BaseModel


class ApplicationBase(BaseModel):
	nonprofit_id: int
	grant_id: int
	data: Optional[Dict[str, Any]] = None  # arbitrary form data
	status: Optional[str] = "draft"  # draft, submitted, reviewed, etc.


class ApplicationCreate(ApplicationBase):
	pass


class ApplicationRead(ApplicationBase):
	id: Optional[int]
	submitted_at: Optional[str] = None  # ISO datetime


__all__ = ["ApplicationBase", "ApplicationCreate", "ApplicationRead"]
