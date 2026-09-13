import json

from app.ai.service import ask_ai
from app.ai.prompts import INSIGHT_PROMPT

from app.analytics.service import (
    get_task_analytics,
    get_goal_analytics,
    get_habit_analytics,
    calculate_productivity_score,
)


def generate_insights(db, user_id):

    analytics = {
        "tasks": get_task_analytics(db, user_id),
        "goals": get_goal_analytics(db, user_id),
        "habits": get_habit_analytics(db, user_id),
        "score": calculate_productivity_score(db, user_id),
    }

    response = ask_ai(
        INSIGHT_PROMPT,
        json.dumps(analytics, indent=2),
    )

    return response