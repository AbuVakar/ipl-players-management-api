// Global error handler middleware
const errorHandler = (error, request, reply) => {
  // Log the error for debugging
  console.error('Error:', error);

  // Handle different types of errors
  if (error.validation) {
    return reply.code(400).send({
      error: 'Validation Error',
      message: error.message
    });
  }

  if (error.statusCode) {
    return reply.code(error.statusCode).send({
      error: error.name || 'Error',
      message: error.message
    });
  }

  // Handle MongoDB errors
  if (error.code === 11000) {
    return reply.code(409).send({
      error: 'Duplicate Error',
      message: 'A player with this information already exists'
    });
  }

  // Handle file upload errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return reply.code(400).send({
      error: 'File Upload Error',
      message: 'File size too large. Maximum size is 5MB'
    });
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return reply.code(400).send({
      error: 'File Upload Error',
      message: 'Unexpected file field'
    });
  }

  // Default error response
  return reply.code(500).send({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
};

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Not found error
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

// Bad request error
class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

// Unauthorized error
class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

// Forbidden error
class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

module.exports = {
  errorHandler,
  AppError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError
}; 