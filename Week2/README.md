# DecodeLabs — Backend Development
## Project 2: Database Integration (CRUD)

A production-ready RESTful User Management API built with **Express.js**, **Prisma ORM**, and **Supabase PostgreSQL**. This project replaces temporary in-memory data structures with persistent relational database storage, enforcing strict data integrity, duplicate email prevention, input validation, and standard HTTP response semantics.

---

## 1. Technology Stack

- **Runtime:** Node.js (v20+)
- **Framework:** Express.js (v5)
- **ORM:** Prisma (v6)
- **Database:** PostgreSQL
- **Database Hosting:** Supabase
- **Cross-Origin Handling:** CORS
- **Configuration:** Dotenv

---

## 2. Architecture

The application adopts a modular, tiered architecture separating routing, input validation, business logic, ORM querying, and persistent database storage:

```text
Client (Postman / Frontend / cURL)
   │
   │  HTTP Request (JSON)
   ▼
Express.js REST API
   │
   ├── Middleware (CORS, JSON Body Parser)
   ├── Validation Middleware (UUID, Email, Age, Active State)
   ▼
User Controller (Business Logic & Error Delegation)
   │
   │  ORM Methods (create, findMany, findUnique, update, delete)
   ▼
Prisma ORM
   │
   │  SQL Queries (over connection pool / direct connection)
   ▼
Supabase PostgreSQL Database
   │
   ├── Table: users
   ├── Constraints: NOT NULL, UNIQUE (email), CHECK (age >= 0)
   ▼
Persistent User Data
```

---

## 3. Database Schema

