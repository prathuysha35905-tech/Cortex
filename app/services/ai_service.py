from app.ai.client import client
from app.ai.prompts import SYSTEM_PROMPT
from app.core.config import settings


def format_context(context: dict) -> str:
    lines = []

    # ------------------------
    # Goals & Preferences (Memory)
    # ------------------------
    if context["memories"]:
        lines.append("USER MEMORIES:")

        for memory in context["memories"]:
            lines.append(
                f"- {memory['category']} | {memory['key']} : {memory['value']}"
            )

        lines.append("")

    # ------------------------
    # Tasks
    # ------------------------
    if context["tasks"]:
        lines.append("ACTIVE TASKS:")

        for task in context["tasks"]:
            lines.append(f"- {task}")

        lines.append("")

    # ------------------------
    # Habits
    # ------------------------
    if context["habits"]:
        lines.append("HABITS:")

        for habit in context["habits"]:
            lines.append(f"- {habit}")

        lines.append("")

    return "\n".join(lines)


def chat_with_cortex(
    message: str,
    context: dict | None = None
) -> str:

    user_message = message

    if context:
        context_text = format_context(context)

        user_message = f"""
Current User Context:

{context_text}

User Message:
{message}
"""

    response = client.chat.completions.create(
        model=settings.LMSTUDIO_MODEL,
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": user_message
            }
        ],
        temperature=0.4
    )

    return response.choices[0].message.content