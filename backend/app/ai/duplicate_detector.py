from sqlalchemy.orm import Session

from app.models.task import Task
from app.models.goal import Goal


def task_exists(
    db: Session,
    user_id: int,
    title: str
) -> bool:

    return (
        db.query(Task)
        .filter(
            Task.user_id == user_id,
            Task.title.ilike(title),
            Task.is_archived == False
        )
        .first()
        is not None
    )


def goal_exists(
    db: Session,
    user_id: int,
    title: str
) -> bool:

    return (
        db.query(Goal)
        .filter(
            Goal.user_id == user_id,
            Goal.title.ilike(title),
            Goal.is_archived == False
        )
        .first()
        is not None
    )