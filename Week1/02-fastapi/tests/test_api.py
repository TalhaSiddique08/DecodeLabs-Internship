"""Automated Test Suite for FastAPI Implementation.

Covers all 10 mandatory test scenarios specified by DecodeLabs Week 1.
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.storage import user_store

client = TestClient(app)


@pytest.fixture(autouse=True)
def reset_store():
    """Reset the in-memory storage before each test case."""
    user_store.reset()
    yield
    user_store.reset()


def test_01_root_endpoint():
    """1. Check the root endpoint returns 200 OK and confirmation message."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "FastAPI" in data["message"]
    assert data["framework"] == "FastAPI"


def test_02_retrieve_users_empty():
    """2. Retrieve users when the collection is empty: 200 OK with []."""
    response = client.get("/users")
    assert response.status_code == 200
    assert response.json() == []


def test_03_create_valid_user():
    """3. Create a valid user: 201 Created and user JSON."""
    payload = {"name": "Aisha", "email": "aisha@example.com"}
    response = client.post("/users", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] == 1
    assert data["name"] == "Aisha"
    assert data["email"] == "aisha@example.com"


def test_04_retrieve_existing_user():
    """4. Retrieve an existing user by ID: 200 OK and matching user object."""
    create_res = client.post(
        "/users", json={"name": "Aisha", "email": "aisha@example.com"}
    )
    created_id = create_res.json()["id"]

    response = client.get(f"/users/{created_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == created_id
    assert data["name"] == "Aisha"
    assert data["email"] == "aisha@example.com"


def test_05_retrieve_nonexistent_user():
    """5. Retrieve a nonexistent user: 404 Not Found."""
    response = client.get("/users/999")
    assert response.status_code == 404
    data = response.json()
    assert data["error"] == "User not found"


def test_06_create_user_without_name():
    """6. Create a user without a name or whitespace name: Client error."""
    # Missing name
    res1 = client.post("/users", json={"email": "aisha@example.com"})
    assert res1.status_code == 422
    assert "name" in str(res1.json())

    # Whitespace-only name
    res2 = client.post("/users", json={"name": "   ", "email": "aisha@example.com"})
    assert res2.status_code == 422
    assert "name" in str(res2.json())


def test_07_create_user_without_email():
    """7. Create a user without an email: Client error."""
    response = client.post("/users", json={"name": "Aisha"})
    assert response.status_code == 422
    assert "email" in str(response.json())


def test_08_create_user_with_invalid_email():
    """8. Create a user with an invalid email: Client error."""
    response = client.post(
        "/users", json={"name": "Aisha", "email": "not-an-email"}
    )
    assert response.status_code == 422
    assert "email" in str(response.json())


def test_09_send_malformed_json():
    """9. Send malformed JSON body: Client error (400 Bad Request)."""
    response = client.post(
        "/users",
        content='{"name": "Aisha", broken_json: }',
        headers={"Content-Type": "application/json"},
    )
    assert response.status_code == 400
    data = response.json()
    assert "Malformed JSON" in data["error"]


def test_10_create_multiple_users():
    """10. Create multiple users: each receives a unique sequential ID."""
    u1 = client.post(
        "/users", json={"name": "Aisha", "email": "aisha@example.com"}
    ).json()
    u2 = client.post(
        "/users", json={"name": "Bilal", "email": "bilal@example.com"}
    ).json()
    u3 = client.post(
        "/users", json={"name": "Chirag", "email": "chirag@example.com"}
    ).json()

    assert u1["id"] == 1
    assert u2["id"] == 2
    assert u3["id"] == 3
    assert len({u1["id"], u2["id"], u3["id"]}) == 3

    all_users = client.get("/users").json()
    assert len(all_users) == 3

