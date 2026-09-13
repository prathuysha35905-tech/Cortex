from sqlalchemy.orm import Session
from app.engines.task_engine import execute_create_task
from app.models.user import User
from app.engines.task_engine import execute_create_task
from app.engines.memory_engine import execute_save_memory
from app.engines.action_registry import ACTION_REGISTRY

def execute_actions(
    actions: list,
    db: Session,
    current_user: User
):
    results = []

    for action in actions:

        intent = action.get("intent")

        handler = ACTION_REGISTRY.get(intent)

        if handler:
            results.append(
                handler(
                    action,
                    db,
                    current_user
                )
            )
        else:
            results.append(
                {
                    "error": f"Unknown action: {intent}"
                }
            )

    return results
