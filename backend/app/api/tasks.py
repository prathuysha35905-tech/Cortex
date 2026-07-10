from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.task import TaskCreate, TaskResponse
from app.core.auth import get_current_user
from app.models.user import User
from app.services.task_service import (
    create_task,
    get_all_tasks,
    get_task,
    update_task,
    delete_task
)
router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("/")
def create_new_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_task(
        db,
        task,
        current_user.id
    )


@router.get("/")
def get_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_all_tasks(
        db,
        current_user.id
    )


@router.get("/{task_id}", response_model=TaskResponse)
def read_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    return get_task(db, task_id)

@router.put("/{task_id}", response_model=TaskResponse)
def update_existing_task(
    task_id: int,
    task: TaskCreate,
    db: Session = Depends(get_db)
):
    updated_task = update_task(db, task_id, task)

    if updated_task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return updated_task

@router.delete("/{task_id}")
def delete_existing_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    deleted_task = delete_task(db, task_id)

    if deleted_task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return {
        "message": "Task deleted successfully."
    }