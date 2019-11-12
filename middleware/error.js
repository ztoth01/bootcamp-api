const ErrorResponse = require('../utils/errorResopnse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = error.message;
  // Log to console for DEV
  console.log(err.stack.red);
  console.log(err.name.red.bold);

  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server error'
  });
};

module.exports = errorHandler;
