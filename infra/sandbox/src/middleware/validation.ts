import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import { ApiError } from "./error-handler";

// Validation chains for different API endpoints
export const createSandboxValidation = [
  body("image").isString().notEmpty().withMessage("Image name is required"),
  body("options.timeout")
    .optional()
    .isInt({ min: 1000, max: 3000000 })
    .withMessage("Timeout must be between 1000 and 3000000 ms"),
  body("options.memoryLimit")
    .optional()
    .isString()
    .matches(/^\d+[kmg]?$/)
    .withMessage("Invalid memory limit format (e.g., 512m)"),
  body("options.cpuLimit")
    .optional()
    .isString()
    .matches(/^0*(?:\.\d+|[1-9]\d*(?:\.\d+)?)$/)
    .withMessage("Invalid CPU limit format (e.g., 0.5, 1)")
];

export const execCodeValidation = [
  body("containerId")
    .isString()
    .notEmpty()
    .withMessage("Container ID is required"),
  body("command").isArray().notEmpty().withMessage("Command array is required"),
  body("command.*")
    .isString()
    .notEmpty()
    .withMessage("Command array elements must be non-empty strings"),
  body("files").optional().isObject().withMessage("Files must be an object")
];

export const updateFilesValidation = [
  body("containerId")
    .isString()
    .notEmpty()
    .withMessage("Container ID is required and cannot be empty"),
  body("files").isObject().withMessage("Files must be an object"),
  body("gitTracking")
    .optional()
    .isBoolean()
    .withMessage("Git tracking flag must be a boolean")
];

export const containerIdValidation = [
  param("containerId")
    .isString()
    .notEmpty()
    .withMessage("Container ID is required")
];

// Claude CLI 验证规则
export const createClaudeSessionValidation = [
  body("containerId")
    .isString()
    .notEmpty()
    .withMessage("Container ID is required"),
  body("prompt").isString().notEmpty().withMessage("Prompt is required"),
  body("outputFormat")
    .optional()
    .isIn(["text", "json", "stream-json"])
    .withMessage("Output format must be text, json, or stream-json"),
  body("taskId")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("Task ID must be a non-empty string if provided")
];

export const resumeClaudeSessionValidation = [
  body("containerId")
    .isString()
    .notEmpty()
    .withMessage("Container ID is required"),
  body("sessionId").isString().notEmpty().withMessage("Session ID is required"),
  body("prompt").optional().isString().withMessage("Prompt must be a string"),
  body("outputFormat")
    .optional()
    .isIn(["text", "json", "stream-json"])
    .withMessage("Output format must be text, json, or stream-json")
];

export const continueClaudeSessionValidation = [
  body("containerId")
    .isString()
    .notEmpty()
    .withMessage("Container ID is required"),
  body("prompt").optional().isString().withMessage("Prompt must be a string"),
  body("outputFormat")
    .optional()
    .isIn(["text", "json", "stream-json"])
    .withMessage("Output format must be text, json, or stream-json")
];

// Real-time validation has been removed

// Middleware to handle validation errors
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    throw new ApiError("VALIDATION_ERROR", "Request validation failed", 400, {
      errors: errorMessages
    });
  }

  next();
};
