from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.habit import HabitCreate, HabitResponse
from app.services.habit_service import complete_habit
from app.services.habit_service import (
    create_habit,
    get_all_habits,
    get_habit,
    delete_habit,
)

router = APIRouter(
    prefix="/habits",
    tags=["Habits"]
)


@router.post("/", response_model=HabitResponse)
def create_new_habit(
    habit: HabitCreate,
    db: Session = Depends(get_db)
):
    return create_habit(db, habit)


@router.get("/", response_model=list[HabitResponse])
def read_habits(
    db: Session = Depends(get_db)
):
    return get_all_habits(db)


@router.get("/{habit_id}", response_model=HabitResponse)
def read_habit(
    habit_id: int,
    db: Session = Depends(get_db)
):
    habit = get_habit(db, habit_id)

    if not habit:
        raise HTTPException(
            status_code=404,
            detail="Habit not found."
        )

    return habit


@router.delete("/{habit_id}")
def remove_habit(
    habit_id: int,
    db: Session = Depends(get_db)
):
    habit = delete_habit(db, habit_id)

    if not habit:
        raise HTTPException(
            status_code=404,
            detail="Habit not found."
        )

    return {
        "message": "Habit deleted successfully."
    }

@router.put("/{habit_id}/complete", response_model=HabitResponse)
def complete_today_habit(
    habit_id: int,
    db: Session = Depends(get_db)
):
    habit = complete_habit(db, habit_id)

    if not habit:
        raise HTTPException(
            status_code=404,
            detail="Habit not found."
        )

    return habit