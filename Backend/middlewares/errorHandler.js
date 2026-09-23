const errorHandler = (err, req, res, next) => {
  // Log server errors for internal monitoring
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err.name, err.message);
  }

  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Internal Server Error';

  // Handle JSON parse errors from body-parser
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON payload in request body.';
  }

  // Handle CORS origin rejection
  if (err.message && err.message.includes('CORS policy')) {
    statusCode = 403;
    message = 'Access forbidden by CORS policy.';
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${field}. Please use another value.`;
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with invalid identifier format for '${err.path || 'id'}'.`;
  }

  // Multer Error
  if (err.name === 'MulterError') {
    statusCode = 400;
    message = `File upload error: ${err.message}`;
  }

  // JSON Web Token Error
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token error: ' + err.message;
  }

  // In production, mask internal server error details to prevent reconnaissance
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction && statusCode === 500) {
    message = 'An unexpected internal server error occurred. Please contact support if the issue persists.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: isProduction ? { code: 'SERVER_ERROR' } : { stack: err.stack, details: err.message }
  });
};

module.exports = errorHandler;
