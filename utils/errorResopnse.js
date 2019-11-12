class ErrorResponse extends Error {
  constructor(message, stautsCode) {
    super(message);
    this.statusCode = stautsCode;
  }
}

module.exports = ErrorResponse;
