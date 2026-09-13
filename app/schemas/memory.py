from datetime import datetime
from pydantic import BaseModel


class MemoryCreate(BaseModel):
    category: str
    key: str
    value: str


class MemoryResponse(MemoryCreate):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True