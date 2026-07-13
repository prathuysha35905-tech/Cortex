from sqlalchemy.orm import Session

from app.models.habit import Habit
from app.schemas.habit import HabitCreate
from datetime import datetime
from sqlalchemy import or_
from sqlalchemy import func


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
    user_id: int,
    page: int = 1,
    size: int = 10
):
    offset = (page - 1) * size

    return (
        db.query(Habit)
        .filter(
            Habit.user_id == user_id,
            Habit.is_archived == False
        )
        .offset(offset)
        .limit(size)
        .all()
    )

def search_habits(
    db: Session,
    user_id: int,
    query: str
):
    return (
        db.query(Habit)
        .filter(
            Habit.user_id == user_id,
            Habit.is_archived == False,
            or_(
                Habit.title.ilike(f"%{query}%"),
                Habit.description.ilike(f"%{query}%")
            )
        )
        .all()
    )

def filter_habits(
    db: Session,
    user_id: int,
    frequency: str | None = None,
    completed: bool | None = None
):
    query = db.query(Habit).filter(
        Habit.user_id == user_id,
        Habit.is_archived == False
    )

    if frequency:
        query = query.filter(
            func.lower(Habit.frequency) == frequency.lower()
        )

    if completed is not None:
        query = query.filter(
            Habit.completed_today == completed
        )

    return query.all()


def get_habit(
    db: Session,
    habit_id: int,
    user_id: int
):
    return (
        db.query(Habit)
        .filter(
            Habit.id == habit_id,
            Habit.user_id == user_id
        )
        .first()
    )


def delete_habit(
    db: Session,
    habit_id: int,
    user_id: int
):
    habit = get_habit(
        db,
        habit_id,
        user_id
    )

    if habit:
        db.delete(habit)
        db.commit()

    return habit


def complete_habit(
    db: Session,
    habit_id: int,
    user_id: int
):
    habit = get_habit(
        db,
        habit_id,
        user_id
    )

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

def update_habit(
    db: Session,
    habit_id: int,
    habit: HabitCreate,
    user_id: int
):
    existing_habit = get_habit(
        db,
        habit_id,
        user_id
    )

    if not existing_habit:
        return None

    existing_habit.title = habit.title
    existing_habit.description = habit.description
    existing_habit.frequency = habit.frequency
    existing_habit.target_count = habit.target_count
    existing_habit.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(existing_habit)

    return existing_habit


def archive_habit(
    db: Session,
    habit_id: int,
    user_id: int
):
    habit = get_habit(
        db,
        habit_id,
        user_id
    )

    if not habit:
        return None

    habit.is_archived = True
    habit.archived_at = datetime.utcnow()

    db.commit()
    db.refresh(habit)

    return habit

def restore_habit(
    db: Session,
    habit_id: int,
    user_id: int
):
    habit = get_habit(
        db,
        habit_id,
        user_id
    )

    if not habit:
        return None

    habit.is_archived = False
    habit.archived_at = None

    db.commit()
    db.refresh(habit)

    return habit

def get_archived_habits(
    db: Session,
    user_id: int
):
    return (
        db.query(Habit)
        .filter(
            Habit.user_id == user_id,
            Habit.is_archived == True
        )
        .all()
    )

def get_habit_analytics(
    db: Session,
    user_id: int
):
    habits = (
        db.query(Habit)
        .filter(
            Habit.user_id == user_id,
            Habit.is_archived == False
        )
        .all()
    )

    total = len(habits)

    completed = sum(
        1 for habit in habits
        if habit.completed_today
    )

    pending = total - completed

    completion_rate = (
        (completed / total) * 100
        if total > 0 else 0
    )

    longest_streak = max(
        (habit.longest_streak for habit in habits),
        default=0
    )

    average_streak = (
        sum(habit.current_streak for habit in habits) / total
        if total > 0 else 0
    )

    return {
        "total_habits": total,
        "completed_today": completed,
        "pending_today": pending,
        "completion_rate": round(completion_rate, 2),
        "longest_streak": longest_streak,
        "average_streak": round(average_streak, 2)
    }