from app.schemas.task import TaskCreate


def normalize_task(ai_data: dict) -> TaskCreate:
    """
    Convert AI JSON into a TaskCreate object.
    """

    return TaskCreate(
        title=ai_data["title"],
        description=ai_data.get("description"),
        priority=ai_data.get("priority", "Medium"),
        category=ai_data.get("category"),
        deadline=None
    )