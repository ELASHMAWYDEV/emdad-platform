const ApiError = require("./ApiError");
const { errorCodes } = require(".");

class CustomError extends ApiError {
  constructor(errorCode, message) {
    super(errorCodes.UNKOWN_ERROR);

    this.errorCode = errorCode;
    this.message = message;
  }
}

module.exports = CustomError;
