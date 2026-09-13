from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.auth import get_current_user
from app.models.user import User

from app.morning.service import generate_morning_plan

router = APIRouter(
    prefix="/morning",
    tags=["Morning Planner"],
)


@router.get("/plan")
def morning_plan(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return generate_morning_plan(
        db,
        current_user.id,
    )