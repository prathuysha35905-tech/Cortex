from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.base import Base



class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)
    description = Column(String)

    status = Column(String, default="Pending")
    priority = Column(String, default="Medium")
    category = Column(String)

    deadline = Column(DateTime)

    # ✅ These MUST be inside the class
    is_recurring = Column(Boolean, default=False)
    recurrence = Column(String, default="")

    # Frontend-tracked fields with no prior backend equivalent.
    duration = Column(String, nullable=True)
    progress = Column(Integer, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)

    is_archived = Column(Boolean, default=False)

    archived_at = Column(DateTime, nullable=True)

    is_important = Column(Boolean, default=False)

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
        back_populates="tasks"
    )