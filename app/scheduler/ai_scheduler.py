import json

from app.ai.service import ask_ai
from app.ai.prompts import SCHEDULER_PROMPT


def generate_schedule(
    free_slots,
    tasks,
):

    context = {
        "free_slots": free_slots,
        "tasks": [
            {
                "title": task.title,
                "priority": task.priority,
                "deadline": str(task.deadline),
            }
            for task in tasks
        ],
    }

    return ask_ai(
        SCHEDULER_PROMPT,
        json.dumps(context, indent=2),
    )