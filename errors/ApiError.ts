import { errors } from "./";

class ApiError extends Error {
  errorCode: string;
  statusCode: number;
  message: string;
  details: { key: string; message: string }[] | undefined;

  constructor(errorCode, details: { key: string; message: string }[] | undefined = undefined) {
    const error = errors[errorCode];
    if (!error) {
      throw new Error("Unrecognized Error");
    }
    const { status, message } = error;
    super(message);
    this.errorCode = errorCode;
    this.statusCode = status;
    this.message = message;
    this.details = details;
  }
}

export default ApiError;
