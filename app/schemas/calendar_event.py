from typing import Literal, Optional

from pydantic import BaseModel
from datetime import date as date_type


class CalendarEventCreate(BaseModel):
    title: str
    date: date_type
    startHour: int
    endHour: int
    category: str = "General"
    priority: Literal["Low", "Medium", "High"] = "Medium"
    status: Literal["Upcoming", "In Progress", "Done"] = "Upcoming"


class CalendarEventUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[date_type] = None
    startHour: Optional[int] = None
    endHour: Optional[int] = None
    category: Optional[str] = None
    priority: Optional[Literal["Low", "Medium", "High"]] = None
    status: Optional[Literal["Upcoming", "In Progress", "Done"]] = None


class CalendarEventResponse(BaseModel):
    id: int
    title: str
    date: date_type
    startHour: int
    endHour: int
    category: str
    priority: str
    status: str

    class Config:
        from_attributes = True
