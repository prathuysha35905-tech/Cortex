from datetime import datetime

from pydantic import BaseModel


class HabitCreate(BaseModel):
    title: str
    description: str | None = ""
    frequency: str = "Daily"
    target_count: int = 1


class HabitResponse(HabitCreate):
    id: int
    completed_today: bool
    current_streak: int
    longest_streak: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True