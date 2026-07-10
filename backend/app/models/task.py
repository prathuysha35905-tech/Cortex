from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.database.base import Base

from sqlalchemy import Boolean

from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

is_recurring = Column(Boolean, default=False)

recurrence = Column(String, default="")
class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    status = Column(String, default="Pending")
    priority = Column(String, default="Medium")
    category = Column(String)
    deadline = Column(DateTime)
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
    back_populates="tasks"
)