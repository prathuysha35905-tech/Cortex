from app.models.task import Task
from app.services.planner_ai_service import plan_day_with_ai


def build_daily_plan(tasks: list[Task]):

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

    for i, task in enumerate(tasks, start=1):

        plan.append(
            {
                "position": i,
                "title": task.title,
                "priority": task.priority,
                "reason": f"{task.priority} priority task"
            }
        )

    try:
      return plan_day_with_ai(tasks)
    except Exception:
     return plan