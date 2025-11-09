/**
 * Centralized environment configuration
 * All environment variables should be accessed through this file
 */

// Supabase Configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// AI Services
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Validation
const requiredEnvVars = {
  VITE_SUPABASE_URL: SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: SUPABASE_ANON_KEY,
  VITE_API_BASE_URL: API_BASE_URL,
};

// Check for missing required environment variables
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    console.error(`Missing required environment variable: ${key}`);
  }
});

// Optional environment variables (warn but don't block)
if (!GEMINI_API_KEY) {
  console.warn('VITE_GEMINI_API_KEY not set. AI-powered grant summarization will be disabled.');
}

export default {
  supabase: {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
  },
  api: {
    baseUrl: API_BASE_URL,
  },
  gemini: {
    apiKey: GEMINI_API_KEY,
  },
};
