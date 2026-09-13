from google.oauth2.credentials import Credentials

from app.integrations.google_calendar.auth import get_google_auth_flow


def exchange_code_for_tokens(code: str):
    """
    Exchange Google's authorization code for access
    and refresh tokens.
    """

    flow = get_google_auth_flow()

    flow.fetch_token(code=code)

    credentials: Credentials = flow.credentials

    return {
        "access_token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "expiry": credentials.expiry,
    }