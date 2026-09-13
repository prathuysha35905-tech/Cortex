from openai import OpenAI

from app.ai.client import client
from app.ai.parser import parse_ai_response

from app.memory.context import get_user_memories
import json


def ask_ai(system_prompt, user_prompt,):

    response = client.chat.completions.create(
        model="qwen3-8b",
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
        temperature=0.7,
    )

    return parse_ai_response(
        response.choices[0].message.content
    )





def ask_ai_with_memory(
    db,
    user_id,
    system_prompt: str,
    user_prompt: str,
):

    memories = get_user_memories(
        db,
        user_id,
    )

    memory_text = json.dumps(
        memories,
        indent=2,
    )

    full_prompt = f"""
User Memories:

{memory_text}

Current Request:

{user_prompt}
"""

    return ask_ai(
        system_prompt,
        full_prompt,
        
        
    )