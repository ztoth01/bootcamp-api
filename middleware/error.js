const ErrorResponse = require('../utils/errorResopnse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;
  // Log to console for DEV
  console.log(err.stack.red);

  // Moongose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  // Moongose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate key value entered';
    error = new ErrorResponse(message, 400);
  }

  // Moongose ValidatorError
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server error'
  });
};

module.exports = errorHandler;
