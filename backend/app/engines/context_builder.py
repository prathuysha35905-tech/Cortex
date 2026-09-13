from sqlalchemy.orm import Session

from app.services.task_service import get_all_tasks
from app.services.habit_service import get_all_habits
from app.services.memory_service import get_all_memories


def build_context(
    db: Session,
    current_user
):
    tasks = get_all_tasks(
        db,
        current_user.id
    )

    habits = get_all_habits(
        db,
        current_user.id
    )

    memories = get_all_memories(
        db,
        current_user.id
    )

    context = {
        "tasks": [
            task.title
            for task in tasks
        ],
        "habits": [
            habit.title
            for habit in habits
        ],
        "memories": [
            {
                "category": memory.category,
                "key": memory.key,
                "value": memory.value
            }
            for memory in memories
        ]
    }

    return context