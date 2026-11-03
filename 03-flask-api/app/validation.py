"""Explicit input validation logic for Flask."""

import re
from typing import Optional, Tuple

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")


def validate_user_payload(data: Optional[dict]) -> Tuple[bool, Optional[str], Optional[dict]]:
    """Validate POST /users JSON payload.

    Returns:
        (is_valid: bool, error_message: str | None, cleaned_data: dict | None)
    """
    if data is None or not isinstance(data, dict):
        return False, "Validation error: Request body must be a valid JSON object.", None

    name = data.get("name")
    email = data.get("email")

    # Validate name
    if name is None or not isinstance(name, str):
        return False, "Validation error: 'name' is required and must be a string.", None

    trimmed_name = name.strip()
    if not trimmed_name:
        return False, "Validation error: 'name' cannot be empty or whitespace-only.", None

    # Validate email
    if email is None or not isinstance(email, str):
        return False, "Validation error: 'email' is required and must be a string.", None

    trimmed_email = email.strip()
    if not trimmed_email:
        return False, "Validation error: 'email' cannot be empty.", None

    if not EMAIL_REGEX.match(trimmed_email):
        return False, "Validation error: 'email' must be a valid email address.", None

    return True, None, {"name": trimmed_name, "email": trimmed_email.lower()}


def validate_user_id(raw_id: str) -> Tuple[bool, Optional[str], Optional[int]]:
    """Validate numeric user ID parameter.

    Returns:
        (is_valid: bool, error_message: str | None, user_id: int | None)
    """
    try:
        user_id = int(raw_id)
        if user_id <= 0:
            return False, "Invalid user ID: must be a positive integer.", None
        return True, None, user_id
    except (ValueError, TypeError):
        return False, "Invalid user ID: must be a positive integer.", None
