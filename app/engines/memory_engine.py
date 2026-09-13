from sqlalchemy.orm import Session

from app.schemas.memory import MemoryCreate, MemoryResponse
from app.services.memory_service import create_memory


def execute_save_memory(
    action: dict,
    db: Session,
    current_user
):
    memory = MemoryCreate(
        category=action["category"],
        key=action["key"],
        value=action["value"]
    )

    saved_memory = create_memory(
        db,
        memory,
        current_user.id
    )

    return {
        "type": "memory",
        "message": "Memory saved successfully.",
        "memory": MemoryResponse.model_validate(
            saved_memory
        ).model_dump()
    }