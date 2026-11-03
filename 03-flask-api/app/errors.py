"""Error handling and response formatting for Flask."""

from flask import Blueprint, jsonify
from werkzeug.exceptions import BadRequest, HTTPException

errors_bp = Blueprint("errors", __name__)


def register_error_handlers(app) -> None:
    @app.errorhandler(BadRequest)
    def handle_bad_request(err):
        # Catch malformed JSON syntax
        description = getattr(err, "description", "Bad Request")
        if "Failed to decode JSON" in description or "JSON" in description:
            return jsonify({
                "error": "Malformed JSON: Request body contains invalid JSON syntax."
            }), 400
        return jsonify({"error": description}), 400

    @app.errorhandler(404)
    def handle_not_found(err):
        return jsonify({"error": "Resource not found."}), 404

    @app.errorhandler(405)
    def handle_method_not_allowed(err):
        return jsonify({"error": "Method not allowed for requested route."}), 405

    @app.errorhandler(Exception)
    def handle_generic_exception(err):
        if isinstance(err, HTTPException):
            return jsonify({"error": err.description}), err.code
        # Never leak stack trace in response
        return jsonify({"error": "Internal server error."}), 500
