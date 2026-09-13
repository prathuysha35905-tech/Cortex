from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import RedirectResponse

from app.integrations.google_calendar.service import (
    generate_google_login_url,
)
from fastapi import Request

from app.integrations.google_calendar.oauth_service import (
    exchange_code_for_tokens,
)

from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.schemas.calendar_event import (
    CalendarEventCreate,
    CalendarEventUpdate,
    CalendarEventResponse,
)
from app.services.calendar_event_service import (
    create_event,
    get_events,
    update_event_partial,
    delete_event,
)

router = APIRouter(
    prefix="/calendar",
    tags=["Google Calendar"],
)


@router.get("/connect")
def connect_google():

    url = generate_google_login_url()

    return RedirectResponse(url)


@router.get("/callback")
def google_callback(request: Request):

    code = request.query_params.get("code")

    if not code:
        return {
            "status": "error",
            "message": "Authorization code not received."
        }

    tokens = exchange_code_for_tokens(code)

    return {
        "status": "success",
        "tokens": tokens
    }


# =========================================================
# LOCAL CALENDAR EVENTS (not Google-synced -- user-created events
# stored directly, previously entirely missing from the backend)
# =========================================================

@router.get("/events", response_model=list[CalendarEventResponse])
def list_events(
    month: str | None = Query(None, description="YYYY-MM"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_events(db, current_user.id, month)


@router.post("/events", response_model=CalendarEventResponse)
def create_new_event(
    event: CalendarEventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_event(db, event, current_user.id)


@router.patch("/events/{event_id}", response_model=CalendarEventResponse)
def patch_event(
    event_id: int,
    event: CalendarEventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated = update_event_partial(db, event_id, event, current_user.id)

    if not updated:
        raise HTTPException(status_code=404, detail="Event not found.")

    return updated


@router.delete("/events/{event_id}")
def remove_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted = delete_event(db, event_id, current_user.id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Event not found.")

    return {"message": "Event deleted successfully."}