# Grantly - Supabase Integration Setup

## Overview

This document provides a quick reference for the Supabase authentication and database integration added to Grantly.

## What's Been Added

### Backend (FastAPI)

1. **Authentication System** (`/server/app/db/` and `/server/app/routers/`)
   - Supabase client configuration
   - Auth service with signup, signin, signout, token refresh
   - Auth router with FastAPI endpoints
   - Protected routes using JWT tokens

2. **Organization Management** (`/server/app/db/` and `/server/app/routers/`)
   - Organization service for CRUD operations
   - Organization schemas (Pydantic models)
   - Organization router with authenticated endpoints
   - Automatic user-organization linking

3. **API Enhancements**
   - CORS middleware for frontend communication
   - New routers: `/api/auth` and `/api/organizations`
   - Token-based authentication dependency injection

### Frontend (React)

1. **Authentication Context** (`/client/src/context/AuthContext.tsx`)
   - Global auth state management
   - Supabase client integration
   - Sign up, sign in, sign out functions
   - Automatic session management

2. **Updated Components**
   - **Login Page**: Integrated with Supabase auth
   - **Signup Page**: Creates Supabase account, redirects to intake form
   - **Intake Form**: Saves organization data to database via API
   - All include error handling and loading states

3. **Supabase Client** (`/client/src/lib/supabaseClient.ts`)
   - Configured Supabase JavaScript client
   - Environment variable based configuration

## Quick Start

### 1. Install Dependencies

```bash
# Backend
cd server
pip install -r requirements.txt

# Frontend
cd client
npm install
```

### 2. Set Up Supabase

Follow the detailed guide in `SUPABASE_SETUP.md`:
1. Create a Supabase project
2. Get your API keys
3. Run the SQL to create tables
4. Configure authentication settings

### 3. Configure Environment Variables

**Backend** (`/server/.env`):
```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key-here
```

**Frontend** (`/client/.env`):
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_BASE_URL=http://localhost:8000
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 5. Test the Flow

1. **Sign Up**: http://localhost:5173/signup
   - Create account → Redirected to intake form

2. **Fill Intake Form**: http://localhost:5173/intake-form
   - Complete form → Data saved to Supabase → Redirected to dashboard

3. **Sign In**: http://localhost:5173/
   - Login with credentials → Access dashboard

## Architecture

### Authentication Flow

```
User → Frontend (Supabase JS Client) → Supabase Auth
                                      ↓
                              JWT Access Token
                                      ↓
Frontend → Backend API (with token) → Verify Token → Supabase
                                                    ↓
                                              Process Request
```

### Data Flow (Intake Form)

```
User fills form → Submit
                    ↓
              Get auth token
                    ↓
          POST /api/organizations/
                    ↓
      Backend verifies token → Extract user_id
                    ↓
        Save to Supabase organizations table
                    ↓
              Return success
                    ↓
          Redirect to dashboard
```

## Key Files

### Backend
- `server/app/db/supabase_client.py` - Supabase client singleton
- `server/app/db/auth_service.py` - Authentication business logic
- `server/app/db/organization_service.py` - Organization CRUD operations
- `server/app/routers/auth.py` - Auth API endpoints
- `server/app/routers/nonprofits.py` - Organization API endpoints
- `server/app/schemas/auth.py` - Auth request/response models
- `server/app/schemas/organization.py` - Organization models
- `server/app/main.py` - Updated with new routers and CORS

### Frontend
- `client/src/lib/supabaseClient.ts` - Supabase client configuration
- `client/src/context/AuthContext.tsx` - Global auth state
- `client/src/pages/auth/Login.tsx` - Login page with Supabase
- `client/src/pages/auth/Signup.tsx` - Signup page with Supabase
- `client/src/pages/intake-form/IntakeForm.tsx` - Saves to database
- `client/src/App.tsx` - Wrapped with AuthProvider

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `GET /api/auth/user` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Organizations
- `POST /api/organizations/` - Create organization (requires auth)
- `GET /api/organizations/` - Get user's organization (requires auth)
- `PUT /api/organizations/` - Update organization (requires auth)
- `DELETE /api/organizations/` - Delete organization (requires auth)

See `API_DOCUMENTATION.md` for detailed API reference.

## Database Schema

### organizations table
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key to auth.users)
- organization_name (TEXT)
- legal_business_name (TEXT)
- operating_name (TEXT)
- business_number (TEXT)
- business_structure (TEXT)
- address (TEXT)
- contact_information (TEXT)
- date_of_establishment (DATE)
- phone_number (TEXT)
- email_address (TEXT)
- number_of_employees (TEXT)
- mission_statement (TEXT)
- company_description (TEXT)
- target_beneficiaries (TEXT)
- organization_type (TEXT)
- year_established (INTEGER)
- annual_budget (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Security Features

1. **Row Level Security (RLS)**: Users can only access their own organization data
2. **JWT Authentication**: All protected routes require valid access tokens
3. **Password Requirements**: Minimum 6 characters (enforced by Supabase)
4. **Secure Token Storage**: Tokens managed by Supabase JS client
5. **CORS Protection**: Only allowed origins can access the API

## Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
Run `npm install` in the client directory.

### "gotrue.errors could not be resolved"
Run `pip install -r requirements.txt` in the server directory.

### "Invalid or expired token"
- Clear browser cache and localStorage
- Sign in again
- Check that environment variables match

### "Failed to create organization"
- Verify user is authenticated
- Check backend logs for detailed errors
- Verify RLS policies in Supabase

### CORS errors
- Check CORS configuration in `server/app/main.py`
- Verify frontend URL matches allowed origins

## Next Steps

1. **Email Verification**: Configure SMTP in Supabase for production
2. **Password Reset**: Implement password reset flow
3. **Profile Management**: Add profile update functionality
4. **Multi-Factor Auth**: Enable MFA in Supabase settings
5. **OAuth Providers**: Add Google/GitHub sign-in options

## Additional Resources

- [Full Supabase Setup Guide](./SUPABASE_SETUP.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Supabase Documentation](https://supabase.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the Supabase Setup Guide
3. Check backend logs: `uvicorn` terminal output
4. Check frontend console: Browser Developer Tools
5. Verify environment variables are set correctly
