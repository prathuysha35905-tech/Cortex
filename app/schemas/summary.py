from pydantic import BaseModel


class DailySummary(BaseModel):
    completed_tasks: int
    pending_tasks: int
    habit_streak: int
    completed_goals: int
    productivity_score: int
    message: str