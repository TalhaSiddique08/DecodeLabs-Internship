"""Automated Test Suite for Flask Implementation.

Covers all 10 mandatory test scenarios specified by DecodeLabs Week 1.
"""

import pytest
from app import create_app
from app.storage import user_store


@pytest.fixture
def client():
    app = create_app({"TESTING": True})
    with app.test_client() as client:
        yield client


@pytest.fixture(autouse=True)
def reset_store():
    """Reset store before each test."""
    user_store.reset()
    yield
    user_store.reset()


def test_01_root_endpoint(client):
    """1. Check the root endpoint returns 200 OK and confirmation message."""
    res = client.get("/")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "ok"
    assert "Flask" in data["message"]
    assert data["framework"] == "Flask"


def test_02_retrieve_users_empty(client):
    """2. Retrieve users when the collection is empty: 200 OK with []."""
    res = client.get("/users")
    assert res.status_code == 200
    assert res.get_json() == []


def test_03_create_valid_user(client):
    """3. Create a valid user: 201 Created and user JSON."""
    payload = {"name": "Aisha", "email": "aisha@example.com"}
    res = client.post("/users", json=payload)
    assert res.status_code == 201
    data = res.get_json()
    assert data["id"] == 1
    assert data["name"] == "Aisha"
    assert data["email"] == "aisha@example.com"


def test_04_retrieve_existing_user(client):
    """4. Retrieve an existing user by ID: 200 OK and user JSON."""
    create_res = client.post(
        "/users", json={"name": "Aisha", "email": "aisha@example.com"}
    )
    user_id = create_res.get_json()["id"]

    res = client.get(f"/users/{user_id}")
    assert res.status_code == 200
    data = res.get_json()
    assert data["id"] == user_id
    assert data["name"] == "Aisha"
    assert data["email"] == "aisha@example.com"


def test_05_retrieve_nonexistent_user(client):
    """5. Retrieve a nonexistent user: 404 Not Found."""
    res = client.get("/users/999")
    assert res.status_code == 404
    data = res.get_json()
    assert data["error"] == "User not found"


def test_06_create_user_without_name(client):
    """6. Create a user without a name or whitespace name: Client error (400)."""
    # Missing name
    res1 = client.post("/users", json={"email": "aisha@example.com"})
    assert res1.status_code == 400
    data1 = res1.get_json()
    assert "name" in data1["error"]

    # Whitespace-only name
    res2 = client.post("/users", json={"name": "   ", "email": "aisha@example.com"})
    assert res2.status_code == 400
    data2 = res2.get_json()
    assert "name" in data2["error"]


def test_07_create_user_without_email(client):
    """7. Create a user without an email: Client error (400)."""
    res = client.post("/users", json={"name": "Aisha"})
    assert res.status_code == 400
    data = res.get_json()
    assert "email" in data["error"]


def test_08_create_user_with_invalid_email(client):
    """8. Create a user with an invalid email: Client error (400)."""
    res = client.post("/users", json={"name": "Aisha", "email": "not-an-email"})
    assert res.status_code == 400
    data = res.get_json()
    assert "email" in data["error"]


def test_09_send_malformed_json(client):
    """9. Send malformed JSON body: Client error (400 Bad Request)."""
    res = client.post(
        "/users",
        data='{"name": "Aisha", broken_json: }',
        content_type="application/json",
    )
    assert res.status_code == 400
    data = res.get_json()
    assert "Malformed JSON" in data["error"]


def test_10_create_multiple_users(client):
    """10. Create multiple users: each receives a unique sequential ID."""
    u1 = client.post(
        "/users", json={"name": "Aisha", "email": "aisha@example.com"}
    ).get_json()
    u2 = client.post(
        "/users", json={"name": "Bilal", "email": "bilal@example.com"}
    ).get_json()
    u3 = client.post(
        "/users", json={"name": "Chirag", "email": "chirag@example.com"}
    ).get_json()

    assert u1["id"] == 1
    assert u2["id"] == 2
    assert u3["id"] == 3
    assert len({u1["id"], u2["id"], u3["id"]}) == 3

    all_users = client.get("/users").get_json()
    assert len(all_users) == 3

