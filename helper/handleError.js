import { ErrorHandler } from "../middleware/errorHandler.js";
import { statusCode } from "./../config.js/statusCode.js";

export const handleError = (error, res, next) => {
  if (error instanceof ErrorHandler) {
    return next(error);
  }
  return next(
    new ErrorHandler(
      error.message || "An error occurred while processing your request.",
      statusCode.INTERNAL_SERVER_ERROR
    )
  );
};
