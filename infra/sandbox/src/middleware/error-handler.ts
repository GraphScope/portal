import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../types";
import logger from "../utils/logger";

// Custom error class for API errors
export class ApiError extends Error {
  code: string;
  statusCode: number;
  details?: Record<string, any>;

  constructor(
    code: string,
    message: string,
    statusCode: number = 500,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, ApiError);
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If the error is not an ApiError, convert it
  if (!(err instanceof ApiError)) {
    logger.error("Unexpected error:", { error: err.message, stack: err.stack });
    err = new ApiError("INTERNAL_SERVER_ERROR", err.message);
  } else {
    logger.error("API error:", {
      code: (err as ApiError).code,
      message: err.message,
      details: (err as ApiError).details,
    });
  }

  const apiError = err as ApiError;
  const errorResponse: ErrorResponse = {
    error: {
      code: apiError.code,
      message: apiError.message,
    },
  };

  if (apiError.details) {
    errorResponse.error.details = apiError.details;
  }

  res.status(apiError.statusCode || 500).json(errorResponse);
};

// Not found middleware
export const notFoundHandler = (req: Request, res: Response) => {
  const error = new ApiError(
    "RESOURCE_NOT_FOUND",
    `Resource not found: ${req.url}`,
    404
  );
  res.status(404).json({
    error: {
      code: error.code,
      message: error.message,
    },
  });
};
