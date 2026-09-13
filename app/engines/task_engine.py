from sqlalchemy.orm import Session

from app.schemas.task import TaskResponse
from app.services.task_normalizer import normalize_task
from app.services.task_service import create_task


def execute_create_task(
    action: dict,
    db: Session,
    current_user
):
    task = normalize_task(action)

    saved_task = create_task(
        db,
        task,
        current_user.id
    )

    return {
        "type": "task",
        "message": "Task created successfully.",
        "task": TaskResponse.model_validate(
            saved_task
        ).model_dump()
    }