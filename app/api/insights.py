from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.auth import get_current_user
from app.models.user import User

from app.insights.service import generate_insights

router = APIRouter(
    prefix="/insights",
    tags=["AI Insights"],
)


@router.get("/")
def get_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return generate_insights(
        db,
        current_user.id,
    )