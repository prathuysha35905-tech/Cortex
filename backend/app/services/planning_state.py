current_session = None


def save_plan(plan):
    global current_session

    current_session = plan


def get_plan():
    return current_session


def clear_plan():
    global current_session

    current_session = None