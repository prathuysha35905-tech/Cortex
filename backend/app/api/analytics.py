

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.auth import get_current_user
from app.models.user import User

from app.analytics.service import (
    get_task_analytics,
    get_goal_analytics,
    get_habit_analytics,
    calculate_productivity_score,
    get_weekly_productivity,
)



router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get("/")
def weekly_analytics(
    range: str = Query("week"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Only "week" is supported right now (that's all the dashboard chart
    # needs) - the param is accepted either way so the call never 404s.
    return {
        "productivity": get_weekly_productivity(db, current_user.id),
    }


@router.get("/tasks")
def task_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_task_analytics(
        db,
        current_user.id,
    )


@router.get("/goals")
def goal_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_goal_analytics(
        db,
        current_user.id,
    )


@router.get("/habits")
def habit_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_habit_analytics(
        db,
        current_user.id,
    )


@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return {
        "tasks": get_task_analytics(db, current_user.id),
        "goals": get_goal_analytics(db, current_user.id),
        "habits": get_habit_analytics(db, current_user.id),
    }

@router.get("/productivity")
def productivity_score(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return calculate_productivity_score(
        db,
        current_user.id,
    )