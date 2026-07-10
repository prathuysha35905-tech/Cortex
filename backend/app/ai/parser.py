import json


def parse_ai_response(response: str):
    """
    Convert the LLM JSON string into a Python dictionary.
    """

    return json.loads(response)