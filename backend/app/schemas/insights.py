from pydantic import BaseModel


class Insight(BaseModel):
    title: str
    message: str
    priority: str


class InsightResponse(BaseModel):
    insights: list[Insight]