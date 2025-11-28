// backend/middleware/errorHandler.js

/**
 * Custom Error class for operational errors.
 * These are errors that we can anticipate and handle gracefully.
 */
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // Mark as operational error
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Global error handling middleware.
 * Catches all errors passed to next(err) and sends an appropriate response.
 */
const errorHandler = (err, req, res, next) => {
    // Default to 500 Internal Server Error
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log the error for debugging purposes
    console.error('🚨 Global Error Handler:', err.stack);

    // Send error response
    if (err.isOperational) {
        // Operational errors (e.g., invalid input, not found)
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        // Programming or unknown errors (don't leak details in production)
        if (process.env.NODE_ENV === 'production') {
            res.status(500).json({
                status: 'error',
                message: 'Something went very wrong!'
            });
        } else {
            // In development, send more details
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
                error: err,
                stack: err.stack
            });
        }
    }
};

module.exports = { AppError, errorHandler };
