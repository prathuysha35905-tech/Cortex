from sqlalchemy.orm import Session

from app.models.task import Task
from app.schemas.task import TaskCreate


def create_task(db: Session, task: TaskCreate) -> Task:
    new_task = Task(
        title=task.title,
        description=task.description,
        priority=task.priority,
        category=task.category,
        deadline=task.deadline,
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task