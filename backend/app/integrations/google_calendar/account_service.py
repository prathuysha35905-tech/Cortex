from sqlalchemy.orm import Session

from app.models.google_account import GoogleAccount


def save_google_account(
    db: Session,
    user_id: int,
    tokens: dict,
    google_email: str = None,
):

    account = (
        db.query(GoogleAccount)
        .filter(
            GoogleAccount.user_id == user_id
        )
        .first()
    )

    if account:

        account.access_token = tokens["access_token"]
        account.refresh_token = tokens["refresh_token"]
        account.token_expiry = tokens["expiry"]

        if google_email:
            account.google_email = google_email

    else:

        account = GoogleAccount(
            user_id=user_id,
            access_token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
            token_expiry=tokens["expiry"],
            google_email=google_email,
        )

        db.add(account)

    db.commit()
    db.refresh(account)

    return account