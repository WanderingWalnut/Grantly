# Grantly

**AI-powered grant assistant that helps nonprofits access government funding more easily.**

Many community organizations drive real social impact but lack the time or resources to navigate complex grant portals. Grantly generates tailored application responses from your nonprofit's profile, automatically fills official grant forms, and lets you securely review and submit the final application. Our goal isn't to replace human effort but to **augment impact by freeing small organizations to focus on service delivery instead of paperwork**.

## 🎯 Mission

Support vulnerable and under-resourced groups through better funding access, strengthening financial resilience of community organizations.

## ✨ Key Features

- **Grant Discovery**: Intelligent matching of grant opportunities to your organization's profile and mission
- **AI-Powered Draft Generation**: Google Gemini generates tailored application responses from your nonprofit profile
- **Automated Form Filling**: Browserbase cloud browser automation prefills official grant forms with generated responses
- **Review & Edit Workspace**: Secure review interface to refine AI-generated answers before submission
- **Application Tracking**: Monitor application status and manage multiple grant submissions
- **Organization Profile Management**: Centralized profile that powers all grant applications

## 🏗️ Architecture

### Backend (`server/`)

- **Framework**: FastAPI (Python)
- **AI Integration**: Google Gemini for draft generation
- **Automation**: Browserbase + Playwright for form filling
- **Database**: Supabase (PostgreSQL) for user data and organization profiles
- **PDF Processing**: pypdf for extracting grant application text

### Frontend (`client/`)

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: React Context API
- **UI**: Tailwind CSS with custom design system

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+ and pnpm
- Supabase account
- Browserbase API key
- Google Gemini API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Grantly
   ```

2. **Install backend dependencies**

   ```bash
   cd server
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../client
   pnpm install
   ```

4. **Configure environment variables**

   Create `server/.env`:

   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_service_role_key
   GEMINI_API_KEY=your_gemini_api_key
   BROWSERBASE_API_KEY=your_browserbase_api_key
   BROWSERBASE_PROJECT_ID=your_browserbase_project_id
   ```

   Create `client/.env`:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_BASE_URL=http://localhost:8000
   ```

5. **Set up database**

   Run the SQL schema in your Supabase SQL Editor (see `QUICK_START.md` for full schema).

6. **Start the application**

   **Terminal 1 - Backend:**

   ```bash
   cd server
   source venv/bin/activate
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   **Terminal 2 - Frontend:**

   ```bash
   cd client
   pnpm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 📋 Workflow

1. **Create Profile**: Set up your nonprofit organization profile with mission, programs, and key details
2. **Discover Grants**: Browse matched grant opportunities based on your profile
3. **Generate Draft**: AI creates tailored application responses from your profile and the grant PDF
4. **Review & Edit**: Refine AI-generated answers in the review workspace
5. **Auto-Fill Forms**: Browserbase automatically fills the official grant portal forms
6. **Submit**: Review the prefilled form and submit your application

## 🔐 Security

- JWT-based authentication via Supabase
- Row Level Security (RLS) for database access control
- Environment variables for sensitive credentials
- User data isolation (users only access their own data)

## 📚 Documentation

- **Quick Start Guide**: `QUICK_START.md` - Detailed setup instructions
- **API Documentation**: Available at `/docs` when backend is running
- **Changes Log**: `CHANGES.md` - Recent updates and improvements

## 🤝 Contributing

This project is designed to support community organizations. Contributions that improve accessibility, reduce complexity, or enhance the grant application process are welcome.

## 📄 License

[Add your license here]

---

**Built with ❤️ to help nonprofits focus on what matters: serving their communities.**
