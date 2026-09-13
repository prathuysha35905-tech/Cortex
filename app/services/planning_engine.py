from app.models.task import Task


def build_daily_plan(tasks: list[Task]):
    """
    Create a simple daily plan from tasks.
    """

    priority_order = {
        "High": 1,
        "Medium": 2,
        "Low": 3
    }

    tasks = sorted(
        tasks,
        key=lambda task: priority_order.get(task.priority, 99)
    )

    plan = []

    for index, task in enumerate(tasks, start=1):
        plan.append(
            f"{index}. {task.title} ({task.priority})"
        )

    return "\n".join(plan)