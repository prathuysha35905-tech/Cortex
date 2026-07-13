from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.habit import HabitCreate, HabitResponse
from app.core.auth import get_current_user
from app.models.user import User

from app.services.habit_service import (
    create_habit,
    get_all_habits,
    get_archived_habits,
    get_habit,
    update_habit,
    delete_habit,
    complete_habit,
    archive_habit,
    restore_habit,
    search_habits,
    filter_habits,
    get_habit_analytics,
)

router = APIRouter(
    prefix="/habits",
    tags=["Habits"]
)


# =========================================================
# CREATE HABIT
# =========================================================
@router.post("/", response_model=HabitResponse)
def create_new_habit(
    habit: HabitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_habit(
        db,
        habit,
        current_user.id
    )


# =========================================================
# GET ALL HABITS (PAGINATION)
# =========================================================
@router.get("/", response_model=list[HabitResponse])
def get_habits(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_all_habits(
        db=db,
        user_id=current_user.id,
        page=page,
        size=size
    )


# =========================================================
# SEARCH HABITS
# =========================================================
@router.get("/search", response_model=list[HabitResponse])
def search_user_habits(
    query: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return search_habits(
        db,
        current_user.id,
        query
    )


# =========================================================
# FILTER HABITS
# =========================================================
@router.get("/filter", response_model=list[HabitResponse])
def filter_user_habits(
    frequency: str | None = None,
    completed: bool | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return filter_habits(
        db=db,
        user_id=current_user.id,
        frequency=frequency,
        completed=completed
    )


# =========================================================
# ARCHIVED HABITS
# =========================================================
@router.get("/archive", response_model=list[HabitResponse])
def archived_habits(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_archived_habits(
        db,
        current_user.id
    )


# =========================================================
# HABIT ANALYTICS
# =========================================================
@router.get("/analytics")
def habit_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_habit_analytics(
        db,
        current_user.id
    )


# =========================================================
# GET SINGLE HABIT
# =========================================================
@router.get("/{habit_id}", response_model=HabitResponse)
def read_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    habit = get_habit(
        db,
        habit_id,
        current_user.id
    )

    if not habit:
        raise HTTPException(
            status_code=404,
            detail="Habit not found."
        )

    return habit


# =========================================================
# UPDATE HABIT
# =========================================================
@router.put("/{habit_id}", response_model=HabitResponse)
def update_existing_habit(
    habit_id: int,
    habit: HabitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated_habit = update_habit(
        db,
        habit_id,
        habit,
        current_user.id
    )

    if not updated_habit:
        raise HTTPException(
            status_code=404,
            detail="Habit not found."
        )

    return updated_habit


# =========================================================
# ARCHIVE HABIT
# =========================================================
@router.put("/{habit_id}/archive")
def archive_existing_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    habit = archive_habit(
        db,
        habit_id,
        current_user.id
    )

    if not habit:
        raise HTTPException(
            status_code=404,
            detail="Habit not found."
        )

    return {
        "message": "Habit archived successfully."
    }


# =========================================================
# RESTORE HABIT
# =========================================================
@router.put("/{habit_id}/restore")
def restore_existing_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    habit = restore_habit(
        db,
        habit_id,
        current_user.id
    )

    if not habit:
        raise HTTPException(
            status_code=404,
            detail="Habit not found."
        )

    return {
        "message": "Habit restored successfully."
    }


# =========================================================
# COMPLETE HABIT
# =========================================================
@router.put("/{habit_id}/complete", response_model=HabitResponse)
def complete_today_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    habit = complete_habit(
        db,
        habit_id,
        current_user.id
    )

    if not habit:
        raise HTTPException(
            status_code=404,
            detail="Habit not found."
        )

    return habit


# =========================================================
# DELETE HABIT
# =========================================================
@router.delete("/{habit_id}")
def remove_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    habit = delete_habit(
        db,
        habit_id,
        current_user.id
    )

    if not habit:
        raise HTTPException(
            status_code=404,
            detail="Habit not found."
        )

    return {
        "message": "Habit deleted successfully."
    }