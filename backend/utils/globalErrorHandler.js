const globalErrorHandler = (err, req, res, next) => {
  console.error("🔥 Global Error Handler:", {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    status: err.status,
    rawError: err // Catch full error object from libraries like Razorpay
  });

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = globalErrorHandler;