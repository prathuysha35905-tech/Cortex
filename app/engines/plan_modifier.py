from app.services.planning_state import (
    get_plan,
    save_plan
)
from app.services.modify_plan_ai_service import modify_plan_with_ai


def modify_plan(message: str):

    current_plan = get_plan()

    if current_plan is None:
        return {
            "status": "error",
            "message": "No active planning session."
        }

    updated_plan = modify_plan_with_ai(
        current_plan=current_plan,
        user_feedback=message
    )

    save_plan(updated_plan)

    return {
        "status": "success",
        "plan": updated_plan
    }