from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base


class Memory(Base):
    __tablename__ = "memory"

    id = Column(Integer, primary_key=True, index=True)

    category = Column(String, nullable=False)

    key = Column(String, nullable=False)

    value = Column(String, nullable=False)

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
        back_populates="memories"
    )