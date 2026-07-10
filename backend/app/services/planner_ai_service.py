import json

from app.ai.client import client
from app.ai.planner_prompt import PLANNER_PROMPT
from app.core.config import settings


def plan_day_with_ai(tasks: list):

    task_list = []

    for task in tasks:
        task_list.append({
            "title": task.title,
            "priority": task.priority,
            "category": task.category,
            "deadline": str(task.deadline)
        })

    response = client.chat.completions.create(
        model=settings.LMSTUDIO_MODEL,
        temperature=0.3,
        messages=[
            {
                "role": "system",
                "content": PLANNER_PROMPT
            },
            {
                "role": "user",
                "content": json.dumps(task_list, indent=2)
            }
        ]
    )

    return json.loads(
        response.choices[0].message.content
    )