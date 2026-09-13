from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.task import Task
from app.services.task_service import get_all_tasks
from app.engines.planning_engine import build_daily_plan

router = APIRouter(
    prefix="/planner",
    tags=["Planner"]
)


# The frontend's PlannerEntry shape (services/planner.service.ts) is
# {id, title, time, duration, priority, status}. The Task model has no
# "duration" column, so a fixed placeholder is used until tasks track one.
_STATUS_MAP = {
    "Completed": "Done",
    "Pending": "Upcoming",
}


def _to_entry(task: Task) -> dict:
    return {
        "id": task.id,
        "title": task.title,
        "time": task.deadline.strftime("%H:%M") if task.deadline else "",
        "duration": "30m",
        "priority": task.priority or "Medium",
        "status": _STATUS_MAP.get(task.status, "Upcoming"),
    }


@router.get("/")
def get_planner_entries(
    date: str = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        target_date = datetime.strptime(date, "%Y-%m-%d").date()
    except ValueError:
        return []

    tasks = (
        db.query(Task)
        .filter(
            Task.user_id == current_user.id,
            Task.is_archived == False
        )
        .all()
    )

    entries = [
        _to_entry(task) for task in tasks
        if task.deadline and task.deadline.date() == target_date
    ]
    entries.sort(key=lambda e: e["time"])

    return entries


@router.post("/ai-generate")
def ai_generate_plan(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tasks = get_all_tasks(db, current_user.id, page=1, size=1000)
    plan = build_daily_plan(tasks)

    if not isinstance(plan, list):
        return []

    entries = []
    for i, item in enumerate(plan):
        if not isinstance(item, dict):
            continue
        entries.append({
            "id": i + 1,
            "title": item.get("title", "Untitled"),
            "time": item.get("time", ""),
            "duration": item.get("duration", "30m"),
            "priority": item.get("priority", "Medium"),
            "status": "Upcoming",
        })

    return entries
