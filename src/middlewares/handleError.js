import {enumErrors} from "../errors/enumErrors.js";

export default (error, req, res, next) => {
  switch (error.code) {
    case enumErrors.ERROR_FROM_SERVER:
      req.logger.error(
        `The server has failed unexpectedly - ${error.toString()} - ${new Date().toLocaleString()}`
      );
      return res.status(500).send({
        status: 500,
        error: error.name || "Error unexpectedly from server",
        cause: "The system failed when trying execute a process",
        message: "We are working to fix this issue",
      });
    case enumErrors.INVALID_FILTER:
      return res.status(error.statusCode).send({
        status: error.statusCode,
        error: error.name,
        cause: error.cause,
        message: error.message,
      });
    case enumErrors.MISSING_VALUES:
      return res.status(error.statusCode).send({
        status: error.statusCode,
        error: error.name,
        cause: error.cause,
        message: error.message,
      });
    case enumErrors.UNEXPECTED_VALUE:
      return res.status(error.statusCode).send({
        status: error.statusCode,
        error: error.name,
        cause: error.cause,
        message: error.message,
      });
    case enumErrors.UNAUTHORIZED:
      req.logger.warning(
        `User unauthorized trying ${req.method} this ${req.url} url`
      );
      return res.status(error.statusCode).send({
        status: error.statusCode,
        error: error.name,
        cause: error.cause,
        message: error.message,
      });
    case enumErrors.NOT_FOUND:
      return res.status(error.statusCode).send({
        status: error.statusCode,
        error: error.name,
        cause: error.cause,
        message: error.message,
      });
    default:
      req.logger.fatal(
        `Error when trying ${req.method} this ${
          req.url
        } url - ${error.toString()} - ${new Date().toLocaleString()}`
      );
      return res.status(500).send({
        status: 500,
        error: "Undefined",
        message: "We are working to fix this issue",
      });
  }
};