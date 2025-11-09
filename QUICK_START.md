# Quick Start Guide - Grantly with Supabase

## ✅ Configuration Complete!

Your Supabase credentials have been added to all necessary files.

### Your Supabase Project Details

- **Project URL**: `https://sdwuipmegziuxgplfryq.supabase.co`
- **Project Ref**: `sdwuipmegziuxgplfryq`
- **Region**: Configured in your Supabase dashboard

## 🚀 Start the Application

### Option 1: Quick Start (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd /Users/kash/Documents/Grantly/server
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd /Users/kash/Documents/Grantly/client
npm run dev
```

### Option 2: Using the Run Script
```bash
cd /Users/kash/Documents/Grantly
./run.sh  # Starts the backend
# Then in another terminal:
cd client && npm run dev
```

## 📋 Before First Run - Database Setup

You need to create the database tables in Supabase. Here's the SQL to run:

### 1. Go to Supabase SQL Editor
Visit: https://supabase.com/dashboard/project/sdwuipmegziuxgplfryq/sql

### 2. Run This SQL

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

-- Create policies: Users can only see their own organizations
CREATE POLICY "Users can view their own organizations"
    ON organizations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own organizations"
    ON organizations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own organizations"
    ON organizations FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

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

## 🧪 Test the Integration

1. **Start both backend and frontend** (see above)

2. **Sign Up**:
   - Visit: http://localhost:5173/signup
   - Create an account with your email and password
   - You'll be redirected to the intake form

3. **Fill Intake Form**:
   - Complete the organization profile form
   - Submit → Data saved to Supabase
   - Redirected to dashboard

4. **Verify in Supabase**:
   - Go to: https://supabase.com/dashboard/project/sdwuipmegziuxgplfryq/editor
   - Check `organizations` table for your data
   - Check `Authentication > Users` for your account

5. **Sign In**:
   - Visit: http://localhost:5173/
   - Sign in with your credentials
   - Access your dashboard

## 📡 Your Endpoints

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Supabase Dashboard**: https://supabase.com/dashboard/project/sdwuipmegziuxgplfryq

## 🔧 Development Tips

### Check Backend Logs
The terminal running `uvicorn` will show:
- Incoming requests
- Database operations
- Authentication events
- Errors and stack traces

### Check Frontend Console
Open browser DevTools (F12) to see:
- Supabase auth state changes
- API call responses
- React component errors

### Supabase Dashboard
Monitor in real-time:
- **Table Editor**: View organization data
- **Authentication**: See registered users
- **Logs**: View database queries and auth events
- **API**: Check usage and performance

## 🐛 Common Issues

### "Invalid or expired token"
- Clear browser localStorage: DevTools > Application > Local Storage
- Sign in again

### "Failed to create organization"
- Check backend logs for detailed error
- Verify RLS policies are set up in Supabase
- Make sure you're authenticated (check browser console)

### Backend won't start
```bash
cd server
source venv/bin/activate
pip install -r requirements.txt
```

### Frontend won't start
```bash
cd client
npm install
```

## 📚 Full Documentation

- **Complete Setup**: `SUPABASE_SETUP.md`
- **API Reference**: `API_DOCUMENTATION.md`
- **Integration Guide**: `SUPABASE_INTEGRATION.md`
- **All Changes**: `CHANGES.md`

## 🔐 Security Notes

✅ **NEVER commit .env files to git** - they contain sensitive credentials
✅ The `.env` files are in `.gitignore`
✅ Only use ANON key in frontend (already configured)
✅ Service Role key is ONLY for backend (already configured)
✅ Row Level Security ensures users only see their own data

## 🎉 You're All Set!

Your Grantly application is configured and ready to go. Just:
1. Run the SQL in Supabase (one-time setup)
2. Start the backend
3. Start the frontend
4. Create an account and test!

Happy coding! 🚀
