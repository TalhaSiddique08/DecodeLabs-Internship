"""User management routes for FastAPI."""

from typing import List
from fastapi import APIRouter, HTTPException, Path, status
from app.models import ErrorResponse, UserCreate, UserResponse
from app.storage import user_store

router = APIRouter(prefix="/users", tags=["Users"])


@router.get(
    "",
    response_model=List[UserResponse],
    status_code=status.HTTP_200_OK,
    summary="Retrieve all users",
    description="Returns an array of all registered users. Returns an empty array if none exist.",
)
def get_all_users() -> List[dict]:
    return user_store.get_all()


@router.get(
    "/{user_id}",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve a user by ID",
    description="Look up a single user by numeric ID. Returns 404 if not found.",
    responses={
        404: {"model": ErrorResponse, "description": "User not found"},
        422: {"model": ErrorResponse, "description": "Validation error on ID parameter"},
    },
)
def get_user_by_id(
    user_id: int = Path(..., ge=1, description="Unique positive integer user ID")
) -> dict:
    user = user_store.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


@router.post(
    "",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new user",
    description="Accepts user name and email, validates input, assigns unique ID, and stores user in memory.",
    responses={
        400: {"model": ErrorResponse, "description": "Malformed JSON"},
        422: {"model": ErrorResponse, "description": "Validation error"},
    },
)
def create_user(payload: UserCreate) -> dict:
    created_user = user_store.create(name=payload.name, email=payload.email)
    return created_user

