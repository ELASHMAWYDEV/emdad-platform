import { errorCodes } from "./";
import ApiError from "./ApiError";

class AjvError extends ApiError {
  constructor(errors) {
    const details = errors.map(({ params, message }) => ({ key: params.missingProperty, message }));
    super(errorCodes.VALIDATION_ERROR, details);
  }
}

export default AjvError;
