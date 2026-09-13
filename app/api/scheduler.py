from sqlalchemy.orm import Session

from app.models.task import Task
from fastapi import APIRouter, Depends


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


router = APIRouter(
    prefix="/scheduler",
    tags=["Smart Scheduler"],
)