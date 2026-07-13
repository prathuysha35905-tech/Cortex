from sqlalchemy.orm import Session

from app.ai.parser import parse_ai_response
from app.services.ai_service import chat_with_cortex
from app.services.task_service import (
    get_all_tasks,
    generate_recurring_tasks,
)
from app.services.planning_state import save_plan

from app.engines.intent_router import detect_intent
from app.engines.planning_engine import build_daily_plan
from app.engines.plan_modifier import modify_plan
from app.engines.action_engine import execute_actions


def process_message(
    message: str,
    db: Session,
    current_user
):
    # -----------------------
    # LOCAL INTENTS
    # -----------------------
    intent = detect_intent(message)

    if intent == "plan_day":

        tasks = get_all_tasks(
            db,
            current_user.id
        )

        recurring = generate_recurring_tasks(db)

        tasks.extend(recurring)

        if not tasks:
            return {
                "status": "success",
                "message": "You don't have any tasks yet."
            }

        plan = build_daily_plan(tasks)

        save_plan(plan)

        return {
            "status": "success",
            "daily_plan": plan
        }

    # -----------------------
    # MODIFY PLAN
    # -----------------------
    if intent == "modify_plan":
        return modify_plan(message)

    # -----------------------
    # AI
    # -----------------------
    ai_response = chat_with_cortex(message)

    print("\n========== AI RESPONSE ==========")
    print(ai_response)
    print("=================================\n")

    parsed = parse_ai_response(ai_response)

    print("\n========== PARSED ==========")
    print(parsed)
    print("============================\n")

    actions = parsed.get("actions", [])

    results = execute_actions(
        actions,
        db,
        current_user
    )

    return {
        "status": "success",
        "response": parsed.get("response", ""),
        "actions": results
    }