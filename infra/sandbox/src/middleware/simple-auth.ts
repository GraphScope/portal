import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

interface AuthenticatedRequest extends Request {
  isAuthenticated?: boolean;
}

/**
 * Simple API Key authentication middleware.
 * Supports multiple API keys via environment variables.
 */
export const simpleApiKeyAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      logger.warn("Missing authorization header", {
        ip: req.ip,
        path: req.path,
        method: req.method
      });

      return res.status(401).json({
        error: {
          code: "MISSING_AUTH",
          message:
            "Authorization header is required. Use: Authorization: Bearer <your-api-key>"
        }
      });
    }

    // Check format: Bearer <api-key>
    if (!authHeader.startsWith("Bearer ")) {
      logger.warn("Invalid authorization format", {
        ip: req.ip,
        path: req.path,
        authHeader: authHeader.substring(0, 20) + "..."
      });

      return res.status(401).json({
        error: {
          code: "INVALID_AUTH_FORMAT",
          message:
            "Authorization header must be in format: Bearer <your-api-key>"
        }
      });
    }

    const apiKey = authHeader.replace("Bearer ", "").trim();

    // Validate API Key
    if (!isValidApiKey(apiKey)) {
      logger.warn("Invalid API key attempt", {
        ip: req.ip,
        path: req.path,
        keyPrefix: apiKey.substring(0, 8) + "..."
      });

      return res.status(401).json({
        error: {
          code: "INVALID_API_KEY",
          message: "Invalid API key"
        }
      });
    }

    // Authentication successful
    req.isAuthenticated = true;
    logger.info("API key authentication successful", {
      ip: req.ip,
      path: req.path,
      method: req.method,
      keyPrefix: apiKey.substring(0, 8) + "..."
    });

    next();
  } catch (error) {
    logger.error("Authentication error", { error, ip: req.ip, path: req.path });

    return res.status(500).json({
      error: {
        code: "AUTH_ERROR",
        message: "Authentication service error"
      }
    });
  }
};

/**
 * Validate if the API Key is valid.
 * Supports multiple configuration methods:
 * 1. Environment variable SANDBOX_API_KEYS (comma separated)
 * 2. Environment variable SANDBOX_API_KEY (single key)
 */
function isValidApiKey(apiKey: string): boolean {
  if (!apiKey || apiKey.length < 8) {
    return false;
  }

  // Method 1: Multiple API keys, comma separated
  const apiKeys = process.env.SANDBOX_API_KEYS;
  if (apiKeys) {
    const validKeys = apiKeys.split(",").map((key) => key.trim());
    return validKeys.includes(apiKey);
  }

  // Method 2: Single API key
  const singleApiKey = process.env.SANDBOX_API_KEY;
  if (singleApiKey) {
    return apiKey === singleApiKey.trim();
  }

  // If no API key is configured, reject all requests
  logger.error(
    "No API keys configured. Please set SANDBOX_API_KEY or SANDBOX_API_KEYS environment variable"
  );
  return false;
}

/**
 * Health check and management endpoints can skip authentication.
 */
export const skipAuthPaths = ["/health"];

/**
 * Authentication middleware with path filtering.
 */
export const conditionalAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Skip authentication for health check and similar paths
  if (skipAuthPaths.some((path) => req.path.startsWith(path))) {
    return next();
  }

  // Require authentication for other paths
  return simpleApiKeyAuth(req, res, next);
};
