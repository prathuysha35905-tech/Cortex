from datetime import datetime
from pydantic import BaseModel


class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    priority: str = "Medium"
    category: str | None = None
    deadline: datetime | None = None
    is_recurring: bool = False
    recurrence: str | None = ""


class TaskResponse(TaskCreate):
    id: int

    class Config:
        from_attributes = True 