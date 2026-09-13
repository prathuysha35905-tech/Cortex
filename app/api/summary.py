from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.auth import get_current_user
from app.models.user import User

from app.summary.service import generate_daily_summary

router = APIRouter(
    prefix="/summary",
    tags=["Daily Summary"],
)


@router.get("/daily")
def daily_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return generate_daily_summary(
        db,
        current_user.id,
    )