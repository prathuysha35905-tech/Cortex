from sqlalchemy import Boolean, Column, Date, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.database.base import Base


class HabitLog(Base):
    """One row per habit per day it was acted on. Backs the frontend's
    `week`/`missedDays`/`completion` fields with real history instead of
    values derived only from the single `completed_today` flag."""

    __tablename__ = "habit_logs"

    id = Column(Integer, primary_key=True, index=True)

    habit_id = Column(
        Integer,
        ForeignKey("habits.id"),
        nullable=False,
        index=True,
    )

    log_date = Column(Date, nullable=False, index=True)

    completed = Column(Boolean, default=True, nullable=False)

    habit = relationship("Habit", back_populates="logs")
