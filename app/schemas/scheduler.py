from datetime import datetime

from pydantic import BaseModel


class ScheduledTask(BaseModel):
    title: str
    priority: str
    deadline: datetime | None


class ScheduleResponse(BaseModel):
    tasks: list[ScheduledTask]