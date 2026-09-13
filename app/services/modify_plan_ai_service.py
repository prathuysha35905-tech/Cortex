import json

from app.ai.client import client
from app.ai.modify_plan_prompt import MODIFY_PLAN_PROMPT
from app.core.config import settings


def modify_plan_with_ai(current_plan: dict, user_feedback: str):

    response = client.chat.completions.create(
        model=settings.LMSTUDIO_MODEL,
        temperature=0.3,
        messages=[
            {
                "role": "system",
                "content": MODIFY_PLAN_PROMPT
            },
            {
                "role": "user",
                "content": json.dumps(
                    {
                        "current_plan": current_plan,
                        "feedback": user_feedback
                    },
                    indent=2
                )
            }
        ]
    )

    return json.loads(
        response.choices[0].message.content
    )