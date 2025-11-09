"""Organization service for database operations."""
from typing import Dict, Any, Optional
from datetime import date

from supabase import Client
from app.db.supabase_client import supabase


class OrganizationService:
    """Handles organization data operations using Supabase."""
    
    def __init__(self):
        """Initialize the organization service with Supabase client."""
        self.client: Client = supabase()
    
    async def create_organization(self, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new organization for a user.
        
        Args:
            user_id: The authenticated user's ID
            data: Organization data from intake form
            
        Returns:
            Dict containing the created organization
        """
        # Prepare data for insertion
        org_data = {
            "user_id": user_id,
            "organization_name": data.get("organization_name"),
            "legal_business_name": data.get("legal_business_name"),
            "operating_name": data.get("operating_name"),
            "business_number": data.get("business_number"),
            "business_structure": data.get("business_structure"),
            "address": data.get("address"),
            "contact_information": data.get("contact_information"),
            "date_of_establishment": data.get("date_of_establishment").isoformat() if isinstance(data.get("date_of_establishment"), date) else data.get("date_of_establishment"),
            "phone_number": data.get("phone_number"),
            "email_address": data.get("email_address"),
            "number_of_employees": data.get("number_of_employees"),
            "mission_statement": data.get("mission_statement"),
            "company_description": data.get("company_description"),
            "target_beneficiaries": data.get("target_beneficiaries"),
            "organization_type": data.get("organization_type"),
            "year_established": data.get("year_established"),
            "annual_budget": data.get("annual_budget")
        }
        
        # Insert into Supabase
        response = self.client.table("organizations").insert(org_data).execute()
        
        if response.data:
            return response.data[0]
        else:
            raise Exception("Failed to create organization")
    
    async def get_organization_by_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get organization data for a user.
        
        Args:
            user_id: The user's ID
            
        Returns:
            Dict containing organization data or None
        """
        response = self.client.table("organizations").select("*").eq("user_id", user_id).execute()
        
        if response.data:
            return response.data[0]
        return None
    
    async def update_organization(self, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update organization data for a user.
        
        Args:
            user_id: The user's ID
            data: Updated organization data
            
        Returns:
            Dict containing updated organization
        """
        # Filter out None values
        update_data = {k: v for k, v in data.items() if v is not None}
        
        # Convert date objects to ISO format
        if "date_of_establishment" in update_data and isinstance(update_data["date_of_establishment"], date):
            update_data["date_of_establishment"] = update_data["date_of_establishment"].isoformat()
        
        response = self.client.table("organizations").update(update_data).eq("user_id", user_id).execute()
        
        if response.data:
            return response.data[0]
        else:
            raise Exception("Failed to update organization")
    
    async def delete_organization(self, user_id: str) -> bool:
        """
        Delete organization for a user.
        
        Args:
            user_id: The user's ID
            
        Returns:
            True if successful
        """
        response = self.client.table("organizations").delete().eq("user_id", user_id).execute()
        return True


# Create singleton instance
organization_service = OrganizationService()
