from sqlalchemy.orm import Session

from app.models.user import User
from backend.app.engines.task_engine import execute_create_task
from app.engines.task_engine import execute_create_task

def execute_actions(
    actions: list,
    db: Session,
    current_user: User
):
    results = []

    for action in actions:

        intent = action.get("intent")

        if intent == "create_task":
            # We'll implement next
            results.append(
    execute_create_task(
        action,
        db,
        current_user
    )
)

        elif intent == "save_memory":
            # We'll implement next
            results.append("Memory saved")

        else:
            results.append(
                f"Unknown action: {intent}"
            )

    return results