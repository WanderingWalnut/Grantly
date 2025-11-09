from typing import List, Optional

from pydantic import BaseModel, EmailStr


class NonprofitBase(BaseModel):
	legal_business_name: str
	operating_name: Optional[str] = None
	business_number: Optional[str] = None
	business_structure: Optional[str] = None
	address: Optional[str] = None
	date_of_establishment: Optional[str] = None  # ISO date string
	phone_number: Optional[str] = None
	email: Optional[EmailStr] = None
	number_of_employees: Optional[int] = None
	business_sector: Optional[str] = None
	naics_codes: Optional[List[str]] = None
	mission: Optional[str] = None
	goals: Optional[str] = None
	website: Optional[str] = None


class NonprofitCreate(NonprofitBase):
	pass


class NonprofitUpdate(NonprofitBase):
	pass


class NonprofitRead(NonprofitBase):
	id: Optional[int]


class NonprofitInDB(NonprofitRead):
	pass


__all__ = [
	"NonprofitBase",
	"NonprofitCreate",
	"NonprofitUpdate",
	"NonprofitRead",
	"NonprofitInDB",
]
