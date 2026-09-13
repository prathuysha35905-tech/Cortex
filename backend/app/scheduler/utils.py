from datetime import datetime


def extract_busy_slots(events):

    busy_slots = []

    for event in events:

        start = event.get("start", {}).get("dateTime")
        end = event.get("end", {}).get("dateTime")

        if not start or not end:
            continue

        busy_slots.append(
            {
                "title": event.get("summary", "Busy"),
                "start": datetime.fromisoformat(
                    start.replace("Z", "+00:00")
                ),
                "end": datetime.fromisoformat(
                    end.replace("Z", "+00:00")
                ),
            }
        )

    return busy_slots

from datetime import datetime, timedelta


def find_free_slots(
    busy_slots,
    day_start=8,
    day_end=22,
):

    free_slots = []

    today = datetime.now().replace(
        hour=day_start,
        minute=0,
        second=0,
        microsecond=0,
    )

    end_of_day = today.replace(
        hour=day_end,
    )

    busy_slots = sorted(
        busy_slots,
        key=lambda slot: slot["start"],
    )

    current = today

    for slot in busy_slots:

        if slot["start"] > current:

            free_slots.append(
                {
                    "start": current,
                    "end": slot["start"],
                }
            )

        if slot["end"] > current:
            current = slot["end"]

    if current < end_of_day:

        free_slots.append(
            {
                "start": current,
                "end": end_of_day,
            }
        )

    return free_slots