const { Prisma } = require('@prisma/client');

/**
 * Centralized error handling middleware
 */
function errorHandler(err, req, res, next) {
  // If response has already started sending, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle JSON parse error (malformed JSON sent in request body)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Malformed JSON in request body'
    });
  }

  // Handle custom application errors
  if (err.isOperational && err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  // Handle Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      // Unique constraint failed (e.g. email already exists)
      case 'P2002': {
        const target = err.meta?.target;
        const field = Array.isArray(target) ? target.join(', ') : target || 'Email';
        return res.status(409).json({
          error: `${field === 'email' || field.includes('email') ? 'Email' : field} already exists`
        });
      }

      // Record not found
      case 'P2025':
        return res.status(404).json({
          error: 'User not found'
        });

      // Foreign key or relation violation
      case 'P2003':
        return res.status(400).json({
          error: 'Related record constraint violation'
        });

      default:
        console.error('Unhandled Prisma Error:', err.code, err.message);
        return res.status(500).json({
          error: 'Database operation failed'
        });
    }
  }

  // Handle Prisma Validation Errors (e.g., wrong types passed to Prisma client)
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      error: 'Invalid data format provided to database'
    });
  }

  // Handle PostgreSQL check constraint or other DB driver errors
  if (err.code === '23514') {
    return res.status(400).json({
      error: 'Database constraint violation: age must be greater than or equal to 0'
    });
  }

  // General server error fallback
  console.error('Unhandled Server Error:', err);
  return res.status(500).json({
    error: 'Internal Server Error'
  });
}

module.exports = errorHandler;

