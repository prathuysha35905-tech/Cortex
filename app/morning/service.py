import json

from app.ai.service import ask_ai
from app.ai.prompts import MORNING_PLANNER_PROMPT

from app.analytics.context import build_user_context


def generate_morning_plan(db, user_id):

    context = build_user_context(
        db,
        user_id,
    )

    return ask_ai(
        MORNING_PLANNER_PROMPT,
        json.dumps(context, indent=2),
    )