from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String

from app.database.base import Base

from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship


class Habit(Base):

    is_archived = Column(Boolean, default=False)

    archived_at = Column(DateTime, nullable=True)
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)
    description = Column(String, default="")

    frequency = Column(String, default="Daily")
    target_count = Column(Integer, default=1)

    completed_today = Column(Boolean, default=False)

    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="habits"
    )