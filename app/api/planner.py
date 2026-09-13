from datetime import date as date_type

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.task import Task
from app.services.planner_ai_service import plan_day_with_ai

router = APIRouter(
    prefix="/planner",
    tags=["Planner"],
)


def _task_to_entry(task: Task) -> dict:
    time_str = task.deadline.strftime("%H:%M") if task.deadline else ""
    status = "Done" if task.status == "Completed" else "Upcoming"
    return {
        "id": task.id,
        "title": task.title,
        "time": time_str,
        "duration": task.duration or "",
        "priority": task.priority,
        "status": status,
    }


@router.get("/")
def get_planner_entries(
    date: date_type = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # There's no dedicated "planner entry" storage on the backend -- the
    # planner is a day-view of the user's tasks for that date, built from
    # their `deadline`.
    tasks = (
        db.query(Task)
        .filter(Task.user_id == current_user.id)
        .all()
    )

    day_tasks = [t for t in tasks if t.deadline and t.deadline.date() == date]
    day_tasks.sort(key=lambda t: t.deadline)

    return [_task_to_entry(t) for t in day_tasks]


@router.post("/ai-generate")
def ai_generate_plan(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    date_str = payload.get("date")

    if not date_str:
        raise HTTPException(status_code=422, detail="date is required.")

    try:
        target_date = date_type.fromisoformat(date_str)
    except ValueError:
        raise HTTPException(status_code=422, detail="date must be YYYY-MM-DD.")

    tasks = (
        db.query(Task)
        .filter(Task.user_id == current_user.id)
        .all()
    )

    day_tasks = [t for t in tasks if t.deadline and t.deadline.date() == target_date]

    if not day_tasks:
        return []

    # plan_day_with_ai calls the user's local LM Studio instance -- if
    # it's unreachable or returns something that isn't valid JSON, don't
    # crash the endpoint; fall back to the plain (non-AI) task listing.
    try:
        ai_plan = plan_day_with_ai(day_tasks)
        if isinstance(ai_plan, list):
            return ai_plan
    except Exception:
        pass

    return [_task_to_entry(t) for t in day_tasks]
