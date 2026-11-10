"""Server startup script for Flask API."""

import os
from app import create_app

app = create_app()

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "false").lower() in ("true", "1", "yes")

    print(f"[Flask API] Server starting on http://{host}:{port}")
    print(f"[Flask API] Root endpoint: http://localhost:{port}/")
    print(f"[Flask API] Users endpoint: http://localhost:{port}/users")
    app.run(host=host, port=port, debug=debug)

