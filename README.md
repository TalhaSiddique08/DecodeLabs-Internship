# DecodeLabs — Backend Development Internship

Welcome to the **DecodeLabs Backend Development Internship** repository. This repository contains the progressive weekly backend engineering projects, transitioning from fundamental REST API architectures to persistent cloud databases, ORM modeling, and production-grade software patterns.

---

## 📚 Repository Structure

```text
DecodeLabs-Internship/
│
├── Week1/                          # Week 1: REST API Fundamentals
│   ├── 01-express-api/             # Express.js REST API
│   ├── 02-fastapi/                 # FastAPI REST API (Python)
│   ├── 03-flask-api/               # Flask REST API (Python)
│   ├── tests/                      # Automated test suites
│   ├── PROJECT_SPECIFICATION.md    # Week 1 specifications
│   └── README.md                   # Week 1 full documentation
│
├── Week2/                          # Week 2: Database Integration (CRUD)
│   ├── prisma/                     # Prisma schema, migrations & seeders
│   ├── scripts/                    # Diagnostic & database constraint scripts
│   ├── src/                        # Express.js controllers, routes, middleware
│   ├── test/                       # Unit & integration test suites
│   ├── package.json                # Project dependencies and npm scripts
│   └── README.md                   # Week 2 full documentation
│
├── .gitignore                      # Root Git ignore configuration
└── README.md                       # Repository overview (this file)
```

---

## 🚀 Weekly Modules Overview

### [Week 1 — REST API Fundamentals](./Week1/README.md)
* **Focus:** RESTful architecture, HTTP status codes, request validation, and multi-framework parity.
* **Implementations:**
  1. **Node.js / Express.js:** Asynchronous handlers, custom middleware, modular routing.
  2. **Python / FastAPI:** Type-safe models with Pydantic, automatic OpenAPI documentation.
  3. **Python / Flask:** Lightweight blueprint routing and structured error handling.
* **Storage:** In-memory thread-safe user data store.
* 👉 [Read Week 1 Documentation](./Week1/README.md)

---

### [Week 2 — Database Integration (CRUD)](./Week2/README.md)
* **Focus:** Relational database integration, ORM schema design, data persistence, and database constraints.
* **Stack:** Node.js, Express.js (v5), Prisma ORM (v6), Supabase PostgreSQL.
* **Key Features:**
  - Full CRUD operations (`POST`, `GET`, `PUT`, `DELETE` on `/users`).
  - Database-enforced constraints: `UNIQUE (email)`, `CHECK (age >= 0)`, `NOT NULL`.
  - Duplicate email conflict handling (`409 Conflict`).
  - Strict input validation and UUID format verification (`400 Bad Request`).
  - Centralized error handling returning structured JSON.
  - Automated unit and integration test suite with 100% pass rate.
* 👉 [Read Week 2 Documentation](./Week2/README.md)

---

## 🛠️ Global Prerequisites

- **Node.js** (v20+ recommended) & **npm**
- **Python** (v3.10+ recommended) & **pip** (for Week 1 Python APIs)
- **Git**
- **Supabase** account for cloud PostgreSQL (for Week 2)

---

## 👨‍💻 Author

**Talha Siddique**  
- GitHub: [@TalhaSiddique08](https://github.com/TalhaSiddique08)  
- Repository: [DecodeLabs-Internship](https://github.com/TalhaSiddique08/DecodeLabs-Internship)
