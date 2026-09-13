from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import engine
from app.database.base import Base


# =========================
# IMPORT MODELS
# =========================

import app.models.user
import app.models.task
import app.models.goal
import app.models.habit
import app.models.habit_log
import app.models.memory
import app.models.notification
import app.models.google_account
import app.models.calendar_event


# =========================
# IMPORT API ROUTERS
# =========================

from app.api.auth import router as auth_router
from app.api.tasks import router as tasks_router
from app.api.planner import router as planner_router
from app.api.goals import router as goals_router
from app.api.habits import router as habits_router
from app.api.analytics import router as analytics_router
from app.api.chat import router as chat_router
from app.api.coach import router as coach_router
from app.api.insights import router as insights_router
from app.api.memory import router as memory_router
from app.api.morning import router as morning_router
from app.api.notification import router as notification_router
from app.api.recommendations import router as recommendations_router
from app.api.scheduler import router as scheduler_router
from app.api.summary import router as summary_router
from app.api.weekly import router as weekly_router


# =========================
# IMPORT FEATURE ROUTERS
# =========================

from app.dashboard.router import router as dashboard_router

from app.integrations.google_calendar.router import (
    router as google_calendar_router
)


# =========================
# CREATE DATABASE TABLES
# =========================

Base.metadata.create_all(bind=engine)


# =========================
# CREATE FASTAPI APP
# =========================

app = FastAPI(
    title="Cortex API",
    version="1.0.0"
)


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# REGISTER API ROUTERS
# =========================

app.include_router(auth_router)

app.include_router(tasks_router)
app.include_router(planner_router)
app.include_router(goals_router)
app.include_router(habits_router)

app.include_router(dashboard_router)
app.include_router(analytics_router)

app.include_router(chat_router)
app.include_router(coach_router)
app.include_router(insights_router)
app.include_router(memory_router)

app.include_router(morning_router)
app.include_router(weekly_router)
app.include_router(summary_router)

app.include_router(notification_router)
app.include_router(recommendations_router)
app.include_router(scheduler_router)

app.include_router(google_calendar_router)


# =========================
# HEALTH CHECK
# =========================

@app.get("/")
def root():
    return {
        "message": "Cortex API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }