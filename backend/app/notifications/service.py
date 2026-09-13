from sqlalchemy.orm import Session

from app.models.notification import Notification

from datetime import datetime, timedelta

from app.models.task import Task





def create_notification(
    db: Session,
    user_id: int,
    title: str,
    message: str,
    notification_type: str = "GENERAL",
    priority: str = "NORMAL",
):
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        notification_type=notification_type,
        priority=priority,
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    return notification


def get_notifications(db: Session, user_id: int):
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .all()
    )


def get_unread_notifications(db: Session, user_id: int):
    return (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.is_read == False,
        )
        .order_by(Notification.created_at.desc())
        .all()
    )


def get_unread_count(db: Session, user_id: int):
    return (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.is_read == False,
        )
        .count()
    )


def mark_as_read(db: Session, notification_id: int):

    notification = (
        db.query(Notification)
        .filter(Notification.id == notification_id)
        .first()
    )

    if not notification:
        return None

    notification.is_read = True

    db.commit()
    db.refresh(notification)

    return notification


def mark_all_as_read(db: Session, user_id: int):

    notifications = (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.is_read == False,
        )
        .all()
    )

    for notification in notifications:
        notification.is_read = True

    db.commit()

    return len(notifications)


def delete_notification(db: Session, notification_id: int):

    notification = (
        db.query(Notification)
        .filter(Notification.id == notification_id)
        .first()
    )

    if not notification:
        return False

    db.delete(notification)
    db.commit()

    return True


def get_upcoming_tasks(db):

    now = datetime.now()

    upcoming = now + timedelta(minutes=10)

    return (
        db.query(Task)
        .filter(
            Task.deadline >= now,
            Task.deadline <= upcoming,
        )
        .all()
    )


def notification_exists(
    db,
    user_id: int,
    notification_type: str,
    task_title: str,
):
    return (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.notification_type == notification_type,
            Notification.title == "Task Reminder",
            Notification.message.contains(task_title),
        )
        .first()
        is not None
    )