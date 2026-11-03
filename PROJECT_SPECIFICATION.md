# DecodeLabs — Week 1 Project Specification

## Project Title
**REST API Fundamentals — Multi-Framework Implementation**

**Internship:** Backend Development  
**Organization:** DecodeLabs  
**Duration:** Week 1  
**Primary Objective:** Build and test a stateless REST API using Express.js, FastAPI, and Flask.

---

## 1. Project Objective

Develop the same User Management REST API using three backend frameworks:

1. Node.js with Express.js
2. Python with FastAPI
3. Python with Flask

Each implementation must demonstrate local server setup, RESTful routing, HTTP GET and POST methods, JSON request and response handling, input validation, error handling, and appropriate HTTP status codes.

All three implementations must follow the same API specification so their behavior can be compared consistently.

## 2. Project Structure

Create the following directory structure:

```text
DecodeLabs/
└── Week 1/
    ├── README.md
    ├── PROJECT_SPECIFICATION.md
    │
    ├── 01-express-api/
    │   ├── src/
    │   ├── package.json
    │   ├── .gitignore
    │   └── README.md
    │
    ├── 02-fastapi/
    │   ├── app/
    │   ├── requirements.txt
    │   ├── .gitignore
    │   └── README.md
    │
    └── 03-flask-api/
        ├── app/
        ├── requirements.txt
        ├── .gitignore
        └── README.md
```

The structure may be adjusted slightly to suit each framework's conventions.

## 3. Functional Requirements

### FR-01: Local Server

Create a backend server that runs locally and listens on a configurable port.

Each implementation must provide a root endpoint that confirms the API is running.

### FR-02: Retrieve All Users

**Endpoint:** `GET /users`

Return a JSON array containing all existing users.

- Return HTTP `200 OK` on success.
- Return an empty array if no users exist.

### FR-03: Retrieve a User by ID

**Endpoint:** `GET /users/{id}`

Retrieve a specific user using their ID.

- Return HTTP `200 OK` and the user object if found.
- Return HTTP `404 Not Found` if the user does not exist.
- Use the equivalent route syntax for each framework.

### FR-04: Create a User

**Endpoint:** `POST /users`

Accept a JSON request body containing:

- `name`: required, non-empty string.
- `email`: required, valid email address.

Example request:

```json
{
  "name": "Aisha",
  "email": "aisha@example.com"
}
```

On successful creation:

- Generate a unique user ID.
- Store the user in the in-memory collection.
- Return the created user as JSON.
- Return HTTP `201 Created`.

### FR-05: Input Validation

Reject requests containing:

- A missing name.
- An empty or whitespace-only name.
- A missing email.
- An invalid email format.
- Missing or malformed JSON, where applicable.

Return a meaningful JSON error response with an appropriate client-error status code.

Use FastAPI's Pydantic validation, Express.js validation middleware or equivalent logic, and explicit validation in Flask.

### FR-06: Error Handling

Handle expected errors consistently across all three APIs.

At minimum, cover:

- User not found.
- Invalid input.
- Malformed JSON.
- Unexpected server errors.

Return appropriate HTTP status codes and JSON error messages. Do not expose internal stack traces in production-style error responses.

### FR-07: Stateless Request Handling

Process every HTTP request using the information supplied in that request.

Do not depend on server-side user sessions or previous requests to determine how the current request should be processed.

### FR-08: JSON Responses

All API responses must use JSON where appropriate.

Use a consistent response structure across frameworks. For example:

Successful response:

```json
{
  "id": 1,
  "name": "Aisha",
  "email": "aisha@example.com"
}
```

Error response:

```json
{
  "error": "User not found"
}
```

The exact error structure may be adapted to framework conventions, but the behavior should remain consistent.

## 4. Technical Constraints

- Use in-memory storage only.
- Do not add a database, authentication, authorization, or frontend.
- Do not introduce unnecessary external integrations.
- Keep each framework's dependencies isolated.
- Use environment variables for configurable settings where appropriate.
- Do not commit virtual environments, `node_modules`, secrets, or generated cache files.
- Keep the three implementations functionally equivalent.

**Note:** In-memory user data will reset when the server restarts. Persistent storage is outside the scope of this project.

## 5. API Testing Requirements

Test every implementation using Postman, curl, or another HTTP client.

The following test cases are mandatory:

| Test | Expected result |
|---|---|
| Check the root endpoint | `200 OK` |
| Retrieve users when the collection is empty | `200 OK` with `[]` |
| Create a valid user | `201 Created` |
| Retrieve an existing user | `200 OK` |
| Retrieve a nonexistent user | `404 Not Found` |
| Create a user without a name | Client error |
| Create a user without an email | Client error |
| Create a user with an invalid email | Client error |
| Send malformed JSON | Client error |
| Create multiple users | Each receives a unique ID |

Record the actual status codes and responses during testing.

The same logical test cases must pass for Express.js, FastAPI, and Flask.

## 6. Documentation Requirements

Each framework folder must contain a README explaining:

- Framework and technology stack.
- Prerequisites and installation.
- How to start the local server.
- Available endpoints.
- Example requests and responses.
- Expected HTTP status codes.
- How to execute the tests.
- Known limitations.

The main Week 1 README must include:

- Project overview.
- Directory structure.
- Links or paths to all three implementations.
- A comparison of Express.js, FastAPI, and Flask.
- A summary of test results.
- Key technical learnings.

## 7. Framework Comparison

Compare all three implementations using the following dimensions:

- Ease of setup.
- Route definition and request handling.
- JSON serialization.
- Input validation.
- Error handling.
- API documentation support.
- Code organization.
- Development experience.

Base the comparison on the implementations we build and test rather than unsupported performance claims.

## 8. Deliverables

By the end of Week 1, prepare:

1. A working Express.js API.
2. A working FastAPI API.
3. A working Flask API.
4. Test cases and recorded results for all three.
5. Individual framework READMEs.
6. A main project README and framework comparison.
7. A clean, organized local Git repository.

Do not push the source code to a remote repository until DecodeLabs provides permission or submission instructions.

## 9. Definition of Done

The project is complete when:

- All three servers run locally.
- All required endpoints work.
- GET and POST operations behave consistently.
- Valid requests succeed and invalid requests are rejected.
- JSON responses and HTTP status codes are correct.
- All mandatory test cases have been executed.
- Documentation is complete.
- The repository contains no unnecessary generated files or secrets.

## 10. Scope Boundary

The original DecodeLabs Project 1 PDF explicitly emphasizes local servers, GET and POST routes, structured JSON, routing logic, and appropriate status codes.

The additional user lookup route, validation cases, documentation, and cross-framework comparison are our planned extensions to make the Week 1 work more complete and useful as a portfolio project.

Database integration, authentication, deployment, and frontend development are not required unless DecodeLabs provides additional instructions.
