from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.habit import HabitCreate, HabitResponse
from app.services.habit_service import (
    create_habit,
    get_all_habits,
    get_habit,
    delete_habit,
    complete_habit,
)
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/habits",
    tags=["Habits"]
)


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


@router.get("/", response_model=list[HabitResponse])
def get_habits(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_all_habits(
        db,
        current_user.id
    )


@router.get("/{habit_id}", response_model=HabitResponse)
def read_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    habit = get_habit(db, habit_id)

    if not habit:
        raise HTTPException(
            status_code=404,
            detail="Habit not found."
        )

    if habit.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized."
        )

    return habit


@router.put("/{habit_id}/complete", response_model=HabitResponse)
def complete_today_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    habit = get_habit(db, habit_id)

    if not habit:
        raise HTTPException(
            status_code=404,
            detail="Habit not found."
        )

    if habit.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized."
        )

    return complete_habit(db, habit_id)


@router.delete("/{habit_id}")
def remove_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    habit = get_habit(db, habit_id)

    if not habit:
        raise HTTPException(
            status_code=404,
            detail="Habit not found."
        )

    if habit.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized."
        )

    delete_habit(db, habit_id)

    return {
        "message": "Habit deleted successfully."
    }