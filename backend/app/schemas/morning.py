from pydantic import BaseModel


class MorningPlan(BaseModel):
    greeting: str
    priorities: list[str]
    habits: list[str]
    advice: str
    motivation: str