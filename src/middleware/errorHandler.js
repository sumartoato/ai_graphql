const errorHandler = (err, req, res, _next) => {
  console.error('[ERROR]', err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // GraphQL errors tetap dikirim via Apollo, ini untuk REST fallback
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
