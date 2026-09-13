from datetime import date, datetime, timedelta

from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import object_session

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

    # Fields the frontend needs with no prior backend equivalent.
    category = Column(String, default="General")
    reminder = Column(String, nullable=True)
    paused = Column(Boolean, default=False)

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

    logs = relationship(
        "HabitLog",
        back_populates="habit",
        cascade="all, delete-orphan",
    )

    # ------------------------------------------------------------------
    # Computed, frontend-facing properties. These read via HabitLog so
    # they reflect real per-day history rather than being guessed from
    # completed_today/current_streak alone.
    # ------------------------------------------------------------------

    @property
    def name(self) -> str:
        return self.title

    @property
    def streak(self) -> int:
        return self.current_streak

    @property
    def longestStreak(self) -> int:
        return self.longest_streak

    @property
    def doneToday(self) -> bool:
        return self.completed_today

    @property
    def week(self) -> list[bool]:
        """Last 7 days (oldest..today), True where a completed log exists."""
        session = object_session(self)
        today = date.today()
        days = [today - timedelta(days=i) for i in range(6, -1, -1)]

        if session is None or self.id is None:
            return [False] * 7

        from app.models.habit_log import HabitLog

        completed_dates = {
            row.log_date
            for row in (
                session.query(HabitLog)
                .filter(
                    HabitLog.habit_id == self.id,
                    HabitLog.log_date.in_(days),
                    HabitLog.completed == True,  # noqa: E712
                )
                .all()
            )
        }

        return [d in completed_dates for d in days]

    @property
    def missedDays(self) -> int:
        return sum(1 for done in self.week if not done)

    @property
    def completion(self) -> int:
        w = self.week
        return round(sum(w) / len(w) * 100) if w else 0

    @property
    def progress(self) -> int:
        return self.completion
