/**
 * Global error handling middleware for Express.
 *
 * This receives any Error passed through `next(err)` and returns a consistent
 * JSON response. It avoids changing runtime behavior — only adds comments.
 *
 * Signature: (err, req, res, next)
 */
module.exports = (err, req, res, next) => {
    // Ensure the error has a statusCode (default to 500) and a status string.
    // Many application errors (e.g. AppError) will already set these.
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    // Send the normalized JSON response. Fields:
    //  - status: high-level category (e.g. 'error' or 'fail')
    //  - error: full error object (useful in development; avoid exposing sensitive fields in production)
    //  - message: human-readable message suitable for clients
    //  - stack: stack trace (only useful for debugging; should be hidden in production)
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};