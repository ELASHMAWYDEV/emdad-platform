const {
  errors
} = require("./");

class ApiError extends Error {
  constructor(errorCode, details) {
    const error = errors[errorCode];
    if (!error) {
      throw new Error("Unrecognized Error");
    }
    const {
      status,
      message
    } = error;
    super(message);
    this.errorCode = errorCode;
    this.statusCode = status;
    this.message = message;
    this.details = details;
  }
}

module.exports = ApiError;