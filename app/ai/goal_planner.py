from app.ai.milestone_generator import generate_milestones


def generate_goal_plan(goal_title: str):
    """
    Generate a structured plan for a goal.
    """

    milestones = generate_milestones(goal_title)

    tasks = []

    for milestone in milestones:

        tasks.append(
            {
                "title": milestone,
                "description": f"Complete milestone: {milestone}",
                "priority": "Medium",
                "category": "Goal"
            }
        )

    return {
        "goal": goal_title,
        "milestones": milestones,
        "tasks": tasks
    }