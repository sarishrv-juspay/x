// Middleware for routes that are not found
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass error to the next error handling middleware
};

// General error handler middleware
// This should be the last piece of middleware added
const errorHandler = (err, req, res, next) => {
  // Sometimes an error might come in with a good status code,
  // but we want to default to 500 if it's an unhandled server error.
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    // Optionally, include stack trace in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
