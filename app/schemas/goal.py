from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class GoalCreate(BaseModel):
    title: str
    description: str = ""
    category: str = "General"
    target_date: datetime | None = None


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    target_date: Optional[datetime] = None


class GoalResponse(GoalCreate):
    id: int
    progress: int
    status: str
    is_archived: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
