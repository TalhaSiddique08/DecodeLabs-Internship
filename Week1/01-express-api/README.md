# Express.js User Management REST API

> **DecodeLabs Internship — Week 1 Backend Development**  
> Implementation 1 of 3: Node.js with Express.js

---

## 1. Framework and Technology Stack

- **Runtime:** Node.js (v18+ / v20+)
- **Framework:** Express.js 4.x
- **Language:** JavaScript (CommonJS)
- **Architecture:** Layered REST API (Routes, Middleware, In-Memory Store)
- **Testing:** Node.js built-in test runner (`node:test`, `node:assert`) with native HTTP requests
- **Storage:** In-memory array (stateless, transient)

---

## 2. Prerequisites and Installation

### Prerequisites
- Node.js (v18.0.0 or higher recommended, tested on Node v20.19.4)
- npm (v9.0.0 or higher, tested on npm 10.8.2)

### Installation
Clone or navigate to the project directory:

```bash
cd 01-express-api
npm install
```

---

## 3. How to Start the Local Server

### Default Port (3000)
```bash
npm start
```

### Development Mode (Watch Mode)
```bash
npm run dev
```

### Configurable Port (Environment Variable)
The server respects the `PORT` and `HOST` environment variables:

**PowerShell / Windows:**
```powershell
$env:PORT=4000; npm start
```

**Bash / Linux / macOS:**
```bash
PORT=4000 npm start
```

Once running, the server logs:
```text
[Express API] Server is running on http://0.0.0.0:3000
[Express API] Root endpoint: http://localhost:3000/
[Express API] Users endpoint: http://localhost:3000/users
```

---

## 4. Available Endpoints

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/` | Health check & server status confirmation | `200 OK` |
| `GET` | `/users` | Retrieve all users in memory | `200 OK` |
| `GET` | `/users/:id` | Retrieve single user by ID | `200 OK` / `404 Not Found` / `400 Bad Request` |
| `POST` | `/users` | Create a new user (`name`, `email`) | `201 Created` / `400 Bad Request` |

---

## 5. Example Requests and Responses

### 5.1 Root Endpoint
**Request:**
```http
GET / HTTP/1.1
Host: localhost:3000
```

**Response (`200 OK`):**
```json
{
  "status": "ok",
  "message": "DecodeLabs User Management API (Express.js) is running",
  "framework": "Express.js",
  "version": "1.0.0"
}
```

---

### 5.2 Retrieve All Users (Empty State)
**Request:**
```http
GET /users HTTP/1.1
Host: localhost:3000
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
Host: localhost:3000
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
Host: localhost:3000
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
Host: localhost:3000
```

**Response (`404 Not Found`):**
```json
{
  "error": "User not found"
}
```

---

### 5.6 Validation Failure (Missing Name or Empty)
**Request:**
```http
POST /users HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "email": "aisha@example.com"
}
```

**Response (`400 Bad Request`):**
```json
{
  "error": "Validation error: 'name' is required and must be a string."
}
```

---

### 5.7 Validation Failure (Invalid Email)
**Request:**
```http
POST /users HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "Aisha",
  "email": "invalid-email"
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
Host: localhost:3000
Content-Type: application/json

{ "name": "Aisha", broken_json }
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
npm test
```

### Expected Output
```text
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
# tests 10
# pass 10
# fail 0
```

---

## 7. Known Limitations

1. **In-Memory Volatility:** All user data is stored strictly in memory (`userStore.js`). Restarting or crashing the server completely resets the user store.
2. **Horizontal Scaling:** Because state is held in process memory, running multiple instances behind a load balancer will result in inconsistent state without an external data store (e.g., Redis, PostgreSQL).
3. **No Authentication or Authorization:** The API endpoints are unauthenticated and public per Week 1 scope boundaries.

