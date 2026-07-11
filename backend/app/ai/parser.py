import json


def parse_ai_response(response: str):
    try:
        return json.loads(response)
    except Exception:
        return {
            "intent": "chat",
            "response": response
        }