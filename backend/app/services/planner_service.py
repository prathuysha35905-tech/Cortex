from sqlalchemy.orm import Session

from app.ai.parser import parse_ai_response
from app.schemas.task import TaskResponse
from app.services.ai_service import chat_with_cortex
from app.services.task_normalizer import normalize_task
from app.services.task_service import create_task, get_all_tasks
from app.services.planning_state import save_plan
from app.engines.intent_router import detect_intent
from app.engines.planning_engine import build_daily_plan
from app.engines.plan_modifier import modify_plan
from app.services.task_service import generate_recurring_tasks


def process_message(message: str, db: Session):

    intent = detect_intent(message)

    # -----------------------
    # PLAN MY DAY
    # -----------------------
    if intent == "plan_day":

        tasks = get_all_tasks(db)

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
    # NORMAL AI CHAT
    # -----------------------
    ai_response = chat_with_cortex(message)

    parsed = parse_ai_response(ai_response)

    if parsed["intent"] == "create_task":

        task = normalize_task(parsed)

        saved_task = create_task(db, task)

        return {
            "status": "success",
            "message": "Task created successfully.",
            "task": TaskResponse.model_validate(saved_task).model_dump()
        }

    elif parsed["intent"] == "chat":

        return {
            "status": "success",
            "response": parsed["response"]
        }

    return {
        "status": "error",
        "message": "Unknown intent."
    }