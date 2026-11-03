/**
 * Request validation middlewares for User operations.
 */

// Standard email format validation regex (RFC 5322 compatible pattern)
const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

/**
 * Validates request body for POST /users.
 * Ensures:
 * - Request body is an object
 * - `name` is present, a string, and non-empty (not whitespace only)
 * - `email` is present, a string, and valid email format
 */
function validateUserCreation(req, res, next) {
  const { name, email } = req.body || {};

  // Check missing or non-string name
  if (name === undefined || name === null || typeof name !== 'string') {
    return res.status(400).json({
      error: "Validation error: 'name' is required and must be a string.",
    });
  }

  // Check whitespace-only name
  if (name.trim().length === 0) {
    return res.status(400).json({
      error: "Validation error: 'name' cannot be empty or whitespace-only.",
    });
  }

  // Check missing or non-string email
  if (email === undefined || email === null || typeof email !== 'string') {
    return res.status(400).json({
      error: "Validation error: 'email' is required and must be a string.",
    });
  }

  // Check empty email
  if (email.trim().length === 0) {
    return res.status(400).json({
      error: "Validation error: 'email' cannot be empty.",
    });
  }

  // Check valid email format
  if (!EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({
      error: "Validation error: 'email' must be a valid email address.",
    });
  }

  next();
}

/**
 * Validates path parameter :id for GET /users/:id.
 * Ensures the ID is a valid positive integer.
 */
function validateUserId(req, res, next) {
  const rawId = req.params.id;
  const parsedId = Number(rawId);

  if (!Number.isInteger(parsedId) || parsedId <= 0 || String(parsedId) !== rawId.trim()) {
    return res.status(400).json({
      error: "Invalid user ID: must be a positive integer.",
    });
  }

  req.userId = parsedId;
  next();
}

module.exports = {
  validateUserCreation,
  validateUserId,
};
