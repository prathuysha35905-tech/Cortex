from app.integrations.google_calendar.auth import get_google_auth_flow


def generate_google_login_url():

    flow = get_google_auth_flow()

    authorization_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent"
    )

    print("\nGoogle OAuth URL:")
    print(authorization_url)

    return authorization_url


from datetime import datetime


def get_today_events(calendar_service):

    now = datetime.utcnow().isoformat() + "Z"

    events_result = (
        calendar_service.events()
        .list(
            calendarId="primary",
            timeMin=now,
            maxResults=20,
            singleEvents=True,
            orderBy="startTime",
        )
        .execute()
    )

    return events_result.get("items", [])