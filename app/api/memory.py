from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.auth import get_current_user
from app.models.user import User

from app.schemas.memory import (
    MemoryCreate,
    MemoryResponse,
)

from app.services.memory_service import (
    create_memory,
    get_all_memories,
    get_memories_by_category,
)

router = APIRouter(
    prefix="/memory",
    tags=["Memory"]
)


# ------------------------
# CREATE MEMORY
# ------------------------
@router.post("/", response_model=MemoryResponse)
def create_new_memory(
    memory: MemoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_memory(
        db,
        memory,
        current_user.id
    )


# ------------------------
# GET ALL MEMORIES
# ------------------------
@router.get("/", response_model=list[MemoryResponse])
def read_memories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_all_memories(
        db,
        current_user.id
    )


# ------------------------
# GET MEMORIES BY CATEGORY
# ------------------------
@router.get("/{category}", response_model=list[MemoryResponse])
def read_category(
    category: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_memories_by_category(
        db,
        current_user.id,
        category
    )