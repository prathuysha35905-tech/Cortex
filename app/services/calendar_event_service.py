from sqlalchemy.orm import Session
from sqlalchemy import extract

from app.models.calendar_event import CalendarEvent
from app.schemas.calendar_event import CalendarEventCreate, CalendarEventUpdate


def create_event(
    db: Session,
    event: CalendarEventCreate,
    user_id: int
):
    new_event = CalendarEvent(
        title=event.title,
        date=event.date,
        start_hour=event.startHour,
        end_hour=event.endHour,
        category=event.category,
        priority=event.priority,
        status=event.status,
        user_id=user_id,
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event


def get_events(
    db: Session,
    user_id: int,
    month: str | None = None,
):
    query = db.query(CalendarEvent).filter(CalendarEvent.user_id == user_id)

    if month:
        # month is expected as "YYYY-MM"
        try:
            year_str, month_str = month.split("-")
            query = query.filter(
                extract("year", CalendarEvent.date) == int(year_str),
                extract("month", CalendarEvent.date) == int(month_str),
            )
        except (ValueError, AttributeError):
            pass

    return query.order_by(CalendarEvent.date, CalendarEvent.start_hour).all()


def get_event(db: Session, event_id: int, user_id: int):
    return (
        db.query(CalendarEvent)
        .filter(CalendarEvent.id == event_id, CalendarEvent.user_id == user_id)
        .first()
    )


def update_event_partial(
    db: Session,
    event_id: int,
    event: CalendarEventUpdate,
    user_id: int
):
    existing = get_event(db, event_id, user_id)

    if not existing:
        return None

    data = event.model_dump(exclude_unset=True)

    if "startHour" in data:
        existing.start_hour = data.pop("startHour")
    if "endHour" in data:
        existing.end_hour = data.pop("endHour")

    for field, value in data.items():
        setattr(existing, field, value)

    db.commit()
    db.refresh(existing)

    return existing


def delete_event(db: Session, event_id: int, user_id: int):
    existing = get_event(db, event_id, user_id)

    if not existing:
        return None

    db.delete(existing)
    db.commit()

    return existing
