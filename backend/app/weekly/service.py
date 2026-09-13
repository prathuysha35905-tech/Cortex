import json

from app.ai.service import ask_ai
from app.ai.prompts import SUMMARY_PROMPT

from app.analytics.context import build_user_context


def generate_weekly_report(db, user_id):

    context = build_user_context(
        db,
        user_id,
    )

    response = ask_ai(
        SUMMARY_PROMPT,
        json.dumps(context, indent=2),
    )

    return response