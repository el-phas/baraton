export const errorHandler = (err, req, res, next) => {
  // Default to 500, but allow overrides
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log error details
  console.error(`[Error] ${status} - ${message}`, {
    path: req.path,
    method: req.method,
    error: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  });
  
  res.status(status).json({
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
