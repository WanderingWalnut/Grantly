"""Organizations/Nonprofits router endpoints."""
from fastapi import APIRouter, HTTPException, Header, Depends
from typing import Optional

from app.schemas.organization import (
    OrganizationIntakeForm,
    OrganizationResponse,
    OrganizationUpdate
)
from app.db.organization_service import organization_service
from app.db.auth_service import auth_service

router = APIRouter()


async def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    """
    Dependency to extract and validate user ID from auth token.
    
    Args:
        authorization: Bearer token from Authorization header
        
    Returns:
        User ID string
        
    Raises:
        HTTPException: If token is invalid or missing
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="No authorization token provided")
    
    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
    
    user = await auth_service.get_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return user["id"]


@router.post("/", response_model=OrganizationResponse)
async def create_organization(
    payload: OrganizationIntakeForm,
    user_id: str = Depends(get_current_user_id)
):
    """
    Create organization profile from intake form.
    
    Args:
        payload: OrganizationIntakeForm with all organization details
        user_id: Authenticated user's ID (from token)
        
    Returns:
        OrganizationResponse with created organization info
    """
    try:
        # Convert Pydantic model to dict
        data = payload.model_dump()
        
        # Create organization linked to user
        result = await organization_service.create_organization(user_id, data)
        
        return OrganizationResponse(
            id=result["id"],
            user_id=result["user_id"],
            organization_name=result.get("operating_name", result.get("legal_business_name", ""))
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail={"error": "Failed to create organization", "detail": str(e)}
        )


@router.get("/me")
async def get_my_organization(user_id: str = Depends(get_current_user_id)):
    """
    Get organization profile for current user.
    
    Args:
        user_id: Authenticated user's ID (from token)
        
    Returns:
        Organization data
    """
    try:
        result = await organization_service.get_organization_by_user(user_id)
        
        if not result:
            raise HTTPException(
                status_code=404,
                detail="No organization found for this user"
            )
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail={"error": "Failed to fetch organization", "detail": str(e)}
        )


@router.get("/")
async def get_organization(user_id: str = Depends(get_current_user_id)):
    """
    Get organization profile for current user (alias for /me).
    
    Args:
        user_id: Authenticated user's ID (from token)
        
    Returns:
        Organization data
    """
    try:
        result = await organization_service.get_organization_by_user(user_id)
        
        if not result:
            raise HTTPException(
                status_code=404,
                detail="No organization found for this user"
            )
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail={"error": "Failed to fetch organization", "detail": str(e)}
        )


@router.put("/")
async def update_organization(
    payload: OrganizationUpdate,
    user_id: str = Depends(get_current_user_id)
):
    """
    Update organization profile for current user.
    
    Args:
        payload: OrganizationUpdate with fields to update
        user_id: Authenticated user's ID (from token)
        
    Returns:
        Updated organization data
    """
    try:
        # Convert to dict and filter None values
        data = payload.model_dump(exclude_none=True)
        
        if not data:
            raise HTTPException(status_code=400, detail="No update data provided")
        
        result = await organization_service.update_organization(user_id, data)
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail={"error": "Failed to update organization", "detail": str(e)}
        )


@router.delete("/")
async def delete_organization(user_id: str = Depends(get_current_user_id)):
    """
    Delete organization profile for current user.
    
    Args:
        user_id: Authenticated user's ID (from token)
        
    Returns:
        Success message
    """
    try:
        await organization_service.delete_organization(user_id)
        return {"message": "Organization deleted successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail={"error": "Failed to delete organization", "detail": str(e)}
        )
