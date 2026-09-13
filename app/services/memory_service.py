from sqlalchemy.orm import Session

from app.models.memory import Memory
from app.schemas.memory import MemoryCreate


def create_memory(
    db: Session,
    memory: MemoryCreate,
    user_id: int
):
    existing = (
        db.query(Memory)
        .filter(
            Memory.user_id == user_id,
            Memory.category == memory.category,
            Memory.key == memory.key
        )
        .first()
    )

    if existing:
        existing.value = memory.value

        db.commit()
        db.refresh(existing)

        return existing

    new_memory = Memory(
        category=memory.category,
        key=memory.key,
        value=memory.value,
        user_id=user_id
    )

    db.add(new_memory)

    db.commit()

    db.refresh(new_memory)

    return new_memory


def get_all_memories(
    db: Session,
    user_id: int
):
    return (
        db.query(Memory)
        .filter(
            Memory.user_id == user_id
        )
        .all()
    )


def get_memories_by_category(
    db: Session,
    user_id: int,
    category: str
):
    return (
        db.query(Memory)
        .filter(
            Memory.user_id == user_id,
            Memory.category == category
        )
        .all()
    )