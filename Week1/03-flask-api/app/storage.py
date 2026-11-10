"""In-memory storage for User records in Flask.

Holds user objects in memory during runtime.
Resets upon server restart.
"""

from typing import Dict, List, Optional
import threading


class UserStore:
    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._users: Dict[int, dict] = {}
        self._next_id: int = 1

    def get_all(self) -> List[dict]:
        """Return a copy of all users."""
        with self._lock:
            return list(self._users.values())

    def get_by_id(self, user_id: int) -> Optional[dict]:
        """Retrieve user by numeric ID."""
        with self._lock:
            user = self._users.get(user_id)
            return dict(user) if user else None

    def create(self, name: str, email: str) -> dict:
        """Create and store a new user."""
        with self._lock:
            user_id = self._next_id
            self._next_id += 1
            new_user = {
                "id": user_id,
                "name": name.strip(),
                "email": email.strip().lower(),
            }
            self._users[user_id] = new_user
            return dict(new_user)

    def reset(self) -> None:
        """Clear all stored users and reset ID counter (for tests)."""
        with self._lock:
            self._users.clear()
            self._next_id = 1


# Global singleton instance
user_store = UserStore()

