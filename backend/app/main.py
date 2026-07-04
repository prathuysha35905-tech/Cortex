from fastapi import FastAPI
from app.database.database import engine
from app.database.base import Base
from app.core.config import settings

import app.models.task
print(Base.metadata.tables.keys())
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Cortex API",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "Welcome to Cortex 🚀",
        "database": settings.DB_NAME,
    }