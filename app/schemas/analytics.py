from pydantic import BaseModel


class TaskAnalytics(BaseModel):
    completed: int
    pending: int
    overdue: int


class HabitAnalytics(BaseModel):
    current_streak: int
    best_streak: int


class GoalAnalytics(BaseModel):
    completed: int
    pending: int


class DashboardAnalytics(BaseModel):
    tasks: TaskAnalytics
    habits: HabitAnalytics
    goals: GoalAnalytics
    productivity_score: int
    ai_insight: str


class ProductivityScore(BaseModel):
    score: int
    level: str
    insight: str