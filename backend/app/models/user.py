from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime

from app.database.base import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    full_name = Column(String, nullable=False)

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String, unique=True, nullable=False, index=True)

    email = Column(String, unique=True, nullable=False, index=True)

    hashed_password = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    tasks = relationship(
    "Task",
    back_populates="user"
)
    habits = relationship(
    "Habit",
    back_populates="user"
)