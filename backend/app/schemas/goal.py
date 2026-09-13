from datetime import datetime

from pydantic import BaseModel


class GoalCreate(BaseModel):
    title: str
    description: str = ""
    category: str = "General"
    target_date: datetime | None = None


class GoalResponse(GoalCreate):
    id: int
    progress: int
    status: str
    is_archived: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True