from datetime import datetime
from pydantic import BaseModel
from typing import Literal


class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    

    priority: Literal["High", "Medium", "Low"] = "Medium"
    category: str | None = None
    deadline: datetime | None = None
    is_recurring: bool = False
    recurrence: str | None = ""


class TaskResponse(TaskCreate):
    id: int

    class Config:
        from_attributes = True 