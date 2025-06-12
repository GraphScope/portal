import { createLogger } from './logger';
import { createWsLogServer } from './ws/server';
import { createHttpLogServer } from './http/server';
import { LogServiceConfig } from './types';

/**
 * Create a unified log service: logger + ws server + http server
 * @param config LogServiceConfig
 * @returns { logger, wsServer, httpServer }
 */
export function createLogService(config: LogServiceConfig) {
  // 1. 创建 logger（console/file 必须，ws/http 可选）
  const logger = createLogger({
    level: config.level,
    file: {
      filename: config.logFilePath,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    },
    console: {
      // 可自定义 format 或其他 ConsoleTransportOptions
    },
    ws: config.ws?.enabled && config.ws.port ? {
      enabled: true,
      url: `http://localhost:${config.ws.port}`,
      level: config.level
    } : undefined,
    http: config.http?.enabled && config.http.port ? {
      enabled: true,
      host: config.http.host || '127.0.0.1',
      port: config.http.port,
      path: config.http.path || '/logs/log',
      level: config.level,
      getContext: config.http.getContext
    } : undefined
  });

  // 2. 创建 WS server
  let wsServer;
  if (config.ws?.enabled) {
    wsServer = createWsLogServer({ port: config.ws.port });
  }

  // 3. 创建 HTTP server
  let httpServer;
  if (config.http?.enabled) {
    httpServer = createHttpLogServer({ port: config.http.port });
  }

  return {
    logger,
    wsServer,
    httpServer,
  };
} 
