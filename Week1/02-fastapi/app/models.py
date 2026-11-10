"""Pydantic schemas for request validation and response serialization."""

from typing import Any, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserCreate(BaseModel):
    name: str = Field(..., description="Full name of the user, non-empty.")
    email: EmailStr = Field(..., description="Valid email address of the user.")

    model_config = ConfigDict(extra="forbid")

    @field_validator("name")
    @classmethod
    def validate_name_not_blank(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("User 'name' cannot be empty or whitespace-only.")
        return trimmed


class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    model_config = ConfigDict(from_attributes=True)


class ErrorResponse(BaseModel):
    error: str
    details: Optional[Any] = None


class RootResponse(BaseModel):
    status: str
    message: str
    framework: str
    version: str

