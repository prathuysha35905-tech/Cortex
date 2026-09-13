from fastapi import FastAPI
from app.database.database import engine
from app.database.base import Base
from app.core.config import settings
from app.api.tasks import router as task_router
from app.api.habits import router as habit_router
from app.api.coach import router as coach_router
from app.api.auth import router as auth_router
from app.dashboard.router import router as dashboard_router
from app.api.analytics import router as analytics_router
from app.api.memory import router as memory_router
from app.models.goal import Goal
from app.api.goals import router as goals_router
from app.core.exceptions import register_exception_handlers
from app.integrations.google_calendar.router import (
    router as calendar_router
)
from app.models.google_account import GoogleAccount
from app.notifications.scheduler import start_scheduler
from app.models.notification import Notification
from app.api.notification import router as notification_router
from app.api.analytics import router as analytics_router
from app.api.insights import router as insights_router
from app.api.summary import router as summary_router
from app.api.scheduler import router as scheduler_router
from app.api.recommendations import router as recommendations_router
from app.core.logging import logger
from app.api.weekly import router as weekly_router
from app.api.morning import router as morning_router


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

register_exception_handlers(app) 



app.include_router(chat_router)
app.include_router(task_router)
app.include_router(habit_router)
app.include_router(coach_router)
app.include_router(auth_router)
app.include_router(analytics_router)
app.include_router(memory_router)
app.include_router(goals_router)
app.include_router(calendar_router)
app.include_router(notification_router)
app.include_router(analytics_router)
app.include_router(insights_router)
app.include_router(summary_router)
app.include_router(scheduler_router)
app.include_router(recommendations_router)
app.include_router(weekly_router)
app.include_router(morning_router)
app.include_router(dashboard_router)
logger.info("🚀 Cortex backend started successfully.")


start_scheduler()
@app.get("/")
def home():
    return {
        "message": "Welcome to Cortex 🚀",
        "database": settings.DB_NAME,
    }
