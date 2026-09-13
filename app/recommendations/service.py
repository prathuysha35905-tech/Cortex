from app.analytics.service import (
    get_task_analytics,
    get_goal_analytics,
    get_habit_analytics,
    calculate_productivity_score,
)


def generate_recommendations(db, user_id):

    task = get_task_analytics(db, user_id)
    goal = get_goal_analytics(db, user_id)
    habit = get_habit_analytics(db, user_id)
    score = calculate_productivity_score(db, user_id)

    recommendations = []

    if task["overdue"] > 0:
        recommendations.append({
            "title": "Finish Overdue Tasks",
            "message": "Complete your overdue tasks before starting new work.",
            "priority": "HIGH",
        })

    if task["pending"] >= 5:
        recommendations.append({
            "title": "Reduce Pending Tasks",
            "message": "Your task list is getting crowded. Finish a few tasks today.",
            "priority": "MEDIUM",
        })

    if habit["current_streak"] == 0:
        recommendations.append({
            "title": "Restart Your Habits",
            "message": "Complete one habit today to begin building momentum again.",
            "priority": "MEDIUM",
        })

    if goal["completed"] == 0:
        recommendations.append({
            "title": "Complete Your First Goal",
            "message": "Finishing one goal will significantly improve your progress.",
            "priority": "LOW",
        })

    if score["score"] < 70:
        recommendations.append({
            "title": "Boost Productivity",
            "message": "Focus on one high-priority task to improve today's productivity score.",
            "priority": "HIGH",
        })

    if not recommendations:
        recommendations.append({
            "title": "Keep Going!",
            "message": "You're doing great. Stay consistent and maintain your progress.",
            "priority": "LOW",
        })

    return {
        "recommendations": recommendations
    }