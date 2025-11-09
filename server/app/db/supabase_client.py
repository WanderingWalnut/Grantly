"""Supabase client configuration and initialization."""
import os
from functools import lru_cache
from pathlib import Path

from supabase import create_client, Client
from dotenv import load_dotenv

# Load .env file from server directory (parent of app directory)
server_dir = Path(__file__).parent.parent.parent
env_path = server_dir / '.env'
load_dotenv(dotenv_path=env_path)


@lru_cache(maxsize=1)
def get_supabase_client() -> Client:
    """
    Get a singleton Supabase client instance.
    
    Environment variables required:
    - SUPABASE_URL: Your Supabase project URL
    - SUPABASE_ANON_KEY: Your Supabase anon/public key
    
    Returns:
        Client: Initialized Supabase client
        
    Raises:
        ValueError: If required environment variables are missing
    """
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_ANON_KEY")
    
    if not supabase_url or not supabase_key:
        raise ValueError(
            "SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables. "
            "Create a .env file in the server directory with these values."
        )
    
    return create_client(supabase_url, supabase_key)


# Export the client getter
supabase = get_supabase_client
