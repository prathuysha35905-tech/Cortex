from sqlalchemy.orm import Session

from app.models.habit import Habit
from app.schemas.habit import HabitCreate
from datetime import datetime


def create_habit(
    db: Session,
    habit: HabitCreate,
    user_id: int
):
    new_habit = Habit(
        title=habit.title,
        description=habit.description,
        frequency=habit.frequency,
        target_count=habit.target_count,
        user_id=user_id
    )

    db.add(new_habit)
    db.commit()
    db.refresh(new_habit)

    return new_habit


def get_all_habits(
    db: Session,
    user_id: int
):
    return (
        db.query(Habit)
        .filter(Habit.user_id == user_id)
        .all()
    )


def get_habit(db: Session, habit_id: int):
    return db.query(Habit).filter(Habit.id == habit_id).first()


def delete_habit(db: Session, habit_id: int):
    habit = get_habit(db, habit_id)

    if habit:
        db.delete(habit)
        db.commit()

    return habit


def complete_habit(db: Session, habit_id: int):

    habit = get_habit(db, habit_id)

    if not habit:
        return None

    if not habit.completed_today:
        habit.completed_today = True
        habit.current_streak += 1

        if habit.current_streak > habit.longest_streak:
            habit.longest_streak = habit.current_streak

        habit.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(habit)

    return habit