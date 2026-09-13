from app.analytics.service import (
    get_task_analytics,
    get_goal_analytics,
    get_habit_analytics,
    calculate_productivity_score,
)


def generate_daily_summary(db, user_id):

    tasks = get_task_analytics(db, user_id)
    goals = get_goal_analytics(db, user_id)
    habits = get_habit_analytics(db, user_id)
    score = calculate_productivity_score(db, user_id)

    if score["score"] >= 90:
        message = (
            "🌟 Excellent work today! Keep the momentum going."
        )

    elif score["score"] >= 75:
        message = (
            "👏 Great progress today. You're moving in the right direction."
        )

    elif score["score"] >= 60:
        message = (
            "👍 Good effort today. Try clearing a few pending tasks tomorrow."
        )

    else:
        message = (
            "💪 Tomorrow is a fresh start. Focus on completing one important task."
        )

    return {
        "completed_tasks": tasks["completed"],
        "pending_tasks": tasks["pending"],
        "habit_streak": habits["current_streak"],
        "completed_goals": goals["completed"],
        "productivity_score": score["score"],
        "message": message,
    }