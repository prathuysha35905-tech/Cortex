from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse, UserUpdate
from app.core.auth import create_access_token, get_current_user

from app.services.auth_service import (
    create_user,
    authenticate_user,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register", response_model=UserResponse)
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    try:
        return create_user(db, user)
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    authenticated_user = authenticate_user(
        db,
        form_data.username,
        form_data.password
    )
    
    

    if not authenticated_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    access_token = create_access_token(
        {
            "sub": authenticated_user.email
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": authenticated_user.id,
            "full_name": authenticated_user.full_name,
            "email": authenticated_user.email,
            "username": authenticated_user.username
        }
    }


@router.post("/logout")
def logout():
    # JWT auth is stateless server-side, so there is no session to
    # invalidate here -- this endpoint exists so the frontend has
    # something to call; the client discards its token after this.
    return {"detail": "Logged out."}


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user=Depends(get_current_user)
):
    return current_user


@router.patch("/me", response_model=UserResponse)
def update_me(
    update: UserUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if update.full_name is not None:
        current_user.full_name = update.full_name

    if update.email is not None:
        current_user.email = update.email

    db.commit()
    db.refresh(current_user)

    return current_user