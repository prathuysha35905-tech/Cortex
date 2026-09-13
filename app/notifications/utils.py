import random

from app.notifications.templates import (
    FUNNY,
    GODFATHER,
    JARVIS,
)

STYLE = FUNNY


def random_message(notification_type, task):

    messages = STYLE.get(notification_type)

    if not messages:
        return "🔔 New notification."

    return random.choice(messages).format(task=task)

