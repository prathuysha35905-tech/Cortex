from pydantic import BaseModel


class CalendarEvent(BaseModel):
    summary: str
    start: str
    end: str