from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    full_name: str
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    username: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True