from fastapi import FastAPI
from app.database.database import engine
from app.database.base import Base
from app.core.config import settings
from app.api.tasks import router as task_router


import app.models.task
print(Base.metadata.tables.keys())
Base.metadata.create_all(bind=engine)
from app.api.chat import router as chat_router
app = FastAPI(
    title="Cortex API",
    version="1.0.0"
)
app.include_router(chat_router)
app.include_router(task_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to Cortex 🚀",
        "database": settings.DB_NAME,
    }