from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.core.auth import get_current_user
from app.models.user import User

from app.services.task_service import (
    create_task,
    get_all_tasks,
    search_tasks,
    get_task,
    update_task,
    update_task_partial,
    delete_task,
    archive_task,
    restore_task,
    get_archived_tasks,
    complete_task,
    filter_tasks,
)

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


# ------------------------
# CREATE TASK
# ------------------------
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
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_all_tasks(
        db=db,
        user_id=current_user.id,
        page=page,
        size=size
    )


@router.get("/search")
def search_user_tasks(
    query: str = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return search_tasks(
        db,
        current_user.id,
        query
    )

# ------------------------
# FILTER TASKS
# ------------------------
@router.get("/filter")
def filter_user_tasks(
    priority: str | None = Query(None),
    category: str | None = Query(None),
    status: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return filter_tasks(
        db=db,
        user_id=current_user.id,
        priority=priority,
        category=category,
        status=status
    )

# ------------------------
# GET ARCHIVED TASKS
# ------------------------
@router.get("/archive")
def archived_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_archived_tasks(
        db,
        current_user.id
    )


# ------------------------
# GET ONE TASK
# ------------------------
@router.get("/{task_id}", response_model=TaskResponse)
def read_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = get_task(
        db,
        task_id,
        current_user.id
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found."
        )

    return task


# ------------------------
# UPDATE TASK
# ------------------------
@router.put("/{task_id}", response_model=TaskResponse)
def update_existing_task(
    task_id: int,
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated_task = update_task(
        db,
        task_id,
        task,
        current_user.id
    )

    if updated_task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found."
        )

    return updated_task


# ------------------------
# PARTIAL UPDATE TASK
# ------------------------
@router.patch("/{task_id}", response_model=TaskResponse)
def patch_existing_task(
    task_id: int,
    task: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated_task = update_task_partial(
        db,
        task_id,
        task,
        current_user.id
    )

    if updated_task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found."
        )

    return updated_task


# ------------------------
# DELETE TASK
# ------------------------
@router.delete("/{task_id}")
def delete_existing_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    deleted_task = delete_task(
        db,
        task_id,
        current_user.id
    )

    if deleted_task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found."
        )

    return {
        "message": "Task deleted successfully."
    }


# ------------------------
# COMPLETE TASK
# ------------------------
@router.put("/{task_id}/complete", response_model=TaskResponse)
def complete_existing_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = complete_task(
        db,
        task_id,
        current_user.id
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found."
        )

    return task


# ------------------------
# ARCHIVE TASK
# ------------------------
@router.put("/{task_id}/archive")
def archive_existing_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = archive_task(
        db,
        task_id,
        current_user.id
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found."
        )

    return {
        "message": "Task archived successfully."
    }


# ------------------------
# RESTORE TASK
# ------------------------
@router.put("/{task_id}/restore")
def restore_existing_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = restore_task(
        db,
        task_id,
        current_user.id
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found."
        )

    return {
        "message": "Task restored successfully."
    }