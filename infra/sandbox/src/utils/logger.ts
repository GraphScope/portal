import path from 'path';
import { createLoggerWithServer } from '@graphscope/logger';
import config from '../config';
import { dirname } from './paths';

// 设置日志文件路径
const logFilePath = path.join(dirname, '../../logs/sandbox.log');

// 设置WebSocket服务器端口，用于实时日志流
const WS_PORT = Number(process.env.WS_LOG_PORT || '3002');

// 使用createLoggerWithServer创建logger和集成的日志服务器
// 参数1: 日志文件路径
// 参数2: WebSocket服务器端口
// 参数3: 是否启用调试模式（非生产环境下启用）
const { logger, logServer } = createLoggerWithServer(logFilePath, WS_PORT, config.nodeEnv !== 'production');

// 设置日志级别，从配置中获取
logger.level = config.logLevel;

// 添加默认元数据
logger.defaultMeta = { service: '@graphscope' };

export default logger;
