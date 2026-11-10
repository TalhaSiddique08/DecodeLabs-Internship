# DecodeLabs — Week 1: REST API Fundamentals (Multi-Framework Implementation)

[![Tests](https://img.shields.io/badge/Tests-30%2F30%20Passed-brightgreen)](file:///d:/Desktop/DecodeLabs/Week1%20-%20REST%20API%20FUNDAMENTALS/run_all_tests.py)
[![Node](https://img.shields.io/badge/Node.js-v20.19.4-green)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.13.0-blue)](https://python.org/)
[![Express](https://img.shields.io/badge/Express-4.21.2-lightgrey)](https://expressjs.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.14-teal)](https://fastapi.tiangolo.com/)
[![Flask](https://img.shields.io/badge/Flask-3.1.3-black)](https://flask.palletsprojects.com/)

## 1. Project Overview

This repository contains the complete implementation for **DecodeLabs Backend Development Internship — Week 1 Project: REST API Fundamentals — Multi-Framework Implementation**.

The core objective is to design, implement, and benchmark the **exact same User Management REST API** across three premier backend frameworks:
1. **Node.js with Express.js** (`01-express-api`)
2. **Python with FastAPI** (`02-fastapi`)
3. **Python with Flask** (`03-flask-api`)

Each implementation operates **statelessly** with an **in-memory collection**, providing uniform routing, JSON request/response structures, input validation, robust error handling, and standard HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `422 Unprocessable Entity`, `500 Internal Server Error`).

---

## 2. Directory Structure

```text
Week 1 - REST API FUNDAMENTALS/
├── PROJECT_SPECIFICATION.md          # Official DecodeLabs assignment specification
├── README.md                         # Main repository guide & cross-framework analysis
├── run_all_tests.py                  # Unified multi-framework test runner (30/30 passed)
├── .gitignore                        # Global Git ignore rules
│
├── 01-express-api/                   # Express.js Implementation (Node.js)
│   ├── src/
│   │   ├── app.js                    # Express app configuration & middleware pipeline
│   │   ├── server.js                 # HTTP listener & port configuration
│   │   ├── routes/
│   │   │   └── userRoutes.js         # REST routes for /users
│   │   ├── middleware/
│   │   │   ├── validation.js         # Request validation middleware
│   │   │   └── errorHandler.js       # Centralized error handler & JSON parser guards
│   │   └── data/
│   │       └── userStore.js          # In-memory user data store
│   ├── tests/
│   │   └── api.test.js               # Node.js native test suite (10 mandatory cases)
│   ├── package.json                  # Dependencies & npm scripts
│   ├── .env.example                  # Environment configuration template
│   ├── .gitignore                    # Node-specific ignore rules
│   └── README.md                     # Dedicated Express.js documentation
│
├── 02-fastapi/                       # FastAPI Implementation (Python)
│   ├── app/
│   │   ├── __init__.py               # Package marker
│   │   ├── main.py                   # FastAPI instance, exception handlers & root route
│   │   ├── models.py                 # Pydantic v2 validation models & schemas
│   │   ├── storage.py                # Thread-safe in-memory store
│   │   └── routers/
│   │       ├── __init__.py           # Routers package marker
│   │       └── users.py              # APIRouter for /users
│   ├── tests/
│   │   ├── __init__.py               # Tests package marker
│   │   └── test_api.py               # Pytest suite with Starlette/HTTPX TestClient (10 cases)
│   ├── requirements.txt              # Python dependencies
│   ├── .env.example                  # Environment configuration template
│   ├── .gitignore                    # Python-specific ignore rules
│   └── README.md                     # Dedicated FastAPI documentation
│
└── 03-flask-api/                     # Flask Implementation (Python)
    ├── app/
    │   ├── __init__.py               # Flask application factory (create_app)
    │   ├── routes.py                 # Blueprint for API endpoints
    │   ├── storage.py                # Thread-safe in-memory store
    │   ├── validation.py             # Explicit request validation helpers
    │   └── errors.py                 # Error handling blueprint
    ├── tests/
    │   ├── __init__.py               # Tests package marker
    │   └── test_api.py               # Pytest suite using Flask WSGI test_client (10 cases)
    ├── requirements.txt              # Python dependencies
    ├── run.py                        # Server startup script
    ├── .env.example                  # Environment configuration template
    ├── .gitignore                    # Flask-specific ignore rules
    └── README.md                     # Dedicated Flask documentation
```

---

## 3. Implementation Quick Links

- [**01-express-api**](file:///d:/Desktop/DecodeLabs/Week1%20-%20REST%20API%20FUNDAMENTALS/01-express-api/README.md): Node.js + Express.js implementation guide, configuration, and API reference.
- [**02-fastapi**](file:///d:/Desktop/DecodeLabs/Week1%20-%20REST%20API%20FUNDAMENTALS/02-fastapi/README.md): Python + FastAPI implementation guide, OpenAPI Swagger docs, and Pydantic validation.
- [**03-flask-api**](file:///d:/Desktop/DecodeLabs/Week1%20-%20REST%20API%20FUNDAMENTALS/03-flask-api/README.md): Python + Flask implementation guide, Application Factory pattern, and manual validation.

---

## 4. API Specification & Contract

All three implementations adhere to the identical RESTful API contract:

| Method | Endpoint | Description | Request Body | Success Status | Error Status Codes |
|---|---|---|---|---|---|
| `GET` | `/` | Health check & server status confirmation | None | `200 OK` | `500` |
| `GET` | `/users` | Retrieve all users in memory | None | `200 OK` (`[]` or array) | `500` |
| `GET` | `/users/{id}` | Retrieve single user by numeric ID | None | `200 OK` | `400` (invalid ID), `404` (not found), `500` |
| `POST` | `/users` | Create user with `name` and `email` | `{"name": "...", "email": "..."}` | `201 Created` | `400` / `422` (validation error / malformed JSON), `500` |

### Sample JSON Payloads

#### User Creation Request (`POST /users`):
```json
{
  "name": "Aisha",
  "email": "aisha@example.com"
}
```

#### Successful Creation Response (`201 Created`):
```json
{
  "id": 1,
  "name": "Aisha",
  "email": "aisha@example.com"
}
```

#### Error Response (`404 Not Found`):
```json
{
  "error": "User not found"
}
```

---

## 5. Comprehensive Framework Comparison

Based directly on building, refining, and testing the three implementations, the following analysis details how each framework addresses core backend engineering requirements:

| Dimension | Express.js (Node.js) | FastAPI (Python) | Flask (Python) |
|---|---|---|---|
| **Runtime & Language** | Node.js (V8 engine, single-threaded event loop) | Python 3.10+ (Asynchronous ASGI via Uvicorn/AnyIO) | Python 3.10+ (Synchronous WSGI via Werkzeug) |
| **Ease of Setup** | Moderate. Requires `npm init`, installing `express`, setting up scripts and project layout. | High. Clean package management, minimal boilerplate to spin up a working API. | High. Minimalistic, can run a single-file prototype in under 10 lines of code. |
| **Route Definition** | `router.get('/', handler)` using middleware chaining `(req, res, next)`. | Decorators `@router.get('/')` with type annotations and auto-dependency injection. | Decorators `@api_bp.route('/', methods=['GET'])` on Blueprints. |
| **JSON Serialization** | Manual middleware `express.json()`; serialization via `res.json(data)`. | Automatic bidirectional serialization using Pydantic schemas (`response_model`). | Built-in `jsonify(data)` helper with automatic header handling. |
| **Input Validation** | Manual / Custom middleware. Requires explicit regex checks or external packages (Joi, Zod). | **Outstanding.** Declarative Pydantic schemas (`EmailStr`, validators). Auto-validates types and payloads. | Explicit manual validation in Python (regex checks, checking `dict` keys). |
| **Error Handling** | 4-argument middleware `(err, req, res, next)` catching errors in pipeline. | Exception handlers decorated with `@app.exception_handler(...)`. | Blueprint/App `@app.errorhandler(...)` capturing Werkzeug HTTP errors. |
| **API Documentation** | None out of the box. Requires manual OpenAPI / Swagger JSDoc annotations. | **Automatic.** Native interactive Swagger UI (`/docs`) and ReDoc (`/redoc`) generated from types. | None out of the box. Requires extensions like `flask-smorest` or `flasgger`. |
| **Code Organization** | Highly flexible/unopinionated. Layered architecture (routes, controllers, middlewares). | Highly structured with modular `APIRouter`, Pydantic models, and dependency injection. | Flexible. Typically structured using Application Factory (`create_app`) and Blueprints. |
| **Testing Paradigm** | Native `node:test` + ephemeral HTTP server with native `fetch`. | Pytest + Starlette/HTTPX `TestClient` (in-memory ASGI transport). | Pytest + `app.test_client()` (in-memory WSGI transport). |

### Detailed Evaluation of the Dimensions

### 1. Ease of Setup
- **Express.js:** Setup involves initializing `package.json`, configuring scripts, installing dependencies, and structuring folders. While lightweight, it requires manual boilerplate for body parsing, route structuring, and error handling.
- **FastAPI:** Requires `fastapi`, `uvicorn`, and `pydantic`. Setup is modern and clean, with sensible defaults and fast execution.
- **Flask:** Highly approachable and minimal. A complete Flask API requires just `pip install flask`, making it the fastest to prototype from scratch.

### 2. Route Definition & Request Handling
- **Express.js:** Routes are constructed using `express.Router()`. Handlers receive `(req, res, next)` and chain through middleware. Passing data between handlers is typically done via property attachment on `req`.
- **FastAPI:** Uses Python type hints directly in route signatures (`user_id: int = Path(...)`, `payload: UserCreate`). FastAPI parses, type-casts, and validates route parameters before the function body executes.
- **Flask:** Uses URL converters like `<raw_id>` or `<int:user_id>`. Request information is accessed through thread-local proxy objects (`request.get_json()`), requiring careful boundary validation.

### 3. JSON Serialization & Deserialization
- **Express.js:** Incoming JSON is parsed by `express.json()`. Outgoing payloads are serialized with `res.json()`, which handles setting the `Content-Type: application/json` header and stringifying objects.
- **FastAPI:** Fully automated. Request bodies are converted to Pydantic objects. Return values are automatically serialized into JSON according to `response_model=UserResponse`, stripping sensitive attributes if defined.
- **Flask:** `request.get_json()` parses incoming payloads into Python dicts. Outgoing data is serialized using `jsonify()`.

### 4. Input Validation
- **Express.js:** Express has no built-in schema validation. We implemented a dedicated validation middleware ([`validateUserCreation`](file:///d:/Desktop/DecodeLabs/Week1%20-%20REST%20API%20FUNDAMENTALS/01-express-api/src/middleware/validation.js#L14-L45)) that verifies string types, trims whitespace, and applies an RFC-compliant email regex.
- **FastAPI:** The strongest of the three. Uses Pydantic schemas ([`UserCreate`](file:///d:/Desktop/DecodeLabs/Week1%20-%20REST%20API%20FUNDAMENTALS/02-fastapi/app/models.py#L7-L20)) with `@field_validator` and `EmailStr`. Rejects missing fields, incorrect types, whitespace-only strings, and invalid email formats automatically with precise location pointers.
- **Flask:** Relies on manual procedural checks ([`validate_user_payload`](file:///d:/Desktop/DecodeLabs/Week1%20-%20REST%20API%20FUNDAMENTALS/03-flask-api/app/validation.py#L9-L40)). While effective and transparent, manual validation code grows linearly with model complexity.

### 5. Error Handling & Malformed Payload Resilience
- **Express.js:** Error handling is managed by a 4-argument middleware ([`errorHandler`](file:///d:/Desktop/DecodeLabs/Week1%20-%20REST%20API%20FUNDAMENTALS/01-express-api/src/middleware/errorHandler.js#L16-L39)). When `express.json()` encounters malformed JSON syntax, it throws a `SyntaxError` with status 400, which our middleware intercepts and translates into `{ "error": "Malformed JSON: Request body contains invalid JSON syntax." }`.
- **FastAPI:** Exception handlers catch `RequestValidationError` and `StarletteHTTPException`. For malformed JSON bodies, Pydantic emits `json_invalid`, which our handler maps directly to HTTP 400.
- **Flask:** Werkzeug throws `BadRequest` when JSON parsing fails in `request.get_json()`. Our error blueprint catches `BadRequest` and formats a uniform error response.

### 6. API Documentation Support
- **Express.js:** Zero automated documentation. Documentation must be maintained manually or via third-party annotations (Swagger UI Express / JSDoc).
- **FastAPI:** First-class automated documentation. Without writing extra documentation code, FastAPI exposes interactive Swagger UI (`/docs`) and ReDoc (`/redoc`) based entirely on Python type hints and Pydantic models.
- **Flask:** No built-in documentation engine. Requires external extensions (`flasgger` or `flask-smorest`).

### 7. Code Organization
- **Express.js:** Modularized into `src/routes`, `src/middleware`, `src/data`, and `src/app.js`.
- **FastAPI:** Clean separation of concerns with `app/routers`, `app/models.py`, `app/storage.py`, and `app/main.py`.
- **Flask:** Implemented using Flask's recommended Application Factory pattern (`create_app`) with Blueprints in `app/routes.py`, `app/validation.py`, and `app/storage.py`.

---

## 6. Summary of Test Results

All 10 mandatory test cases specified in the DecodeLabs assignment were executed against each framework.

### Mandatory Test Case Matrix

| # | Test Scenario | Expected Result | Express.js Actual | FastAPI Actual | Flask Actual | Result |
|---|---|---|---|---|---|---|
| **1** | Check root endpoint (`GET /`) | `200 OK` | `200 OK` | `200 OK` | `200 OK` | **PASS** |
| **2** | Retrieve users when empty (`GET /users`) | `200 OK` with `[]` | `200 OK` (`[]`) | `200 OK` (`[]`) | `200 OK` (`[]`) | **PASS** |
| **3** | Create valid user (`POST /users`) | `201 Created` | `201 Created` (ID: 1) | `201 Created` (ID: 1) | `201 Created` (ID: 1) | **PASS** |
| **4** | Retrieve existing user (`GET /users/1`) | `200 OK` | `200 OK` | `200 OK` | `200 OK` | **PASS** |
| **5** | Retrieve nonexistent user (`GET /users/999`) | `404 Not Found` | `404 Not Found` | `404 Not Found` | `404 Not Found` | **PASS** |
| **6** | Create user without name (missing/whitespace) | Client error (`400`/`422`) | `400 Bad Request` | `422 Unprocessable` | `400 Bad Request` | **PASS** |
| **7** | Create user without email | Client error (`400`/`422`) | `400 Bad Request` | `422 Unprocessable` | `400 Bad Request` | **PASS** |
| **8** | Create user with invalid email format | Client error (`400`/`422`) | `400 Bad Request` | `422 Unprocessable` | `400 Bad Request` | **PASS** |
| **9** | Send malformed JSON body | Client error (`400`) | `400 Bad Request` | `400 Bad Request` | `400 Bad Request` | **PASS** |
| **10** | Create multiple users (unique IDs) | Unique sequential IDs | `201 Created` (IDs 1,2,3) | `201 Created` (IDs 1,2,3) | `201 Created` (IDs 1,2,3) | **PASS** |

### Automated Test Runner Execution Output

Running `python run_all_tests.py` produces the following result:

```text
======================================================================
 DecodeLabs - Week 1: Multi-Framework REST API Test Runner
======================================================================

======================================================================
Running Test Suite: Express.js (Node.js)
Directory: D:\Desktop\DecodeLabs\Week1 - REST API FUNDAMENTALS\01-express-api
Command: npm.cmd test
======================================================================
# Subtest: Express.js User Management API Test Suite
  ok 1 - 1. GET / - Root endpoint returns 200 OK and confirmation message
  ok 2 - 2. GET /users - Returns 200 OK and empty array [] when store is empty
  ok 3 - 3. POST /users - Creates a valid user and returns 201 Created
  ok 4 - 4. GET /users/:id - Returns 200 OK and the user object if found
  ok 5 - 5. GET /users/:id - Returns 404 Not Found when user does not exist
  ok 6 - 6. POST /users - Rejects creation without name (returns 400 Bad Request)
  ok 7 - 7. POST /users - Rejects creation without email (returns 400 Bad Request)
  ok 8 - 8. POST /users - Rejects creation with invalid email format (returns 400 Bad Request)
  ok 9 - 9. POST /users - Rejects malformed JSON body (returns 400 Bad Request)
  ok 10 - 10. POST /users - Multiple creations assign unique sequential IDs
# tests 10 | pass 10 | fail 0

======================================================================
Running Test Suite: FastAPI (Python)
Directory: D:\Desktop\DecodeLabs\Week1 - REST API FUNDAMENTALS\02-fastapi
Command: python -m pytest -v
======================================================================
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
10 passed in 0.65s

======================================================================
Running Test Suite: Flask (Python)
Directory: D:\Desktop\DecodeLabs\Week1 - REST API FUNDAMENTALS\03-flask-api
Command: python -m pytest -v
======================================================================
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
10 passed in 0.23s

======================================================================
 TEST EXECUTION SUMMARY
======================================================================
Framework                 | Test Result  | Duration  
----------------------------------------------------------------------
Express.js (Node.js)      | PASSED       | 0.8s
FastAPI (Python)          | PASSED       | 1.28s
Flask (Python)            | PASSED       | 0.91s
======================================================================
ALL FRAMEWORKS PASSED ALL 10 MANDATORY TEST CASES (30/30 PASSED)!
```

---

## 7. Key Technical Learnings

1. **Stateless REST Architecture:**
   - In a stateless service, every HTTP request contains all necessary metadata and payload. The server does not maintain session cookies or client-specific conversation state. This makes horizontal scaling straightforward once state is externalized to a database or cache.

2. **Validation Paradigms Across Frameworks:**
   - *Declarative Validation (FastAPI):* Using Pydantic models ensures types, bounds, and string trimming are handled at framework entry, dramatically reducing developer error and standardizing documentation.
   - *Middleware Chaining (Express.js):* Express allows fine-grained pipeline control. However, validating input requires building or adopting schema libraries; otherwise, boilerplate code proliferates.
   - *Procedural Validation (Flask):* While simple and completely transparent, procedural validation requires strict discipline to ensure consistency across endpoints.

3. **Error Boundary Management:**
   - Client errors must never result in unhandled 500 crashes or leak raw internal stack traces. Handling malformed JSON at the parser level (e.g. `SyntaxError` in Express, `BadRequest` in Flask, `json_invalid` in FastAPI) is essential for security and robustness.

4. **Async vs. Synchronous Concurrency Models:**
   - Node.js handles high concurrency using non-blocking I/O on a single thread.
   - FastAPI leverages Python `asyncio` and ASGI to handle concurrent asynchronous requests efficiently.
   - Flask uses synchronous WSGI, traditionally relying on multi-threading or multi-process workers (e.g., Gunicorn/uWSGI) to scale.

5. **HTTP Status Code Hygiene:**
   - Using precise HTTP status codes (`201` for creation, `200` for retrieval, `400` for syntax/schema failures, `404` for missing resources, `422` for semantically unprocessable entities) creates predictable APIs for API consumers and client libraries.

---

## 8. How to Run Locally

### Running the Full Test Suite
To verify all three implementations simultaneously:
```bash
python run_all_tests.py
```

### Running Individual Servers

#### Express.js (Port 3000)
```bash
cd 01-express-api
npm install
npm start
```

#### FastAPI (Port 8000)
```bash
cd 02-fastapi
pip install -r requirements.txt
python -m app.main
# Swagger docs: http://localhost:8000/docs
```

#### Flask (Port 5000)
```bash
cd 03-flask-api
pip install -r requirements.txt
python run.py
```

