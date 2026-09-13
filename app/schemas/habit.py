from typing import Optional

from pydantic import BaseModel


class HabitCreate(BaseModel):
    name: str
    category: str = "General"
    reminder: str | None = None
    paused: bool = False
    frequency: str = "Daily"
    target_count: int = 1


class HabitUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    reminder: Optional[str] = None
    paused: Optional[bool] = None
    frequency: Optional[str] = None
    target_count: Optional[int] = None
    # Convenience flag the frontend uses to toggle today's completion;
    # mapped to real HabitLog rows + streak bookkeeping server-side.
    doneToday: Optional[bool] = None


class HabitResponse(BaseModel):
    id: int
    name: str
    category: str
    reminder: str | None = None
    streak: int
    longestStreak: int
    completion: int
    missedDays: int
    doneToday: bool
    paused: bool
    progress: int
    week: list[bool]

    class Config:
        from_attributes = True
