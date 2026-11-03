/**
 * Centralized error handling middleware.
 */

/**
 * Handle 404 for unmatched routes.
 */
function notFoundHandler(req, res, _next) {
  res.status(404).json({
    error: `Route ${req.method} ${req.originalUrl} not found.`,
  });
}

/**
 * Global error handling middleware.
 * Intercepts JSON parse errors, custom errors, and unexpected server errors.
 */
function errorHandler(err, req, res, _next) {
  // Catch JSON parsing errors from express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: "Malformed JSON: Request body contains invalid JSON syntax.",
    });
  }

  // Catch payload too large or entity parse errors
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: "Malformed JSON: Failed to parse request payload.",
    });
  }

  // Generic internal server error (never leak internal stack trace)
  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode === 500 ? "Internal server error." : err.message;

  return res.status(statusCode).json({
    error: message,
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