The database schema is defined in [prisma/schema.prisma](file:///d:/Desktop/DecodeLabs/Week2%20-%20CRUD/prisma/schema.prisma) and maps to the `users` table in PostgreSQL.

### Table: `users`

| Field | Database Type | Prisma Type | Constraints & Defaults | Description |
|---|---|---|---|---|
| `id` | `UUID` | `String` | Primary Key, `gen_random_uuid()` | Unique record identity |
| `email` | `VARCHAR(255)` | `String` | `NOT NULL`, `UNIQUE` | Required user email |
| `age` | `INTEGER` | `Int` | `NOT NULL`, `CHECK (age >= 0)` | User age, non-negative |
| `is_active` | `BOOLEAN` | `Boolean` | `NOT NULL`, Default: `true` | Active/inactive state flag |
| `created_at` | `TIMESTAMPTZ` | `DateTime` | `NOT NULL`, Default: `now()` | Timestamp of record creation |

### Required Database Constraints

```text
email
 ├── NOT NULL
 └── UNIQUE (prevent duplicates)

age
 └── CHECK (age >= 0) (prevent negative numbers)
```

> **Data Integrity:** Both application-level validation and PostgreSQL database constraints enforce schema invariants. Even if an insert bypasses application validation, PostgreSQL will reject duplicates with a unique violation and reject invalid ages with a check constraint violation.

---

## 4. Project Structure

```text
Week2 - CRUD/
│
├── prisma/
│   ├── migrations/
│   │   ├── 20261110000000_init/
│   │   │   └── migration.sql       # Initial PostgreSQL DDL migration
│   │   └── migration_lock.toml
│   ├── init.sql                    # Standalone SQL script for Supabase SQL Editor
│   ├── schema.prisma               # Prisma models and database connection
│   └── seed.js                     # Sample user seed script
│
├── scripts/
│   └── setup-db.js                 # Verifies and applies DB CHECK constraints
│
├── src/
│   ├── config/
│   │   └── prisma.js               # Prisma Client singleton instance
│   ├── controllers/
│   │   └── userController.js       # CRUD controllers (create, read, update, delete)
│   ├── middleware/
│   │   ├── errorHandler.js         # Centralized error handler (400, 404, 409, 500)
│   │   └── validation.js           # Input validation (UUID, email, age, is_active)
│   ├── routes/
│   │   └── userRoutes.js           # /users router definitions
│   ├── utils/
│   │   └── appError.js             # Operational error class
│   ├── app.js                      # Express application setup
│   └── server.js                   # Server bootstrap & graceful shutdown
│
├── test/
│   ├── controller.test.js          # Controller unit tests (100% pass)
│   └── validation.test.js          # HTTP route validation tests (100% pass)
│
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules (.env, node_modules)
├── package.json                    # Project configuration and npm scripts
└── README.md                       # Complete documentation
```

---

## 5. Setup & Execution Instructions

Follow these steps to connect your fresh Supabase project and start the API.

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Retrieve your database connection string from your Supabase dashboard:
   - Navigate to: **Project Settings** > **Database** > **Connection string**.
   - Under the **Connection pooling** or **Connection string** section:
     > [!IMPORTANT]
     > **IPv6 vs IPv4:** Supabase's direct connection host (`db.[project-ref].supabase.co`) is **IPv6-only**. If your local network or ISP is IPv4-only, connecting to `db...` will fail with: `Can't reach database server at db.pksqlhfhhhvuwjrbosjp.supabase.co:5432`.
     >
     > **Fix:** Use the **Connection Pooler** URI, which supports IPv4:
     > - Select **Session** mode (Port 5432) or **Transaction** mode (Port 6543).
     > - Notice the username format: `postgres.[project-ref]` (e.g. `postgres.pksqlhfhhhvuwjrbosjp`).
     > - Notice the host format: `aws-0-[region].pooler.supabase.com`.
   - Copy the URI and replace `[YOUR-PASSWORD]` with your actual Supabase database password.
3. Paste the connection string into `.env`:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://postgres.pksqlhfhhhvuwjrbosjp:YOUR_PASSWORD@aws-0-YOUR-REGION.pooler.supabase.com:5432/postgres"
   ```
4. Verify your connection at any time by running:
   ```bash
   npm run db:check
   ```

### Step 3: Create Database Tables & Constraints in Supabase

You can initialize the database using either Prisma or the Supabase SQL Editor:

#### Option A: Using Prisma (Recommended)
Push the Prisma schema to create the `users` table and then run the constraint verification script:
```bash
# Push schema to Supabase PostgreSQL
npm run prisma:push

# Apply PostgreSQL CHECK (age >= 0) constraint
npm run db:setup
```

#### Option B: Using Supabase Web Dashboard SQL Editor
1. Open your Supabase Dashboard: `https://supabase.com/dashboard/project/pksqlhfhhhvuwjrbosjp/sql`
2. Open the **SQL Editor**.
3. Copy and run the contents of [prisma/init.sql](file:///d:/Desktop/DecodeLabs/Week2%20-%20CRUD/prisma/init.sql):
   ```sql
   CREATE EXTENSION IF NOT EXISTS "pgcrypto";

   CREATE TABLE IF NOT EXISTS users (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       email VARCHAR(255) NOT NULL UNIQUE,
       age INTEGER NOT NULL CHECK (age >= 0),
       is_active BOOLEAN NOT NULL DEFAULT true,
       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
   );

   CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
   ```

### Step 4 (Optional): Seed Sample Records

Populate the database with initial sample users:
```bash
npm run seed
```

### Step 5: Start the API Server

For development (with automatic restart on code changes via `nodemon`):
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will start at:
```text
http://localhost:3000
```

---

## 6. API Specification & Endpoints

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `POST` | `/users` | Create a new user | `201 Created`, `400 Bad Request`, `409 Conflict` |
| `GET` | `/users` | Retrieve all users | `200 OK` |
| `GET` | `/users/:id` | Retrieve specific user by ID | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `PUT` | `/users/:id` | Update an existing user | `200 OK`, `400 Bad Request`, `404 Not Found`, `409 Conflict` |
| `DELETE` | `/users/:id` | Delete a user by ID | `204 No Content`, `400 Bad Request`, `404 Not Found` |

---

### Endpoint Details & Examples

#### 1. Create User
- **Method:** `POST`
- **URL:** `http://localhost:3000/users`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "age": 24,
    "is_active": true
  }
  ```
- **Response: `201 Created`**
  ```json
  {
    "id": "e8188ea6-1f6b-4e12-8868-b80c5921867c",
    "email": "user@example.com",
    "age": 24,
    "is_active": true,
    "created_at": "2026-11-10T07:15:00.000Z"
  }
  ```

#### 2. Get All Users
- **Method:** `GET`
- **URL:** `http://localhost:3000/users`
- **Response: `200 OK`**
  ```json
  [
    {
      "id": "e8188ea6-1f6b-4e12-8868-b80c5921867c",
      "email": "user@example.com",
      "age": 24,
      "is_active": true,
      "created_at": "2026-11-10T07:15:00.000Z"
    }
  ]
  ```

#### 3. Get User by ID
- **Method:** `GET`
- **URL:** `http://localhost:3000/users/:id`
- **Example:** `http://localhost:3000/users/e8188ea6-1f6b-4e12-8868-b80c5921867c`
- **Response: `200 OK` (User Exists)**
  ```json
  {
    "id": "e8188ea6-1f6b-4e12-8868-b80c5921867c",
    "email": "user@example.com",
    "age": 24,
    "is_active": true,
    "created_at": "2026-11-10T07:15:00.000Z"
  }
  ```
- **Response: `404 Not Found` (User Does Not Exist)**
  ```json
  {
    "error": "User not found"
  }
  ```

#### 4. Update User
- **Method:** `PUT`
- **URL:** `http://localhost:3000/users/:id`
- **Example:** `http://localhost:3000/users/e8188ea6-1f6b-4e12-8868-b80c5921867c`
- **Headers:** `Content-Type: application/json`
- **Request Body (partial or full update):**
  ```json
  {
    "age": 25,
    "is_active": false
  }
  ```
- **Response: `200 OK`**
  ```json
  {
    "id": "e8188ea6-1f6b-4e12-8868-b80c5921867c",
    "email": "user@example.com",
    "age": 25,
    "is_active": false,
    "created_at": "2026-11-10T07:15:00.000Z"
  }
  ```
- **Response: `404 Not Found`**
  ```json
  {
    "error": "User not found"
  }
  ```

#### 5. Delete User
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/users/:id`
- **Example:** `http://localhost:3000/users/e8188ea6-1f6b-4e12-8868-b80c5921867c`
- **Response: `204 No Content`**
  - Empty body
- **Response: `404 Not Found`**
  ```json
  {
    "error": "User not found"
  }
  ```

---

## 7. Status Codes & Error Handling

Standardized HTTP status codes are returned for all conditions:

| Status Code | Reason | Example Response |
|---|---|---|
| `200 OK` | Successful retrieval or update | `{ "id": "...", ... }` |
| `201 Created` | Successful user creation | `{ "id": "...", ... }` |
| `204 No Content` | Successful deletion | (Empty body) |
| `400 Bad Request` | Missing field, invalid email format, negative age, non-UUID parameter | `{ "error": "Age must be greater than or equal to 0" }` |
| `404 Not Found` | Requested user ID does not exist | `{ "error": "User not found" }` |
| `409 Conflict` | Duplicate email constraint violation | `{ "error": "Email already exists" }` |
| `500 Internal Server Error` | Unexpected database or server fault | `{ "error": "Internal Server Error" }` |

---

## 8. Testing

The codebase includes automated unit and integration tests covering:
- Request validation for missing fields, invalid emails, negative ages, and invalid UUID formats.
- Controller CRUD handling, duplicate email prevention (409 Conflict), and missing record handling (404 Not Found).

Run the tests:
```bash
npm test
```

