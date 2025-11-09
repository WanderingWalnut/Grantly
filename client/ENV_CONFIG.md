# Environment Configuration Guide

## Overview
All environment variables for the Grantly client application are managed through the `/client/.env` file and accessed via the centralized config module at `/client/src/config/env.ts`.

## Environment Variables

### Required Variables

#### Supabase Configuration
- **VITE_SUPABASE_URL**: Your Supabase project URL
  - Current: `https://sdwuipmegziuxgplfryq.supabase.co`
  - Used for: Database connection and authentication

- **VITE_SUPABASE_ANON_KEY**: Your Supabase anonymous/public key
  - Used for: Client-side authentication and database queries
  - ⚠️ This is a public key and safe to commit

#### API Configuration
- **VITE_API_BASE_URL**: Backend API base URL
  - Default: `http://localhost:8000`
  - Production: Set to your deployed backend URL
  - Used for: All API calls to the FastAPI backend

### Optional Variables

#### AI Services
- **VITE_GEMINI_API_KEY**: Google Gemini API key
  - Used for: AI-powered grant summarization
  - Get your key from: https://makersuite.google.com/app/apikey
  - ⚠️ Keep this secret! Do not commit to version control
  - If not set: Grant summarization features will be disabled

## Setup Instructions

1. **Initial Setup**
   - The `.env` file already exists in `/client` with all necessary variables configured
   - If you need to modify any values, edit the `.env` file directly

2. **Configure Variables**
   - Open `.env` file in `/client` directory
   - Update `VITE_GEMINI_API_KEY` with your actual API key if needed
   - Adjust `VITE_API_BASE_URL` if your backend runs on a different port

3. **Development**
   ```bash
   npm install
   npm run dev
   ```

## File Structure

```
client/
├── .env                          # Active environment variables
└── src/
    ├── config/
    │   └── env.ts               # Centralized config module
    ├── lib/
    │   └── supabaseClient.ts    # Uses SUPABASE_URL, SUPABASE_ANON_KEY
    ├── services/
    │   ├── gemini.ts            # Uses GEMINI_API_KEY
    │   └── grants.ts            # Uses API_BASE_URL
    ├── context/
    │   └── OrganizationContext.tsx  # Uses API_BASE_URL
    └── pages/
        └── intake-form/
            └── IntakeForm.tsx   # Uses API_BASE_URL
```

## Best Practices

1. **Environment file management**
   - The `.env` file is committed with non-secret values for convenience
   - Update secret keys (like GEMINI_API_KEY) locally as needed

2. **Use the centralized config**
   - Import from `../config/env` instead of using `import.meta.env` directly
   - This provides type safety and validation

3. **Prefix with VITE_**
   - Vite requires all environment variables to start with `VITE_`
   - Variables without this prefix won't be exposed to the client

4. **Restart dev server**
   - Changes to `.env` require restarting the dev server
   - Stop (Ctrl+C) and run `npm run dev` again

## Validation

The config module (`src/config/env.ts`) automatically validates environment variables on startup:
- **Errors**: Missing required variables (Supabase, API URL)
- **Warnings**: Missing optional variables (Gemini API key)

## Troubleshooting

### "Missing Supabase environment variables"
- Check that `.env` file exists in `/client` directory
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart the dev server

### "Missing Gemini API key"
- This is a warning, not an error
- Grant summarization features will be disabled
- Add `VITE_GEMINI_API_KEY` to `.env` to enable AI features

### API calls failing
- Verify `VITE_API_BASE_URL` matches your backend URL
- Ensure backend server is running
- Check for CORS issues in browser console

## Production Deployment

For production deployments (e.g., Vercel, Netlify):

1. Set environment variables in your hosting platform's dashboard
2. Use the same variable names (VITE_SUPABASE_URL, etc.)
3. Update `VITE_API_BASE_URL` to your production backend URL
4. Never expose secret keys (like GEMINI_API_KEY) in client-side code for production
   - Consider moving AI processing to backend for production use

## Security Notes

- ✅ Safe to commit: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL`
- ❌ Never commit: `VITE_GEMINI_API_KEY` (secret key)
- Consider moving AI API calls to backend in production to protect API keys
