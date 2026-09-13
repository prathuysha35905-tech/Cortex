from fastapi import APIRouter
from fastapi.responses import RedirectResponse

from app.integrations.google_calendar.service import (
    generate_google_login_url,
)
from fastapi import Request

from app.integrations.google_calendar.oauth_service import (
    exchange_code_for_tokens,
)
router = APIRouter(
    prefix="/calendar",
    tags=["Google Calendar"],
)


@router.get("/connect")
def connect_google():

    url = generate_google_login_url()

    return RedirectResponse(url)


@router.get("/callback")
def google_callback(request: Request):

    code = request.query_params.get("code")

    if not code:
        return {
            "status": "error",
            "message": "Authorization code not received."
        }

    tokens = exchange_code_for_tokens(code)

    return {
        "status": "success",
        "tokens": tokens
    }