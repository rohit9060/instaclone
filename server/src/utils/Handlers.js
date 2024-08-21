const GlobalErrorHandler = (err, _, res, __) => {
  err.statusCode = err.statusCode || 500;
  err.success = false;
  err.message = err.message || "Internal Server Error";
  return res.status(err.statusCode).json({
    message: err.message,
    success: err.success,
    statusCode: err.statusCode,
  });
};

const AsyncErrorHandler = (func) => (req, res, next) => {
  Promise.resolve(func(req, res, next)).catch(next);
};

export { GlobalErrorHandler, AsyncErrorHandler };
