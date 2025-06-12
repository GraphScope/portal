import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createLogger, type MultiChannelLogger } from '../../logger';
import { createHttpLogServer as createLogServer } from '../server';
import { LogEntry, LogLevel } from '../../types';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import { format } from 'winston';
import { EventSource } from 'eventsource';


const PORT = 31001;
const BASE_URL = `http://localhost:${PORT}/logs`;
const TRANSPORT_OPTION = {
  level: 'info',
  file: { filename: 'test-log.log' },
  http: {
    enabled: true,
    host: 'localhost',
    port: PORT,
    path: '/logs/log',
    format: format.combine(format.timestamp()),
  }
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Waits for the logger server to be ready by polling the /health endpoint.
 * Retries up to maxRetries times, waiting 100ms between attempts.
 * Throws an error if the server does not become ready in time.
 * @param baseUrl - The base URL of the server (e.g., http://localhost:31001)
 * @param maxRetries - Maximum number of retries (default: 5)
 */
async function waitForServerHealth(baseUrl: string, maxRetries = 5) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) {
        return;
      }
    } catch (error) {
      // ignore
    }
    retries++;
    if (retries === maxRetries) {
      throw new Error('Server failed to become ready after multiple attempts');
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

// Helper to generate a fake JWT for test user
/**
 * Generates a JWT token for testing purposes using RS256 algorithm
 * @param userId - The user ID to include in the token payload
 * @returns A signed JWT token string
 */
function generateTestJWT(userId: string): string {
  const tokenSecret = process.env.PRIVATE_KEY?.replace(/\\n/g, "\n");
  
  if (!tokenSecret) {
    throw new Error('TOKEN_SECRET environment variable is required for JWT generation');
  }

  return jwt.sign(
    { id: userId, name: 'test-user' },
    tokenSecret,
    { algorithm: 'RS256' }
  );
}

// Helper to generate a test sessionId, matching getSessionId logic
function getTestSessionId(userId: string, containerId?: string): string | undefined {
  if (!userId) return undefined;
  return containerId ? `${userId}:${containerId}` : userId;
}

const TEST_USER_ID = 'test-user-id';
const TEST_CONTAINER_ID = 'test-container-123';
const AUTH_HEADER = `Bearer ${generateTestJWT(TEST_USER_ID)}`;
const CONTAINER_HEADER = { 'x-container-id': TEST_CONTAINER_ID };
const AUTH_HEADERS = { ...CONTAINER_HEADER, 'Authorization': AUTH_HEADER };

// Helper for fetch with headers
async function fetchWithHeaders(url: string, options: Record<string, any> = {}) {
  options.headers = { ...AUTH_HEADERS, ...(options.headers || {}) };
  return fetch(url, options);
}

// Helper for fetch with custom user/container
async function fetchWithCustomHeaders(url: string, userId: string, containerId?: string, options: Record<string, any> = {}) {
  const headers = {
    ...(containerId ? { 'x-container-id': containerId } : {}),
    'Authorization': `Bearer ${generateTestJWT(userId)}`,
    ...(options.headers || {})
  };
  return fetch(url, { ...options, headers });
}

/**
 * Test suite for the Logger Module, including Logger and LogService.
 * Covers logging, querying, streaming, and session isolation.
 */
describe('Logger Module', () => {
  /**
   * Test cases for Logger, covering log levels, context, metadata, and session ID handling.
   */
  describe('Logger', () => {
    let logger: ReturnType<typeof createLogger>;

    beforeEach(() => {
      logger = createLogger(TRANSPORT_OPTION);
    });

    afterEach(() => {
      logger.close();
    });

    /**
     * Should create a logger with default options.
     */
    it('should create a logger with default options', () => {
      expect(logger).toBeDefined();
    });

    /**
     * Should log messages with different levels.
     */
    it('should log messages with different levels', () => {
      const levels: LogLevel[] = ['error', 'warn', 'info', 'debug', 'verbose', 'silly'];
      levels.forEach((level) => {
        const message = `Test ${level} message`;
        expect(() => (logger as any)[level](message)).not.toThrow();
      });
    });

    /**
     * Should include context and metadata in logs.
     */
    it('should include context and metadata in logs', () => {
      const context = { userId: '123', action: 'test' };
      const meta = { duration: 100, success: true };
      expect(() => {
        logger.info('Test message', context, meta);
      }).not.toThrow();
    });

    /**
     * Should use default session ID when not provided.
     */
    it('should use default session ID when not provided', () => {
      const logSpy = vi.spyOn(logger as any, 'info');
      logger.info('Test message');
      expect(logSpy).toHaveBeenCalledWith(
        'Test message',
      );
      logSpy.mockRestore();
    });

    /**
     * Should override default session ID when provided.
     */
    it('should override default session ID when provided', () => {
      const logSpy = vi.spyOn(logger as any, 'log');
      logger.info('Test message', { sessionId: 'custom-session' });
      expect(logSpy).toHaveBeenCalledWith(
        'info',
        'Test message',
        { sessionId: 'custom-session' },
      );
      logSpy.mockRestore();
    });
  });

  /**
   * Test cases for LogService, covering log ingestion, querying, streaming, clearing, and error handling.
   */
  describe('LogService', () => {
    let service: ReturnType<typeof createLogServer>;
    let logger: MultiChannelLogger;

    beforeEach(async () => {
      service = createLogServer({
        port: PORT,
        debug: true,
      });
      await waitForServerHealth(BASE_URL);

      // Create logger instance with HTTP transport enabled
      logger = createLogger({
        ...TRANSPORT_OPTION,
        http: {
          ...TRANSPORT_OPTION.http,
          getContext: () => ({
            xContainerId: TEST_CONTAINER_ID,
            authorization: AUTH_HEADER
          })
        }
      });
    });

    afterEach(async () => {
      await service.server?.close();
    });

    it('should ingest logs via POST /log with sessionId', async () => {
      logger.info('Test log entry', {  source: 'test' });
      await wait(1000);
      const response = await fetchWithHeaders(`${BASE_URL}/query`);
      const logs = await response.json() as any[];
      expect(logs).toHaveLength(1);
      expect(logs[0]).toMatchObject({
        level: 'info',
        message: 'Test log entry',
        sessionId: getTestSessionId(TEST_USER_ID, TEST_CONTAINER_ID),
        source: 'test',
      });
    });

    it('should return 200 if x-container-id header is missing', async () => {
      const response = await fetch(`${BASE_URL}/query`, { headers: { Authorization: AUTH_HEADER } });
      expect(response.status).toBe(200);
    });

    it('should return 401 if Authorization header is missing', async () => {
      const response = await fetch(`${BASE_URL}/query`, { headers: { 'x-container-id': TEST_CONTAINER_ID } });
      expect(response.status).toBe(401);
    });

    it('should isolate logs by sessionId (userId+containerId)', async () => {
      await(2000)
      // Create two loggers with different contexts
      const logger1 = createLogger({
        ...TRANSPORT_OPTION,
        http: {
          ...TRANSPORT_OPTION.http,
          getContext: () => ({
            xContainerId: TEST_CONTAINER_ID,
            authorization: AUTH_HEADER
          })
        }
      });

      const otherContainerId = 'other-container';
      const logger2 = createLogger({
        ...TRANSPORT_OPTION,
        http: {
          ...TRANSPORT_OPTION.http,
          getContext: () => ({
            xContainerId: otherContainerId,
            authorization: AUTH_HEADER
          })
        }
      });

      // Send logs using different loggers
      logger1.info('Session 1 log', { source: 'test' });
      await wait(2000);
      logger2.info('Other session log', { source: 'test' });

      // Query logs for session 1
      const resp1 = await fetch(`${BASE_URL}/query`, {
        headers: {
          'x-container-id': TEST_CONTAINER_ID,
          'Authorization': AUTH_HEADER
        }
      });
      const logs1 = await resp1.json() as any[];
      expect(logs1).toHaveLength(1);
      expect(logs1[0].sessionId).toBe(getTestSessionId(TEST_USER_ID, TEST_CONTAINER_ID));

      // Query logs for session 2
      const resp2 = await fetch(`${BASE_URL}/query`, {
        headers: {
          'x-container-id': otherContainerId,
          'Authorization': AUTH_HEADER
        }
      });
      const logs2 = await resp2.json() as any[];
      expect(logs2).toHaveLength(1);
      expect(logs2[0].sessionId).toBe(getTestSessionId(TEST_USER_ID, otherContainerId));
    });

    it('should clear logs only for current session', async () => {
      logger.info('Test log for clearing', { sessionId: getTestSessionId(TEST_USER_ID, TEST_CONTAINER_ID), source: 'test' });
      const clearResp = await fetchWithHeaders(`${BASE_URL}/clear`, { method: 'POST' });
      expect(clearResp.status).toBe(200);
      const queryResp = await fetchWithHeaders(`${BASE_URL}/query`);
      const logs = await queryResp.json() as any[];
      expect(logs).toHaveLength(0);
    });

    it('should not clear logs for other session', async () => {
      logger.info('Session 1 log', { sessionId: getTestSessionId(TEST_USER_ID, TEST_CONTAINER_ID), source: 'test' });
      await wait(2000);
      const otherUserId = 'other-user';
      const otherContainerId = 'other-container';
      const otherSessionId = getTestSessionId(otherUserId, otherContainerId);
      await fetchWithCustomHeaders(`${BASE_URL}/log`, otherUserId, otherContainerId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: 'info', message: 'Other session log', sessionId: otherSessionId, source: 'test' })
      });
      await fetchWithHeaders(`${BASE_URL}/clear`, { method: 'POST' });
      const resp2 = await fetchWithCustomHeaders(`${BASE_URL}/query`, otherUserId, otherContainerId);
      const logs2 = await resp2.json() as any[];
      expect(logs2).toHaveLength(1);
      expect(logs2[0].sessionId).toBe(getTestSessionId(otherUserId, otherContainerId));
    });

    it('should stream logs for correct session only', async () => {
      // First send the log
      logger.info('Stream test log', { sessionId: getTestSessionId(TEST_USER_ID, TEST_CONTAINER_ID), source: 'test' });
      await wait(1000); // Wait for log to be processed

      // Setup fetch request with stream
      const response = await fetch(`${BASE_URL}/stream`, {
        headers: AUTH_HEADERS
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body available');
      }

      const logPromise = new Promise((resolve, reject) => {
        if (!response.body) {
          reject(new Error('No response body available'));
          return;
        }

        response.body.on('data', (chunk: Buffer) => {
          // Convert Buffer to string and split by double newlines
          const text = chunk.toString();
          const events = text.split('\n\n').filter(Boolean);

          for (const event of events) {
            if (event.startsWith('data: ')) {
              const log = JSON.parse(event.slice(6));
              resolve(log);
              return;
            }
          }
        });

        response.body.on('error', (error) => {
          reject(error);
        });

        response.body.on('end', () => {
          // Stream ended without finding log
          reject(new Error('Stream ended without finding log'));
        });
      });

      // Add timeout to prevent test hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Test timeout')), 5000);
      });

      const receivedLog = await Promise.race([logPromise, timeoutPromise]);
      
      expect(receivedLog).toMatchObject({
        level: 'info',
        message: 'Stream test log',
        sessionId: getTestSessionId(TEST_USER_ID, TEST_CONTAINER_ID),
      });
    });
  });

  describe('Session Isolation', () => {
    let service: ReturnType<typeof createLogServer>;

    beforeEach(async () => {
      service = createLogServer({
        port: PORT,
        debug: false,
      });
      await waitForServerHealth(BASE_URL);
    });

    afterEach(async () => {
      await service.server?.close();
    });

    it('should maintain separate log streams for different sessions', async () => {
      const session1User = 'user1';
      const session1Container = 'container1';
      const session2User = 'user2';
      const session2Container = 'container2';
      // session1
      await fetchWithCustomHeaders(`${BASE_URL}/log`, session1User, session1Container, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: 'info', message: 'Session 1 log', sessionId: getTestSessionId(session1User, session1Container), source: 'test' })
      });
      // session2
      await fetchWithCustomHeaders(`${BASE_URL}/log`, session2User, session2Container, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: 'info', message: 'Session 2 log', sessionId: getTestSessionId(session2User, session2Container), source: 'test' })
      });
      // 查询 session1
      const resp1 = await fetchWithCustomHeaders(`${BASE_URL}/query`, session1User, session1Container);
      const logs1 = await resp1.json() as any[];
      expect(logs1).toHaveLength(1);
      expect(logs1[0].message).toBe('Session 1 log');
      // 查询 session2
      const resp2 = await fetchWithCustomHeaders(`${BASE_URL}/query`, session2User, session2Container);
      const logs2 = await resp2.json() as any[];
      expect(logs2).toHaveLength(1);
      expect(logs2[0].message).toBe('Session 2 log');
    });
  });
}); 