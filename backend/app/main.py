from fastapi import FastAPI
from app.database.database import engine
from app.database.base import Base
from app.core.config import settings
from app.api.tasks import router as task_router
from app.api.habits import router as habit_router
from app.api.coach import router as coach_router
from app.api.auth import router as auth_router
from app.api.analytics import router as analytics_router
from app.api.memory import router as memory_router


import app.models.task
import app.models.habit
import app.models.user
print(Base.metadata.tables.keys())
Base.metadata.create_all(bind=engine)
from app.api.chat import router as chat_router
app = FastAPI(
    title="Cortex API",
    version="1.0.0"
)
app.include_router(chat_router)
app.include_router(task_router)
app.include_router(habit_router)
app.include_router(coach_router)
app.include_router(auth_router)
app.include_router(analytics_router)
app.include_router(memory_router)
@app.get("/")
def home():
    return {
        "message": "Welcome to Cortex 🚀",
        "database": settings.DB_NAME,
    }
