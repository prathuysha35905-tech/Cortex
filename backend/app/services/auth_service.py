from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password, verify_password


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def create_user(db: Session, user: UserCreate):

    if get_user_by_email(db, user.email):
        raise ValueError("Email already exists.")

    if get_user_by_username(db, user.username):
        raise ValueError("Username already exists.")

    new_user = User(
        full_name=user.full_name,
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def authenticate_user(
    db: Session,
    identifier: str,
    password: str
):
    # The frontend login form collects a *username*, but this is also
    # called "email" historically here - accept either so login works
    # regardless of which one was actually typed in.
    user = get_user_by_username(db, identifier) or get_user_by_email(db, identifier)

    if not user:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    return user