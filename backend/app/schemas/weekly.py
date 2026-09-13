from pydantic import BaseModel


class WeeklyReport(BaseModel):
    completed_tasks: int
    pending_tasks: int
    completed_goals: int
    habit_streak: int
    productivity_score: int
    summary: str
    recommendations: list[str]