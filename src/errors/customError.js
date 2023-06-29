export default class CustomError {
    static create({name = "Error", message, cause, code = 1, statusCode = 500}) {
      let error = new Error(message);
      error.cause = cause;
      error.name = name;
      error.code = code;
      error.statusCode = statusCode;
      throw error;
    }
  }