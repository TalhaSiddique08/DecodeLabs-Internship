"""FastAPI Application Main Entrypoint.

DecodeLabs Week 1 - REST API Fundamentals
"""

import os
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.models import RootResponse
from app.routers import users

app = FastAPI(
    title="DecodeLabs User Management API",
    description="Stateless REST API implementation using FastAPI, Pydantic, and in-memory storage.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Include Routers
app.include_router(users.router)


@app.get(
    "/",
    response_model=RootResponse,
    status_code=status.HTTP_200_OK,
    summary="Root confirmation endpoint",
    description="Confirms that the FastAPI service is running locally.",
)
def root_status() -> dict:
    return {
        "status": "ok",
        "message": "DecodeLabs User Management API (FastAPI) is running",
        "framework": "FastAPI",
        "version": "1.0.0",
    }


# Custom Exception Handlers for consistent API responses


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """Format Pydantic and JSON validation errors into a clean, consistent response."""
    errors = exc.errors()

    # Detect malformed JSON
    for err in errors:
        if err.get("type") == "json_invalid":
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "error": "Malformed JSON: Request body contains invalid JSON syntax.",
                    "details": err.get("msg"),
                },
            )

    # Build human-readable summary of validation errors
    messages = []
    for err in errors:
        loc = " -> ".join(str(item) for item in err.get("loc", []))
        msg = err.get("msg", "Invalid value")
        messages.append(f"{loc}: {msg}")

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({
            "error": f"Validation error: {'; '.join(messages)}",
            "details": errors,
        }),
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(
    request: Request, exc: StarletteHTTPException
) -> JSONResponse:
    """Handle standard HTTP exceptions with unified JSON error envelope."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail},
    )


@app.exception_handler(Exception)
async def generic_exception_handler(
    request: Request, exc: Exception
) -> JSONResponse:
    """Catch unhandled exceptions and return safe 500 without leaking stack traces."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "Internal server error."},
    )


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    print(f"[FastAPI] Starting server on http://{host}:{port}")
    uvicorn.run("app.main:app", host=host, port=port, reload=False)
