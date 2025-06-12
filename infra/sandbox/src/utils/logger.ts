import path from 'path';
import { createLogService } from '@graphscope/logger';
import config from '../config';
import { dirname } from './paths';
import { getContext } from './request-context';

// 设置日志文件路径
const logFilePath = path.join(dirname, '../../logs/sandbox.log');

// 设置WebSocket和HTTP服务器端口
const WS_PORT = Number(process.env.WS_LOG_PORT || '3002');
const HTTP_PORT = Number(process.env.HTTP_LOG_PORT || '3003');

// 创建统一的日志服务
const { logger } = createLogService({
  level: config.logLevel || 'info',
  logFilePath,
  ws: {
    enabled: true,
    port: WS_PORT
  },
  http: {
    enabled: true,
    port: HTTP_PORT,
    host: '127.0.0.1',
    getContext,
  }
});

export default logger;
