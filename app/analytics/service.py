from datetime import datetime

from sqlalchemy.orm import Session

from app.models.task import Task
from app.models.goal import Goal
from app.models.habit import Habit


def get_task_analytics(db: Session, user_id: int):

    now = datetime.now()

    completed = (
        db.query(Task)
        .filter(
            Task.user_id == user_id,
            Task.status == "Completed",
        )
        .count()
    )

    pending = (
        db.query(Task)
        .filter(
            Task.user_id == user_id,
            Task.status == "Pending",
            Task.deadline >= now,
        )
        .count()
    )

    overdue = (
        db.query(Task)
        .filter(
            Task.user_id == user_id,
            Task.status == "Pending",
            Task.deadline < now,
        )
        .count()
    )

    return {
        "completed": completed,
        "pending": pending,
        "overdue": overdue,
    }


def get_goal_analytics(db: Session, user_id: int):

    completed = (
        db.query(Goal)
        .filter(
            Goal.user_id == user_id,
            Goal.status == "Completed",
        )
        .count()
    )

    active = (
        db.query(Goal)
        .filter(
            Goal.user_id == user_id,
            Goal.status == "Active",
        )
        .count()
    )

    return {
        "completed": completed,
        "pending": active,
    }


def get_habit_analytics(db: Session, user_id: int):

    habits = (
        db.query(Habit)
        .filter(Habit.user_id == user_id)
        .all()
    )

    if not habits:
        return {
            "current_streak": 0,
            "best_streak": 0,
        }

    return {
        "current_streak": max(h.current_streak for h in habits),
        "best_streak": max(h.longest_streak for h in habits),
    }




def calculate_productivity_score(db: Session, user_id: int):

    tasks = get_task_analytics(db, user_id)
    goals = get_goal_analytics(db, user_id)
    habits = get_habit_analytics(db, user_id)

    score = 50

    score += tasks["completed"] * 2
    score -= tasks["pending"] * 2
    score -= tasks["overdue"] * 5

    score += goals["completed"] * 5

    score += min(habits["current_streak"], 20)

    score = max(0, min(score, 100))

    if score >= 90:
        level = "Excellent"
        insight = "Outstanding consistency! Keep up the great work."

    elif score >= 75:
        level = "Very Good"
        insight = "You're doing well. Completing a few more tasks can push you even higher."

    elif score >= 60:
        level = "Good"
        insight = "You're making progress. Try reducing your pending tasks."

    elif score >= 40:
        level = "Average"
        insight = "Focus on completing pending tasks and maintaining your habits."

    else:
        level = "Needs Improvement"
        insight = "Let's start with one small task today and rebuild momentum."

    return {
        "score": score,
        "level": level,
        "insight": insight,
    }