from datetime import datetime


def calculate_priority(task: dict) -> int:
    """
    Returns a priority score from 0-100.
    """

    score = 0

    priority = str(task.get("priority", "Medium")).lower()

    if priority == "high":
        score += 50

    elif priority == "medium":
        score += 30

    else:
        score += 10

    deadline = task.get("deadline")

    if deadline:
        try:
            deadline = datetime.fromisoformat(deadline)

            days_left = (deadline - datetime.utcnow()).days

            if days_left <= 0:
                score += 50

            elif days_left <= 3:
                score += 30

            elif days_left <= 7:
                score += 20

        except Exception:
            pass

    return min(score, 100)