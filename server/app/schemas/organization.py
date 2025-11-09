"""Pydantic schemas for organization/intake form."""
from typing import Optional
from datetime import date
from pydantic import BaseModel, EmailStr


class OrganizationIntakeForm(BaseModel):
    """Schema for organization intake form data - matches database schema exactly."""
    # Basic Information
    legal_business_name: str
    operating_name: str
    business_number: str
    business_structure: str
    address: str
    contact_information: str
    date_of_establishment: date
    phone_number: str
    email_address: EmailStr
    
    # Organization Details
    number_of_employees: int
    business_sector: Optional[str] = None
    mission_statement: str
    company_description: str
    target_beneficiaries: str
    
    # User association (will be set from auth token)
    user_id: Optional[str] = None


class OrganizationResponse(BaseModel):
    """Response for organization operations."""
    id: str
    user_id: str
    organization_name: str
    message: str = "Organization saved successfully"


class OrganizationUpdate(BaseModel):
    """Schema for updating organization data - matches database schema exactly."""
    legal_business_name: Optional[str] = None
    operating_name: Optional[str] = None
    business_number: Optional[str] = None
    business_structure: Optional[str] = None
    address: Optional[str] = None
    contact_information: Optional[str] = None
    date_of_establishment: Optional[date] = None
    phone_number: Optional[str] = None
    email_address: Optional[EmailStr] = None
    number_of_employees: Optional[int] = None
    business_sector: Optional[str] = None
    mission_statement: Optional[str] = None
    company_description: Optional[str] = None
    target_beneficiaries: Optional[str] = None
