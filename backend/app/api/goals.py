from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.goal import GoalCreate, GoalResponse
from app.core.auth import get_current_user
from app.models.user import User

from app.services.goal_service import (
    create_goal,
    get_all_goals,
    get_goal,
    update_goal,
    delete_goal,
    archive_goal,
    restore_goal,
    update_progress,
)

router = APIRouter(
    prefix="/goals",
    tags=["Goals"]
)


@router.post("/", response_model=GoalResponse)
def create_new_goal(
    goal: GoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_goal(
        db,
        goal,
        current_user.id
    )


@router.get("/", response_model=list[GoalResponse])
def get_goals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_all_goals(
        db,
        current_user.id
    )


@router.get("/{goal_id}", response_model=GoalResponse)
def read_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = get_goal(
        db,
        goal_id,
        current_user.id
    )

    if not goal:
        raise HTTPException(
            status_code=404,
            detail="Goal not found."
        )

    return goal


@router.put("/{goal_id}", response_model=GoalResponse)
def update_existing_goal(
    goal_id: int,
    goal: GoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated_goal = update_goal(
        db,
        goal_id,
        goal,
        current_user.id
    )

    if not updated_goal:
        raise HTTPException(
            status_code=404,
            detail="Goal not found."
        )

    return updated_goal


@router.delete("/{goal_id}")
def delete_existing_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = delete_goal(
        db,
        goal_id,
        current_user.id
    )

    if not goal:
        raise HTTPException(
            status_code=404,
            detail="Goal not found."
        )

    return {
        "message": "Goal deleted successfully."
    }


@router.put("/{goal_id}/archive")
def archive_existing_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = archive_goal(
        db,
        goal_id,
        current_user.id
    )

    if not goal:
        raise HTTPException(
            status_code=404,
            detail="Goal not found."
        )

    return {
        "message": "Goal archived successfully."
    }


@router.put("/{goal_id}/restore")
def restore_existing_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = restore_goal(
        db,
        goal_id,
        current_user.id
    )

    if not goal:
        raise HTTPException(
            status_code=404,
            detail="Goal not found."
        )

    return {
        "message": "Goal restored successfully."
    }


@router.put("/{goal_id}/progress/{progress}", response_model=GoalResponse)
def update_goal_progress(
    goal_id: int,
    progress: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = update_progress(
        db,
        goal_id,
        progress,
        current_user.id
    )

    if not goal:
        raise HTTPException(
            status_code=404,
            detail="Goal not found."
        )

    return goal