class HttpError extends Error {
  constructor(message, statusCode, err) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

const GlobalErrorHandler = (err, _, res, __) => {
  err.statusCode = err.statusCode || 500;
  err.success = false;
  err.message = err.message || "internal server error";

  if (err.name === "JsonWebTokenError") {
    err.statusCode = 401;
    err.success = false;
    err.message = err.message || "invalid token";
  }

  return res.status(err.statusCode).json({
    message: err.message,
    success: err.success,
    statusCode: err.statusCode,
    stack: err.stack,
  });
};

const AsyncErrorHandler = (func) => (req, res, next) => {
  Promise.resolve(func(req, res, next)).catch(next);
};

export { HttpError, GlobalErrorHandler, AsyncErrorHandler };
