from pydantic import BaseModel


class Recommendation(BaseModel):
    title: str
    message: str
    priority: str


class RecommendationResponse(BaseModel):
    recommendations: list[Recommendation]