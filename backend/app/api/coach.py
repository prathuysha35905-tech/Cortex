from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.coach_service import generate_morning_brief

router = APIRouter(
    prefix="/coach",
    tags=["Coach"]
)


@router.get("/morning")
def morning_brief(
    db: Session = Depends(get_db)
):
    return generate_morning_brief(db)