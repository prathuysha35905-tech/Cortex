def detect_intent(message: str):

    message = message.lower().strip()

    # Plan the day
    if any(keyword in message for keyword in [
        "plan my day",
        "schedule my day",
        "organize my day",
        "today's plan",
        "today plan"
    ]):
        return "plan_day"

    # Modify an existing plan
    if any(keyword in message for keyword in [
        "move",
        "swap",
        "change order",
        "put",
        "place"
    ]):
        return "modify_plan"

    # Default
    return "chat"