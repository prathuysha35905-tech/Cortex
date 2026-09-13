from copy import deepcopy
from sqlalchemy.orm import Session

from app.ai.priority_engine import calculate_priority
from app.ai.duplicate_detector import (
    task_exists,
    goal_exists,
)
from app.models.user import User

MAX_ACTIONS = 5


def evaluate_actions(
    actions: list,
    db: Session,
    current_user: User
) -> list:
    """
    Validate AI-generated actions before execution.
    """

    approved = []
    seen = set()

    for action in actions:

        # Ignore invalid actions
        if "intent" not in action:
            continue

        intent = action["intent"]

        # -------------------------
        # Duplicate Task Check
        # -------------------------
        if intent == "create_task":

            title = action.get("title", "")

            if title and task_exists(
                db,
                current_user.id,
                title
            ):
                continue

        # -------------------------
        # Duplicate Goal Check
        # -------------------------
        if intent == "create_goal_plan":

            goal = action.get("goal", "")

            if goal and goal_exists(
                db,
                current_user.id,
                goal
            ):
                continue

        # -------------------------
        # Duplicate Action Check
        # -------------------------
        signature = tuple(sorted(action.items()))

        if signature in seen:
            continue

        seen.add(signature)

        approved.append(
            deepcopy(action)
        )

        if len(approved) >= MAX_ACTIONS:
            break

    approved.sort(
        key=calculate_priority,
        reverse=True
    )

    return approved