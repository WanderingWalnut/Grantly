"""Authentication router endpoints."""
from fastapi import APIRouter, HTTPException, Header
from typing import Optional

from app.schemas.auth import (
    SignUpRequest,
    SignInRequest,
    AuthResponse,
    ErrorResponse,
    RefreshTokenRequest
)
from app.db.auth_service import auth_service

router = APIRouter()


@router.post("/signup", response_model=AuthResponse, responses={400: {"model": ErrorResponse}})
async def signup(payload: SignUpRequest):
    """
    Register a new user.
    
    Args:
        payload: SignUpRequest with email, password, and optional metadata
        
    Returns:
        AuthResponse with user info and session tokens
    """
    try:
        result = await auth_service.sign_up(
            email=payload.email,
            password=payload.password,
            metadata=payload.metadata
        )
        return AuthResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail={"error": "Signup failed", "detail": str(e)}
        )


@router.post("/signin", response_model=AuthResponse, responses={401: {"model": ErrorResponse}})
async def signin(payload: SignInRequest):
    """
    Sign in an existing user.
    
    Args:
        payload: SignInRequest with email and password
        
    Returns:
        AuthResponse with user info and session tokens
    """
    try:
        result = await auth_service.sign_in(
            email=payload.email,
            password=payload.password
        )
        return AuthResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail={"error": "Login failed", "detail": str(e)}
        )


@router.post("/signout")
async def signout(authorization: Optional[str] = Header(None)):
    """
    Sign out the current user.
    
    Args:
        authorization: Bearer token from Authorization header
        
    Returns:
        Success message
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="No authorization token provided")
    
    # Extract token from "Bearer <token>"
    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
    
    try:
        await auth_service.sign_out(token)
        return {"message": "Signed out successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/user")
async def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Get current user info from token.
    
    Args:
        authorization: Bearer token from Authorization header
        
    Returns:
        User information
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="No authorization token provided")
    
    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
    
    user = await auth_service.get_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return {"user": user}


@router.post("/refresh")
async def refresh_token(payload: RefreshTokenRequest):
    """
    Refresh an expired access token.
    
    Args:
        payload: RefreshTokenRequest with refresh_token
        
    Returns:
        New session tokens
    """
    try:
        result = await auth_service.refresh_session(payload.refresh_token)
        return {"session": result}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
