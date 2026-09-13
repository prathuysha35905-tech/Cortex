from sqlalchemy.orm import Session

from app.models.memory import Memory


def get_user_memories(
    db: Session,
    user_id: int,
    limit: int = 20,
):

    memories = (
        db.query(Memory)
        .filter(
            Memory.user_id == user_id,
        )
        .order_by(
            Memory.created_at.desc(),
        )
        .limit(limit)
        .all()
    )

    return [
        {
            "category": memory.category,
            "key": memory.key,
            "value": memory.value,
        }
        for memory in memories
    ]