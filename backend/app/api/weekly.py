from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.auth import get_current_user
from app.models.user import User

from app.weekly.service import generate_weekly_report

router = APIRouter(
    prefix="/weekly",
    tags=["Weekly Report"],
)


@router.get("/report")
def weekly_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return generate_weekly_report(
        db,
        current_user.id,
    )