# Flask User Management REST API

> **DecodeLabs Internship — Week 1 Backend Development**  
> Implementation 3 of 3: Python with Flask

---

## 1. Framework and Technology Stack

- **Framework:** Flask 3.1+
- **WSGI Engine:** Werkzeug
- **Language:** Python 3.10+ (tested on Python 3.13.0)
- **Architecture:** Application Factory Pattern (`create_app`) with Modular Blueprints
- **Validation:** Explicit regex and boundary inspection
- **Testing:** Pytest 8.x with Flask's built-in `test_client()`
- **Storage:** Thread-safe in-memory dictionary (`UserStore`)

---

## 2. Prerequisites and Installation

### Prerequisites
- Python 3.10+ (Python 3.13.0 tested)
- pip package manager

### Installation
Clone or navigate to the project directory:

```bash
cd 03-flask-api
```

Install dependencies:
```bash
pip install -r requirements.txt
```

---

## 3. How to Start the Local Server

### Default Port (5000)
Run using the entrypoint script:
```bash
python run.py
```

Or using Flask CLI:
```bash
flask --app "app:create_app()" run --port 5000
```

### Configurable Port (Environment Variables)
The server reads `HOST`, `PORT`, and `FLASK_DEBUG` environment variables:

**PowerShell / Windows:**
```powershell
$env:PORT=5500; python run.py
```

**Bash / Linux / macOS:**
```bash
PORT=5500 python run.py
```

Once running, the server logs:
```text
[Flask API] Server starting on http://0.0.0.0:5000
[Flask API] Root endpoint: http://localhost:5000/
[Flask API] Users endpoint: http://localhost:5000/users
```

---

## 4. Available Endpoints

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/` | API status and health check | `200 OK` |
| `GET` | `/users` | Retrieve all users in memory | `200 OK` |
| `GET` | `/users/<id>` | Retrieve single user by numeric ID | `200 OK` / `404 Not Found` / `400 Bad Request` |
| `POST` | `/users` | Create user with explicit validation | `201 Created` / `400 Bad Request` |

---

## 5. Example Requests and Responses

### 5.1 Root Endpoint
**Request:**
```http
GET / HTTP/1.1
Host: localhost:5000
```

**Response (`200 OK`):**
```json
{
  "status": "ok",
  "message": "DecodeLabs User Management API (Flask) is running",
  "framework": "Flask",
  "version": "1.0.0"
}
```

---

### 5.2 Retrieve All Users (Empty State)
**Request:**
```http
GET /users HTTP/1.1
Host: localhost:5000
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
Host: localhost:5000
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
Host: localhost:5000
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
Host: localhost:5000
```

**Response (`404 Not Found`):**
```json
{
  "error": "User not found"
}
```

---

### 5.6 Validation Failure (Missing or Blank Name)
**Request:**
```http
POST /users HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "name": "   ",
  "email": "aisha@example.com"
}
```

**Response (`400 Bad Request`):**
```json
{
  "error": "Validation error: 'name' cannot be empty or whitespace-only."
}
```

---

### 5.7 Validation Failure (Invalid Email)
**Request:**
```http
POST /users HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "name": "Aisha",
  "email": "not-valid-address"
}
```

**Response (`400 Bad Request`):**
```json
{
  "error": "Validation error: 'email' must be a valid email address."
}
```

---

### 5.8 Malformed JSON Syntax
**Request:**
```http
POST /users HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{ "name": "Aisha", broken_json: }
```

**Response (`400 Bad Request`):**
```json
{
  "error": "Malformed JSON: Request body contains invalid JSON syntax."
}
```

---

## 6. How to Execute Tests

The test suite exercises all 10 mandatory test scenarios defined in the DecodeLabs specification.

Run:
```bash
pytest
```

Or with verbose output:
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

============================= 10 passed in 0.26s ==============================
```

---

## 7. Known Limitations

1. **In-Memory Volatility:** All user data is stored strictly in memory (`user_store`). Restarting or crashing the server completely resets the user store.
2. **Stateless Clustering:** Running multiple WSGI workers (e.g., Gunicorn with `-w 4`) creates distinct memory spaces per worker. For production use, a persistent database (PostgreSQL, SQLite, MySQL) is required.
3. **No Authentication or Authorization:** The API endpoints are unauthenticated and public per Week 1 scope boundaries.

