from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.concierge import router as concierge_router
from app.api.auditor import router as auditor_router
from app.api.matcher import router as matcher_router
from app.api.agent import router as agent_router


app = FastAPI(
    title="HACKMIND AI",
    description="Autonomous Hackathon Concierge & Event Operations Agent",
    version="1.0.0"
)


# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://hackmind-ai.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register HACKMIND modules
app.include_router(concierge_router)
app.include_router(auditor_router)
app.include_router(matcher_router)
app.include_router(agent_router)


@app.get("/")
def home():
    return {
        "message": "HACKMIND AI Backend is running!"
    }