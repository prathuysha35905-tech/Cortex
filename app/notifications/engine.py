from app.database.database import SessionLocal
from app.notifications.service import (
    get_upcoming_tasks,
    create_notification,
    notification_exists,
)
from app.core.logging import logger


def check_notifications():

    db = SessionLocal()

    try:

        tasks = get_upcoming_tasks(db)

        for task in tasks:

            title = "Task Reminder"

            message = random_message(
                "TASK_REMINDER",
                task.title,
            )

            if notification_exists(
                db,
                task.user_id,
                "TASK_REMINDER",
                task.title,
            ):
                continue

            create_notification(
                db=db,
                user_id=task.user_id,
                title=title,
                message=message,
                notification_type="TASK_REMINDER",
                priority="HIGH",
            )

            logger.info(f"Notification created for {task.title}")

    finally:
        db.close()