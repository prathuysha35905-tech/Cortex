from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.chat import ChatRequest
from app.services.planner_service import process_message

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    return process_message(request.message, db)