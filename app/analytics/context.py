from app.analytics.service import (
    get_task_analytics,
    get_goal_analytics,
    get_habit_analytics,
    calculate_productivity_score,
)

from app.models.task import Task
from app.models.goal import Goal
from app.models.habit import Habit


def build_user_context(db, user_id):

    tasks = get_task_analytics(db, user_id)
    goals = get_goal_analytics(db, user_id)
    habits = get_habit_analytics(db, user_id)
    score = calculate_productivity_score(db, user_id)

    pending_tasks = (
        db.query(Task)
        .filter(
            Task.user_id == user_id,
            Task.status == "Pending",
        )
        .all()
    )

    active_goals = (
        db.query(Goal)
        .filter(
            Goal.user_id == user_id,
            Goal.status == "Active",
        )
        .all()
    )

    active_habits = (
        db.query(Habit)
        .filter(
            Habit.user_id == user_id,
        )
        .all()
    )

    return {
        "analytics": {
            "tasks": tasks,
            "goals": goals,
            "habits": habits,
            "productivity": score,
        },
        "pending_tasks": [
            {
                "title": task.title,
                "priority": task.priority,
                "deadline": str(task.deadline),
            }
            for task in pending_tasks
        ],
        "goals": [
            {
                "title": goal.title,
                "progress": goal.progress,
            }
            for goal in active_goals
        ],
        "habits": [
            {
                "title": habit.title,
                "streak": habit.current_streak,
            }
            for habit in active_habits
        ],
    }