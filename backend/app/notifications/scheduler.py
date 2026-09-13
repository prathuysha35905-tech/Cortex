from apscheduler.schedulers.background import BackgroundScheduler

from app.notifications.engine import check_notifications

scheduler = BackgroundScheduler()


def start_scheduler():

    if scheduler.running:
        return

    scheduler.add_job(
        check_notifications,
        "interval",
        minutes=1,
        id="notification_checker",
        replace_existing=True,
    )

    scheduler.start()