const { errorCodes } = require("./");
const ApiError = require("./ApiError");

class AjvError extends ApiError {
  constructor(errors) {
    const details = errors.map(({ params, message }) => ({
      key: params.missingProperty,
      message,
    }));
    super(errorCodes.VALIDATION_ERROR, details);
  }
}

module.exports = AjvError;
