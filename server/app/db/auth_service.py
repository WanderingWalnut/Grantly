"""Authentication service using Supabase."""
from typing import Dict, Any, Optional

from supabase import Client
from gotrue.errors import AuthApiError

from .supabase_client import supabase


class AuthService:
    """Handles authentication operations using Supabase."""
    
    def __init__(self):
        """Initialize the auth service with Supabase client."""
        self.client: Client = supabase()
    
    async def sign_up(self, email: str, password: str, metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Register a new user with Supabase Auth.
        
        Args:
            email: User's email address
            password: User's password
            metadata: Optional user metadata to store
            
        Returns:
            Dict containing user info and session
            
        Raises:
            AuthApiError: If signup fails
        """
        try:
            response = self.client.auth.sign_up({
                "email": email,
                "password": password,
                "options": {
                    "data": metadata or {}
                }
            })
            
            if response.user:
                return {
                    "user": {
                        "id": response.user.id,
                        "email": response.user.email,
                        "metadata": response.user.user_metadata
                    },
                    "session": {
                        "access_token": response.session.access_token if response.session else None,
                        "refresh_token": response.session.refresh_token if response.session else None
                    } if response.session else None
                }
            else:
                raise AuthApiError("Signup failed - no user returned", 400)
                
        except AuthApiError as e:
            raise AuthApiError(f"Signup failed: {str(e)}", e.status)
    
    async def sign_in(self, email: str, password: str) -> Dict[str, Any]:
        """
        Sign in an existing user.
        
        Args:
            email: User's email address
            password: User's password
            
        Returns:
            Dict containing user info and session tokens
            
        Raises:
            AuthApiError: If signin fails
        """
        try:
            response = self.client.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            if response.user and response.session:
                return {
                    "user": {
                        "id": response.user.id,
                        "email": response.user.email,
                        "metadata": response.user.user_metadata
                    },
                    "session": {
                        "access_token": response.session.access_token,
                        "refresh_token": response.session.refresh_token
                    }
                }
            else:
                raise AuthApiError("Invalid credentials", 401)
                
        except AuthApiError as e:
            raise AuthApiError(f"Login failed: {str(e)}", e.status)
    
    async def sign_out(self, access_token: str) -> bool:
        """
        Sign out a user.
        
        Args:
            access_token: User's access token
            
        Returns:
            True if successful
        """
        try:
            self.client.auth.sign_out()
            return True
        except Exception:
            return False
    
    async def get_user(self, access_token: str) -> Optional[Dict[str, Any]]:
        """
        Get user info from access token.
        
        Args:
            access_token: User's access token
            
        Returns:
            Dict containing user info or None
        """
        try:
            response = self.client.auth.get_user(access_token)
            if response.user:
                return {
                    "id": response.user.id,
                    "email": response.user.email,
                    "metadata": response.user.user_metadata
                }
            return None
        except Exception:
            return None
    
    async def refresh_session(self, refresh_token: str) -> Dict[str, Any]:
        """
        Refresh an expired session.
        
        Args:
            refresh_token: User's refresh token
            
        Returns:
            Dict containing new session tokens
        """
        try:
            response = self.client.auth.refresh_session(refresh_token)
            if response.session:
                return {
                    "access_token": response.session.access_token,
                    "refresh_token": response.session.refresh_token
                }
            raise AuthApiError("Failed to refresh session", 401)
        except AuthApiError as e:
            raise AuthApiError(f"Refresh failed: {str(e)}", e.status)


# Create singleton instance
auth_service = AuthService()
