"""Supabase client configuration and initialization."""
import os
from functools import lru_cache
from pathlib import Path

from supabase import create_client, Client
from dotenv import load_dotenv

# Always load the server-level .env so the reloader process sees required vars.
load_dotenv(Path(__file__).resolve().parents[2] / ".env")


@lru_cache(maxsize=1)
def get_supabase_client() -> Client:
    """
    Get a singleton Supabase client instance.
    
    Environment variables required:
    - SUPABASE_URL: Your Supabase project URL
    - SUPABASE_KEY: Your Supabase anon/public key
    
    Returns:
        Client: Initialized Supabase client
        
    Raises:
        ValueError: If required environment variables are missing
    """
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_ANON_KEY")
    
    if not supabase_url or not supabase_key:
        raise ValueError(
            "SUPABASE_URL and SUPABASE_KEY must be set in environment variables"
        )
    
    return create_client(supabase_url, supabase_key)


# Export the client getter
supabase = get_supabase_client
