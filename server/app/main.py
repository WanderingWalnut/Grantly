from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routers.grants import router as grants_router

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

app.include_router(grants_router, prefix="/api/grants")


@app.get("/")
def read_root():
    return {"message": "Welcome to the AI-Powered Grant Assistant API"}

