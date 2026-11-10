# FastAPI User Management REST API

> **DecodeLabs Internship — Week 1 Backend Development**  
> Implementation 2 of 3: Python with FastAPI

---

## 1. Framework and Technology Stack

- **Framework:** FastAPI (0.115+)
- **ASGI Server:** Uvicorn (0.34+)
- **Validation Engine:** Pydantic v2 (with `EmailStr` and custom field validators)
- **Language:** Python 3.10+ (tested on Python 3.13.0)
- **Testing:** Pytest 8.x with `TestClient` (Starlette / HTTPX)
- **API Documentation:** Interactive Swagger UI (`/docs`) & ReDoc (`/redoc`)
- **Storage:** Thread-safe in-memory dictionary (`UserStore`)

---

## 2. Prerequisites and Installation

### Prerequisites
- Python 3.10+ (Python 3.13.0 tested)
- pip package manager

### Installation
Clone or navigate to the project directory:

```bash
cd 02-fastapi
```

Install dependencies:
```bash
pip install -r requirements.txt
```

---

## 3. How to Start the Local Server

### Default Port (8000)
Run directly via Uvicorn CLI:
```bash
uvicorn app.main:app --reload --port 8000
```

Or run via Python module:
```bash
python -m app.main
```

### Configurable Port (Environment Variables)
The server reads `HOST` and `PORT` environment variables:

**PowerShell / Windows:**
```powershell
$env:PORT=8080; python -m app.main
```

**Bash / Linux / macOS:**
```bash
PORT=8080 python -m app.main
```

Once running, the service exposes:
- **Root endpoint:** `http://localhost:8000/`
- **Users API:** `http://localhost:8000/users`
- **Interactive OpenAPI Documentation:** `http://localhost:8000/docs`
- **ReDoc Documentation:** `http://localhost:8000/redoc`

---

## 4. Available Endpoints

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/` | API status and health check | `200 OK` |
| `GET` | `/users` | Retrieve all users in memory | `200 OK` |
| `GET` | `/users/{user_id}` | Retrieve single user by ID | `200 OK` / `404 Not Found` / `422 Unprocessable Entity` |
| `POST` | `/users` | Create user with Pydantic validation | `201 Created` / `422 Unprocessable Entity` / `400 Bad Request` |
| `GET` | `/docs` | Interactive Swagger UI | `200 OK` |
| `GET` | `/redoc` | ReDoc API specifications | `200 OK` |

---

## 5. Example Requests and Responses

### 5.1 Root Endpoint
**Request:**
```http
GET / HTTP/1.1
Host: localhost:8000
```

**Response (`200 OK`):**
```json
{
  "status": "ok",
  "message": "DecodeLabs User Management API (FastAPI) is running",
  "framework": "FastAPI",
  "version": "1.0.0"
}
```

---

### 5.2 Retrieve All Users (Empty State)
**Request:**
```http
GET /users HTTP/1.1
Host: localhost:8000
```

**Response (`200 OK`):**
```json
[]
```

---

### 5.3 Create a User (Valid Request)
**Request:**
```http
POST /users HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
  "name": "Aisha",
  "email": "aisha@example.com"
}
```

**Response (`201 Created`):**
```json
{
  "id": 1,
  "name": "Aisha",
  "email": "aisha@example.com"
}
```

---

### 5.4 Retrieve a User by ID
**Request:**
```http
GET /users/1 HTTP/1.1
Host: localhost:8000
```

**Response (`200 OK`):**
```json
{
  "id": 1,
  "name": "Aisha",
  "email": "aisha@example.com"
}
```

---

### 5.5 Retrieve Nonexistent User
**Request:**
```http
GET /users/999 HTTP/1.1
Host: localhost:8000
```

**Response (`404 Not Found`):**
```json
{
  "error": "User not found"
}
```

---

### 5.6 Validation Failure (Missing / Whitespace Name)
**Request:**
```http
POST /users HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
  "name": "   ",
  "email": "aisha@example.com"
}
```

**Response (`422 Unprocessable Entity`):**
```json
{
  "error": "Validation error: body -> name: Value error, User 'name' cannot be empty or whitespace-only.",
  "details": [
    {
      "type": "value_error",
      "loc": ["body", "name"],
      "msg": "Value error, User 'name' cannot be empty or whitespace-only."
    }
  ]
}
```

---

### 5.7 Validation Failure (Invalid Email)
**Request:**
```http
POST /users HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{
  "name": "Aisha",
  "email": "invalid-format"
}
```

**Response (`422 Unprocessable Entity`):**
```json
{
  "error": "Validation error: body -> email: value is not a valid email address: The email address is not valid. It must have exactly one @-sign.",
  "details": [ ... ]
}
```

---

### 5.8 Malformed JSON Syntax
**Request:**
```http
POST /users HTTP/1.1
Host: localhost:8000
Content-Type: application/json

{ "name": "Aisha", broken_json: }
```

**Response (`400 Bad Request`):**
```json
{
  "error": "Malformed JSON: Request body contains invalid JSON syntax.",
  "details": "JSON decode error"
}
```

---

## 6. How to Execute Tests

The test suite exercises all 10 mandatory test scenarios defined in the DecodeLabs specification.

Run:
```bash
pytest
```

Or run with verbose output:
```bash
pytest -v
```

### Expected Output
```text
tests/test_api.py::test_01_root_endpoint PASSED                          [ 10%]
tests/test_api.py::test_02_retrieve_users_empty PASSED                   [ 20%]
tests/test_api.py::test_03_create_valid_user PASSED                      [ 30%]
tests/test_api.py::test_04_retrieve_existing_user PASSED                 [ 40%]
tests/test_api.py::test_05_retrieve_nonexistent_user PASSED              [ 50%]
tests/test_api.py::test_06_create_user_without_name PASSED               [ 60%]
tests/test_api.py::test_07_create_user_without_email PASSED              [ 70%]
tests/test_api.py::test_08_create_user_with_invalid_email PASSED         [ 80%]
tests/test_api.py::test_09_send_malformed_json PASSED                    [ 90%]
tests/test_api.py::test_10_create_multiple_users PASSED                  [100%]

============================= 10 passed in 0.51s ==============================
```

---

## 7. Known Limitations

1. **In-Memory Volatility:** All user data is stored strictly in memory (`user_store`). Restarting or crashing the server completely resets the user store.
2. **Stateless Clustering:** Running multiple worker processes (e.g. `uvicorn --workers 4`) would partition memory across processes. For real production multi-worker environments, an external database (e.g. PostgreSQL) is required.
3. **No Authentication or Authorization:** The API endpoints are unauthenticated and public per Week 1 scope boundaries.

