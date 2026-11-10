"""Flask REST API Routes for User Management."""

from flask import Blueprint, jsonify, request
from werkzeug.exceptions import BadRequest

from app.storage import user_store
from app.validation import validate_user_id, validate_user_payload

api_bp = Blueprint("api", __name__)


@api_bp.route("/", methods=["GET"])
def root_endpoint():
    """Root endpoint confirming API is running."""
    return jsonify({
        "status": "ok",
        "message": "DecodeLabs User Management API (Flask) is running",
        "framework": "Flask",
        "version": "1.0.0",
    }), 200


@api_bp.route("/users", methods=["GET"])
def get_all_users():
    """Retrieve all users in memory."""
    users = user_store.get_all()
    return jsonify(users), 200


@api_bp.route("/users/<raw_id>", methods=["GET"])
def get_user_by_id(raw_id: str):
    """Retrieve single user by ID."""
    is_valid, error_msg, user_id = validate_user_id(raw_id)
    if not is_valid:
        return jsonify({"error": error_msg}), 400

    user = user_store.get_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user), 200


@api_bp.route("/users", methods=["POST"])
def create_user():
    """Create a new user."""
    # Attempt to parse JSON; werkzeug raises BadRequest if malformed
    try:
        data = request.get_json(force=False, silent=False)
    except BadRequest:
        return jsonify({
            "error": "Malformed JSON: Request body contains invalid JSON syntax."
        }), 400

    if data is None:
        return jsonify({
            "error": "Validation error: Request body must be non-empty JSON."
        }), 400

    is_valid, error_msg, cleaned_data = validate_user_payload(data)
    if not is_valid:
        return jsonify({"error": error_msg}), 400

    created = user_store.create(
        name=cleaned_data["name"],
        email=cleaned_data["email"],
    )
    return jsonify(created), 201

