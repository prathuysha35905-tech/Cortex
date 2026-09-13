from sqlalchemy.orm import Session

from app.services.task_service import get_all_tasks
from app.services.goal_service import get_all_goals
from app.services.habit_service import (
    get_all_habits,
    get_habit_analytics
)


def get_dashboard_data(
    db: Session,
    current_user,
):
    # -------------------------
    # Fetch Data
    # -------------------------

    tasks = get_all_tasks(
        db,
        current_user.id,
        page=1,
        size=1000
    )

    goals = get_all_goals(
        db,
        current_user.id
    )

    habits = get_all_habits(
        db,
        current_user.id,
        page=1,
        size=1000
    )

    habit_stats = get_habit_analytics(
        db,
        current_user.id
    )

    # -------------------------
    # Task Statistics
    # -------------------------

    completed_tasks = len(
        [
            task for task in tasks
            if task.status == "Completed"
        ]
    )

    pending_tasks = len(
        [
            task for task in tasks
            if task.status == "Pending"
        ]
    )

    today_tasks = len(tasks)

    # -------------------------
    # Goal Statistics
    # -------------------------

    active_goals = len(
        [
            goal for goal in goals
            if goal.status == "Active"
        ]
    )

    completed_goals = len(
        [
            goal for goal in goals
            if goal.status == "Completed"
        ]
    )

    # -------------------------
    # Habit Statistics
    # -------------------------

    habit_streak = habit_stats["longest_streak"]

    # -------------------------
    # Productivity Score
    # -------------------------

    productivity_score = 0

    if today_tasks > 0:
        productivity_score += int(
            (completed_tasks / today_tasks) * 50
        )

    productivity_score += int(
        habit_stats["completion_rate"] * 0.5
    )

    productivity_score = min(
        productivity_score,
        100
    )

    # -------------------------
    # AI Message
    # -------------------------

    if pending_tasks == 0:
        ai_message = "Excellent! You completed all your tasks today."

    elif pending_tasks <= 3:
        ai_message = "You're doing great! Finish the remaining tasks."

    else:
        ai_message = "Focus on high-priority tasks first."

    # -------------------------
    # Response
    # -------------------------

    return {
        "productivity_score": productivity_score,
        "today_tasks": today_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "active_goals": active_goals,
        "completed_goals": completed_goals,
        "habit_streak": habit_streak,
        "focus_hours": 0,
        "ai_message": ai_message,
    }