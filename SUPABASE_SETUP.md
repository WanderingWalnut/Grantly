# Supabase Setup Guide for Grantly

This guide will help you set up Supabase authentication and database for the Grantly application.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A Supabase project

## Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in the project details:
   - Name: `Grantly` (or your preferred name)
   - Database Password: (save this securely)
   - Region: Choose closest to your location
4. Click "Create new project"

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: This is your `SUPABASE_URL`
   - **anon/public key**: This is your `SUPABASE_KEY` / `VITE_SUPABASE_ANON_KEY`

## Step 3: Create Database Tables

Run this SQL in the Supabase SQL Editor (**SQL Editor** in the left sidebar):

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_name TEXT NOT NULL,
    legal_business_name TEXT NOT NULL,
    operating_name TEXT NOT NULL,
    business_number TEXT NOT NULL,
    business_structure TEXT NOT NULL,
    address TEXT NOT NULL,
    contact_information TEXT NOT NULL,
    date_of_establishment DATE NOT NULL,
    phone_number TEXT NOT NULL,
    email_address TEXT NOT NULL,
    number_of_employees TEXT NOT NULL,
    mission_statement TEXT NOT NULL,
    company_description TEXT NOT NULL,
    target_beneficiaries TEXT NOT NULL,
    organization_type TEXT NOT NULL,
    year_established INTEGER NOT NULL,
    annual_budget TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_organizations_user_id ON organizations(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own organizations
CREATE POLICY "Users can view their own organizations"
    ON organizations FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy: Users can create organizations
CREATE POLICY "Users can create their own organizations"
    ON organizations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own organizations
CREATE POLICY "Users can update their own organizations"
    ON organizations FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own organizations
CREATE POLICY "Users can delete their own organizations"
    ON organizations FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Step 4: Configure Authentication Settings

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Ensure **Email** provider is enabled
3. Configure email templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize the confirmation and password reset emails

### Email Configuration Options:

#### Option 1: Development (Disable Email Confirmation)
For development, you can disable email confirmation:
1. Go to **Authentication** → **Settings**
2. Scroll to **Email Auth**
3. Disable "Enable email confirmations"

#### Option 2: Production (Use SMTP)
For production, configure SMTP:
1. Go to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Configure your SMTP provider (SendGrid, Mailgun, etc.)

## Step 5: Configure Environment Variables

### Backend (.env in /server directory):

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key-here

# Other existing variables
GRANT_FINDER_MODE=mock
PERPLEXITY_API_KEY=your-perplexity-api-key
PERPLEXITY_MODEL=sonar-small-online
PERPLEXITY_BASE_URL=https://api.perplexity.ai
HTTP_TIMEOUT_SECONDS=20
```

### Frontend (.env in /client directory):

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_BASE_URL=http://localhost:8000
```

## Step 6: Install Dependencies

### Backend:
```bash
cd server
pip install -r requirements.txt
```

### Frontend:
```bash
cd client
npm install
```

## Step 7: Run the Application

### Start Backend:
```bash
cd server
# Activate virtual environment if needed
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Start Frontend:
```bash
cd client
npm run dev
```

The application should now be running at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Testing the Integration

1. **Sign Up**:
   - Navigate to http://localhost:5173/signup
   - Create a new account with email and password
   - You should be redirected to the intake form

2. **Fill Intake Form**:
   - Complete the organization profile form
   - Submit the form
   - Data should be saved to Supabase
   - You should be redirected to the dashboard

3. **Verify in Supabase**:
   - Go to your Supabase project
   - Navigate to **Table Editor** → **organizations**
   - You should see your organization data
   - Navigate to **Authentication** → **Users**
   - You should see your user account

4. **Sign In**:
   - Sign out and go to http://localhost:5173
   - Sign in with your credentials
   - You should be redirected to the dashboard

## Troubleshooting

### "Failed to create organization"
- Check that RLS policies are correctly set up
- Verify the user is authenticated (check browser console for auth errors)
- Check backend logs for detailed error messages

### "Invalid or expired token"
- Clear browser localStorage and cookies
- Sign in again
- Check that SUPABASE_URL and SUPABASE_KEY match between frontend and backend

### CORS Errors
- Ensure backend CORS is configured correctly in `app/main.py`
- Check that frontend is running on the allowed origin (localhost:5173)

### Email Confirmation Issues
- For development, disable email confirmation in Supabase settings
- For production, configure SMTP properly

## Security Notes

1. **Never commit .env files** - They contain sensitive credentials
2. **Use environment variables** - Never hardcode API keys
3. **Row Level Security** - All policies are set up to ensure users can only access their own data
4. **HTTPS in Production** - Always use HTTPS in production environments
5. **Rotate Keys** - Rotate API keys periodically for security

## Next Steps

After successful setup:
1. Test all authentication flows
2. Test organization CRUD operations
3. Configure production environment variables
4. Set up proper email providers for production
5. Consider adding multi-factor authentication (Supabase supports this)

## Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
