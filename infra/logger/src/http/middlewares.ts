import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * 用户 JWT Payload 类型定义
 */
export interface UserPayload extends JwtPayload {
  name: string;
  id: string;
}

/**
 * JWT 认证中间件，解析 Authorization header 并将用户信息挂载到 req.user
 * @param req Express request
 * @param res Express response
 * @param next Express next
 */
export function jwtAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = authHeader.slice(7); // Remove 'Bearer '
  const secret = process.env.TOKEN_SECRET?.replace(/\\n/g, "\n");
  if (!secret) {
    return res.status(500).json({ error: 'Server misconfiguration: TOKEN_SECRET not set' });
  }
  jwt.verify(token, secret, (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    (req as any).user = decoded as UserPayload;
    next();
  });
}

/**
 * 从 req.user.id 和可选的 req.containerId 生成 sessionId
 * 如果有 containerId 则返回 userId:containerId 格式
 * 否则仅返回 userId
 * @param req Express request
 * @returns sessionId 或 undefined
 */
export function getSessionId(req: Request): string | undefined {
  const userId = (req as any).user?.id;
  if (!userId) {
    return undefined;
  }
  const containerId = req.headers['x-container-id'];
  return containerId ? `${userId}:${containerId}` : userId;
}