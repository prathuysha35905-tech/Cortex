

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.task import Task
from app.models.habit import Habit

from app.analytics.service import (
    get_task_analytics,
    get_goal_analytics,
    get_habit_analytics,
    calculate_productivity_score,
)



router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get("/")
def analytics_summary(
    range: str = Query("week"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # NOTE: the backend does not log historical daily/weekly snapshots
    # (no completed_at timestamps, no per-day activity log), so a true
    # trend over the requested `range` can't be computed. Everything
    # below is derived only from data that actually exists right now --
    # nothing here is fabricated, but "productivity" and "task
    # completion" reflect current state grouped by weekday, not a real
    # trend over time, and focus hours are all zero since there is no
    # time-tracking on tasks at all.
    weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    tasks = (
        db.query(Task)
        .filter(Task.user_id == current_user.id)
        .all()
    )

    habits = (
        db.query(Habit)
        .filter(Habit.user_id == current_user.id)
        .all()
    )

    productivity = []
    for i, day in enumerate(weekdays):
        day_tasks = [t for t in tasks if t.deadline and t.deadline.weekday() == i]
        if day_tasks:
            done = sum(1 for t in day_tasks if t.status == "Completed")
            value = round(done / len(day_tasks) * 100)
        else:
            value = 0
        productivity.append({"day": day, "value": value})

    completed_count = sum(1 for t in tasks if t.status == "Completed")
    task_completion_value = round(completed_count / len(tasks) * 100) if tasks else 0

    habits_done_today = sum(1 for h in habits if h.completed_today)
    habit_consistency_value = round(habits_done_today / len(habits) * 100) if habits else 0

    return {
        "productivity": productivity,
        "taskCompletion": [{"period": range, "value": task_completion_value}],
        "habitConsistency": [{"period": range, "value": habit_consistency_value}],
        "focusHours": [{"day": day, "hours": 0} for day in weekdays],
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