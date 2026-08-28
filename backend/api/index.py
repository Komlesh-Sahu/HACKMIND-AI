from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.main import app as core_app

app = FastAPI(
    title="HACKMIND AI",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://hackmind-ai.vercel.app",
        "https://hackmind-ai-dusky.vercel.app",
        "https://hackmind-ai-sigma.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Automatically add /api before all existing HACKMIND routes
app.include_router(core_app.router, prefix="/api")