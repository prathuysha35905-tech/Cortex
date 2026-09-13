from sqlalchemy.orm import Session

from app.models.task import Task

from app.scheduler.ai_scheduler import generate_schedule
from app.scheduler.utils import (
    extract_busy_slots,
    find_free_slots,
)

from app.integrations.google_calendar.service import (
    get_today_events,
)
from app.integrations.google_calendar.client import (
    get_calendar_service,
)


PRIORITY_ORDER = {
    "High": 1,
    "Medium": 2,
    "Low": 3,
}


def generate_schedule(db: Session, user_id: int):

    tasks = (
        db.query(Task)
        .filter(
            Task.user_id == user_id,
            Task.status == "Pending",
        )
        .all()
    )

    tasks = sorted(
        tasks,
        key=lambda task: (
            PRIORITY_ORDER.get(task.priority, 4),
            task.deadline if task.deadline else task.created_at,
        ),
    )

    return {
        "tasks": [
            {
                "title": task.title,
                "priority": task.priority,
                "deadline": task.deadline,
            }
            for task in tasks
        ]
    }


from app.models.task import Task


def get_pending_tasks(db, user_id):

    return (
        db.query(Task)
        .filter(
            Task.user_id == user_id,
            Task.status == "Pending",
        )
        .order_by(
            Task.priority.desc(),
            Task.deadline.asc(),
        )
        .all()
    )





def generate_daily_schedule(
    db,
    user_id,
    credentials,
):

    calendar = get_calendar_service(
        credentials,
    )

    events = get_today_events(
        calendar,
    )

    busy_slots = extract_busy_slots(
        events,
    )

    free_slots = find_free_slots(
        busy_slots,
    )

    tasks = get_pending_tasks(
        db,
        user_id,
    )

    return generate_schedule(
        free_slots,
        tasks,
    )