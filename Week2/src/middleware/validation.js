const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Middleware to validate UUID route parameter :id
 */
function validateUserId(req, res, next) {
  const { id } = req.params;

  if (!id || !UUID_REGEX.test(id)) {
    return res.status(400).json({
      error: 'Invalid user ID format. Expected a valid UUID.'
    });
  }

  next();
}

/**
 * Middleware to validate POST /users request body
 */
function validateCreateUser(req, res, next) {
  const { email, age, is_active } = req.body || {};
  const errors = [];

  // Validate email
  if (email === undefined || email === null || typeof email !== 'string' || email.trim() === '') {
    errors.push('Email is required');
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push('Invalid email format');
  } else if (email.trim().length > 255) {
    errors.push('Email must not exceed 255 characters');
  }

  // Validate age
  if (age === undefined || age === null) {
    errors.push('Age is required');
  } else if (typeof age !== 'number' || !Number.isInteger(age)) {
    errors.push('Age must be an integer');
  } else if (age < 0) {
    errors.push('Age must be greater than or equal to 0');
  }

  // Validate is_active (optional on creation, defaults to true)
  if (is_active !== undefined && typeof is_active !== 'boolean') {
    errors.push('is_active must be a boolean');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: errors[0],
      details: errors
    });
  }

  // Sanitize email
  req.body.email = email.trim().toLowerCase();
  if (is_active === undefined) {
    req.body.is_active = true;
  }

  next();
}

/**
 * Middleware to validate PUT /users/:id request body
 */
function validateUpdateUser(req, res, next) {
  const { email, age, is_active } = req.body || {};
  const errors = [];

  // Check if at least one field is provided
  if (email === undefined && age === undefined && is_active === undefined) {
    return res.status(400).json({
      error: 'At least one field (email, age, is_active) must be provided for update'
    });
  }

  // Validate email if provided
  if (email !== undefined) {
    if (typeof email !== 'string' || email.trim() === '') {
      errors.push('Email must be a non-empty string');
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.push('Invalid email format');
    } else if (email.trim().length > 255) {
      errors.push('Email must not exceed 255 characters');
    } else {
      req.body.email = email.trim().toLowerCase();
    }
  }

  // Validate age if provided
  if (age !== undefined) {
    if (typeof age !== 'number' || !Number.isInteger(age)) {
      errors.push('Age must be an integer');
    } else if (age < 0) {
      errors.push('Age must be greater than or equal to 0');
    }
  }

  // Validate is_active if provided
  if (is_active !== undefined) {
    if (typeof is_active !== 'boolean') {
      errors.push('is_active must be a boolean');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: errors[0],
      details: errors
    });
  }

  next();
}

module.exports = {
  validateUserId,
  validateCreateUser,
  validateUpdateUser
};

