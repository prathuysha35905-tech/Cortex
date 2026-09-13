import json

from app.ai.client import client
from app.ai.morning_prompt import MORNING_PROMPT
from app.core.config import settings
from app.services.task_service import get_all_tasks
from app.services.habit_service import get_all_habits


def generate_morning_brief(db):

    tasks = get_all_tasks(db)
    habits = get_all_habits(db)

    response = client.chat.completions.create(
        model=settings.LMSTUDIO_MODEL,
        temperature=0.3,
        messages=[
            {
                "role": "system",
                "content": MORNING_PROMPT
            },
            {
                "role": "user",
                "content": json.dumps(
                    {
                        "tasks": [
                            {
                                "title": t.title,
                                "priority": t.priority,
                                "status": t.status
                            }
                            for t in tasks
                        ],
                        "habits": [
                            {
                                "title": h.title,
                                "streak": h.current_streak
                            }
                            for h in habits
                        ]
                    },
                    indent=2
                )
            }
        ]
    )

    return json.loads(response.choices[0].message.content)