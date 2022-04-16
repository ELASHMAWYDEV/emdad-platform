const {
  errorCodes
} = require("./");
const ApiError = require("./ApiError");

class AjvError extends ApiError {
  constructor(errors) {
    console.log(errors)

    const details = errors.map(({
      params,
      message
    }) => ({
      key: params.missingProperty || params.additionalProperty,
      message,
    }));
    super(errorCodes.VALIDATION_ERROR, details);
  }
}

module.exports = AjvError;