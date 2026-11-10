"""Flask Application Factory."""

from flask import Flask
from app.errors import register_error_handlers
from app.routes import api_bp


def create_app(test_config: dict = None) -> Flask:
    """Create and configure Flask application instance."""
    app = Flask(__name__)

    # Default configurations
    app.config.from_mapping(
        JSON_SORT_KEYS=False,
    )

    if test_config:
        app.config.update(test_config)

    # Register routes and error handlers
    app.register_blueprint(api_bp)
    register_error_handlers(app)

    return app

