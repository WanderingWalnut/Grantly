from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routers.grants import router as grants_router
from app.routers.auth import router as auth_router
from app.routers.nonprofits import router as nonprofits_router

load_dotenv()

app = FastAPI(
    title="AI-Powered Grant Assistant",
    description="Backend API for helping nonprofits access government funding.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(nonprofits_router, prefix="/api/organizations", tags=["organizations"])
app.include_router(grants_router, prefix="/api/grants", tags=["grants"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the AI-Powered Grant Assistant API"}

