#!/usr/bin/env bash
# Grantly Installation Script

set -e

echo "🚀 Grantly Installation Script"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "SUPABASE_SETUP.md" ]; then
    echo "❌ Error: Please run this script from the Grantly root directory"
    exit 1
fi

echo "📦 Installing Backend Dependencies..."
cd server

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "Installing Python packages..."
pip install -r requirements.txt

echo "✅ Backend dependencies installed!"
echo ""

cd ..

echo "📦 Installing Frontend Dependencies..."
cd client

# Install npm packages
npm install

echo "✅ Frontend dependencies installed!"
echo ""

cd ..

# Check for .env files
echo "🔍 Checking environment configuration..."
if [ ! -f "server/.env" ]; then
    echo "⚠️  Warning: server/.env not found"
    echo "   Create server/.env and configure it"
    echo "   See SUPABASE_SETUP.md for instructions"
fi

if [ ! -f "client/.env" ]; then
    echo "⚠️  Warning: client/.env not found"
    echo "   Create client/.env and configure it"
    echo "   See SUPABASE_SETUP.md for instructions"
fi

echo ""
echo "✅ Installation Complete!"
echo ""
echo "📚 Next Steps:"
echo "1. Follow SUPABASE_SETUP.md to configure Supabase"
echo "2. Configure environment files (see ENV_CONFIG.md):"
echo "   - client/.env (all environment variables are here)"
echo "   - server/.env (if needed)"
echo "3. Run the backend: cd server && source venv/bin/activate && uvicorn app.main:app --reload"
echo "4. Run the frontend: cd client && npm run dev"
echo ""
echo "📖 Documentation:"
echo "- Setup Guide: SUPABASE_SETUP.md"
echo "- API Docs: API_DOCUMENTATION.md"
echo "- Integration Guide: SUPABASE_INTEGRATION.md"
echo "- Changes: CHANGES.md"
echo ""
echo "Happy coding! 🎉"
