from datetime import datetime

from app.schemas.task import TaskCreate


def normalize_task(ai_data: dict) -> TaskCreate:
    """
    Convert AI JSON into a valid TaskCreate object.
    """

    # ------------------------
    # Normalize Priority
    # ------------------------
    priority = ai_data.get("priority", "Medium")

    priority = priority.strip().lower()

    priority_map = {
        "high": "High",
        "medium": "Medium",
        "low": "Low"
    }

    priority = priority_map.get(priority, "Medium")

    # ------------------------
    # Normalize Deadline
    # ------------------------
    deadline = ai_data.get("deadline")

    if deadline:
        try:
            deadline = datetime.fromisoformat(deadline)
        except Exception:
            deadline = None
    else:
        deadline = None

    return TaskCreate(
        title=ai_data["title"],
        description=ai_data.get("description", ""),
        priority=priority,
        category=ai_data.get("category", "General"),
        deadline=deadline,
        is_recurring=ai_data.get("is_recurring", False),
        recurrence=ai_data.get("recurrence", "")
    )