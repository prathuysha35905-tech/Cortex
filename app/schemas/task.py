from datetime import datetime
from pydantic import BaseModel
from typing import Literal, Optional


class TaskCreate(BaseModel):
    title: str
    description: str | None = None

    priority: Literal["High", "Medium", "Low"] = "Medium"
    category: str | None = None
    deadline: datetime | None = None
    is_recurring: bool = False
    recurrence: str | None = ""
    duration: str | None = None
    progress: int = 0


class TaskUpdate(BaseModel):
    """All fields optional -- used for partial (PATCH) updates."""
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[Literal["High", "Medium", "Low"]] = None
    category: Optional[str] = None
    deadline: Optional[datetime] = None
    is_recurring: Optional[bool] = None
    recurrence: Optional[str] = None
    duration: Optional[str] = None
    progress: Optional[int] = None
    # Convenience flag the frontend uses to toggle completion; mapped to
    # the `status` column server-side rather than stored directly.
    done: Optional[bool] = None


class TaskResponse(TaskCreate):
    id: int
    status: str

    class Config:
        from_attributes = True
