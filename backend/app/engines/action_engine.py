from sqlalchemy.orm import Session
from app.engines.task_engine import execute_create_task
from app.models.user import User
from app.engines.task_engine import execute_create_task
from app.engines.memory_engine import execute_save_memory

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
            results.append(
                execute_save_memory(
                    action,
                    db,
                    current_user
                )
            )

        else:
            results.append(
                f"Unknown action: {intent}"
            )

    return results