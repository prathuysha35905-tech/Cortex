from app.ai.client import client
from app.ai.prompts import SYSTEM_PROMPT
from app.core.config import settings


def chat_with_cortex(message: str) -> str:

    response = client.chat.completions.create(
        model=settings.LMSTUDIO_MODEL,
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": message
            }
        ],
        temperature=0.4
    )

    return response.choices[0].message.content