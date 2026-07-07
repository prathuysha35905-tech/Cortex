from openai import OpenAI

from app.core.config import settings

client = OpenAI(
    base_url=settings.LMSTUDIO_BASE_URL,
    api_key=settings.LMSTUDIO_API_KEY,
)