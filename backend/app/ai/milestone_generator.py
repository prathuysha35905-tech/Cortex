from app.ai.roadmap_templates import ROADMAPS


def generate_milestones(goal_title: str) -> list[str]:
    """
    Generate milestones for a goal.

    First tries to use a predefined roadmap.
    Falls back to a generic roadmap if no template exists.
    """

    title = goal_title.lower()

    for keyword, roadmap in ROADMAPS.items():
        if keyword in title:
            return roadmap

    # Generic roadmap
    return [
        "Research the goal",
        "Learn the fundamentals",
        "Build practical skills",
        "Complete projects",
        "Measure progress",
        "Achieve the goal"
    ]