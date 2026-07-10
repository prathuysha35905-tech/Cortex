from pydantic import BaseModel


class PlanningSession(BaseModel):
    approved: bool = False
    current_plan: dict