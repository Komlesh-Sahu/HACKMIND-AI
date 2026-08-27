from fastapi import FastAPI
from app.main import app as hackmind_app

app = FastAPI()

app.mount("/api", hackmind_app)