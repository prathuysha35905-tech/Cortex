from pydantic import BaseModel


class AnalyticsResponse(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    completion_rate: float

    total_habits: int
    completed_habits: int

    productivity_score: float