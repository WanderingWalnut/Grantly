"""Pydantic schemas for authentication."""
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field


class SignUpRequest(BaseModel):
    """Request body for user signup."""
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    metadata: Optional[Dict[str, Any]] = None


class SignInRequest(BaseModel):
    """Request body for user signin."""
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    """Response for successful authentication."""
    user: Dict[str, Any]
    session: Optional[Dict[str, Any]] = None
    message: str = "Authentication successful"


class ErrorResponse(BaseModel):
    """Response for authentication errors."""
    error: str
    detail: Optional[str] = None


class RefreshTokenRequest(BaseModel):
    """Request body for refreshing tokens."""
    refresh_token: str
