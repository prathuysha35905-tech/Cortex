from sqlalchemy import Column, Date, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database.base import Base


class CalendarEvent(Base):
    """User-created calendar events. Previously had no backend
    representation at all -- only Google OAuth connect/callback existed;
    there was no local event storage or CRUD."""

    __tablename__ = "calendar_events"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)
    date = Column(Date, nullable=False, index=True)

    start_hour = Column(Integer, nullable=False)
    end_hour = Column(Integer, nullable=False)

    category = Column(String, default="General")
    priority = Column(String, default="Medium")
    status = Column(String, default="Upcoming")

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User")

    @property
    def startHour(self) -> int:
        return self.start_hour

    @property
    def endHour(self) -> int:
        return self.end_hour
