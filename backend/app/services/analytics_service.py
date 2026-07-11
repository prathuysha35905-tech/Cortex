from sqlalchemy.orm import Session

from app.models.task import Task
from app.models.habit import Habit


def get_analytics(db: Session, user_id: int):
    # Tasks
    tasks = db.query(Task).filter(Task.user_id == user_id).all()

    total_tasks = len(tasks)

    completed_tasks = len(
        [task for task in tasks if task.status.lower() == "completed"]
    )

    pending_tasks = total_tasks - completed_tasks

    completion_rate = (
        round((completed_tasks / total_tasks) * 100, 2)
        if total_tasks > 0
        else 0
    )

    # Habits
    habits = db.query(Habit).filter(Habit.user_id == user_id).all()

    total_habits = len(habits)

    completed_habits = len(
        [habit for habit in habits if habit.completed_today]
    )

    # Productivity Score (simple version)
    productivity_score = round(
        (completion_rate + (
            (completed_habits / total_habits) * 100
            if total_habits > 0
            else 0
        )) / 2,
        2
    )

    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "completion_rate": completion_rate,
        "total_habits": total_habits,
        "completed_habits": completed_habits,
        "productivity_score": productivity_score,
    }