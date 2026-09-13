from pydantic import BaseModel


class DashboardResponse(BaseModel):
    productivity_score: int

    today_tasks: int
    completed_tasks: int
    pending_tasks: int

    active_goals: int
    completed_goals: int

    habit_streak: int

    focus_hours: float

    ai_message: str