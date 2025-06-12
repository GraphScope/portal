import { Request, Response, NextFunction } from "express";
import { runWithContext } from "../utils/request-context";
import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Express middleware to extract context from the request.
 * - Extracts the Authorization header and verifies the JWT to get userId (from payload.id).
 * - Extracts x-container-id from header, params, body, or query.
 * - Passes { authorization, xContainerId, userId } to runWithContext.
 *
 * If the Authorization header is missing or invalid, userId will be undefined.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next
 */
export function contextMiddleware(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  // Get containerId from header first, then try params/body/query if they exist
  const xContainerId = req.headers["x-container-id"] as string || 
    (req.params?.containerId) || 
    (req.body?.containerId) || 
    (req.query?.containerId);

  let userId: string | undefined = undefined;
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.slice(7);
    const secret = process.env.TOKEN_SECRET?.replace(/\\n/g, "\n");
    if (secret) {
      try {
        const decoded = jwt.verify(token, secret) as JwtPayload | string;
        if (typeof decoded === "object" && decoded && "id" in decoded) {
          userId = (decoded as any).id;
        }
      } catch (err) {
        // Invalid token, userId remains undefined
      }
    }
  }

  runWithContext({ authorization, xContainerId, userId }, () => next());
} 