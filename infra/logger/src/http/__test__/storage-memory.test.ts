import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryLoggerStorage } from '../storage-memory';
import { LogEntry } from '../types';

/**
 * Test suite for MemoryLoggerStorage, covering all public methods and edge cases.
 */
describe('MemoryLoggerStorage', () => {
  let storage: MemoryLoggerStorage;

  beforeEach(() => {
    storage = new MemoryLoggerStorage();
  });

  afterEach(async () => {
    await storage.close();
  });

  /**
   * Test the cursor parameter in both query and stream methods.
   * Ensures that logs are correctly filtered and streamed starting from the given cursor index.
   */
  describe('cursor functionality', () => {
    const sessionId = 'cursor-test-session';
    const entries: LogEntry[] = [
      {
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'Log 1',
        sessionId,
        source: 'test',
      },
      {
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'Log 2',
        sessionId,
        source: 'test',
      },
      {
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'Log 3',
        sessionId,
        source: 'test',
      },
    ];

    beforeEach(async () => {
      // Write test logs
      for (const entry of entries) {
        await storage.write(entry);
      }
    });

    /**
     * Should query logs with cursor parameter, returning only logs after the cursor.
     */
    it('should query logs with cursor parameter', async () => {
      // Query all logs first
      const allLogs = await storage.query({ sessionId });
      expect(allLogs).toHaveLength(3);

      // Query with cursor after first log
      const cursor = allLogs[0].index!;
      const remainingLogs = await storage.query({ sessionId, cursor });
      expect(remainingLogs).toHaveLength(2);
      expect(remainingLogs[0].message).toBe('Log 2');
      expect(remainingLogs[1].message).toBe('Log 3');
    });

    /**
     * Should stream logs with cursor parameter, yielding only logs after the cursor.
     */
    it('should stream logs with cursor parameter', async () => {
      // Get all logs first to get the cursor
      const allLogs = await storage.query({ sessionId });
      const cursor = allLogs[0].index!;

      // Start streaming from cursor
      const streamedLogs: LogEntry[] = [];
      const stream = storage.stream({ sessionId, cursor });
      
      // Collect logs from stream
      for await (const log of stream) {
        streamedLogs.push(log);
        if (streamedLogs.length === 2) break; // We expect 2 logs after cursor
      }

      expect(streamedLogs).toHaveLength(2);
      expect(streamedLogs[0].message).toBe('Log 2');
      expect(streamedLogs[1].message).toBe('Log 3');
    });

    /**
     * Should handle cursor with no matching logs, returning empty results.
     */
    it('should handle cursor with no matching logs', async () => {
      // Query with a cursor that's beyond all logs
      const allLogs = await storage.query({ sessionId });
      const highCursor = allLogs[allLogs.length - 1].index! + 100;

      // Test query
      const queryResult = await storage.query({ sessionId, cursor: highCursor });
      expect(queryResult).toHaveLength(0);

      // Test stream
      const streamedLogs: LogEntry[] = [];
      const stream = storage.stream({ sessionId, cursor: highCursor });
      
      // Try to collect logs for a short time
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 100));
      for await (const log of stream) {
        streamedLogs.push(log);
        if (streamedLogs.length > 0) break;
      }
      await timeoutPromise;

      expect(streamedLogs).toHaveLength(0);
    });
  });

  /**
   * Test the limit parameter in both query and stream methods.
   * Ensures that logs are correctly limited in number according to the limit parameter.
   */
  describe('limit parameter', () => {
    const sessionId = 'limit-test-session';
    const entries: LogEntry[] = [
      {
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'Log 1',
        sessionId,
        source: 'test',
      },
      {
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'Log 2',
        sessionId,
        source: 'test',
      },
      {
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'Log 3',
        sessionId,
        source: 'test',
      },
      {
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'Log 4',
        sessionId,
        source: 'test',
      },
    ];

    beforeEach(async () => {
      // Write test logs
      for (const entry of entries) {
        await storage.write(entry);
      }
    });

    /**
     * Should limit the number of logs returned by query to the specified limit.
     */
    it('should limit logs returned by query', async () => {
      const logs = await storage.query({ sessionId, limit: 2 });
      expect(logs).toHaveLength(2);
      // Should be the last two logs (slice from end)
      expect(logs[0].message).toBe('Log 3');
      expect(logs[1].message).toBe('Log 4');
    });

    /**
     * Should return all logs if limit exceeds available logs in query.
     */
    it('should return all logs if limit exceeds available logs in query', async () => {
      const logs = await storage.query({ sessionId, limit: 10 });
      expect(logs).toHaveLength(4);
    });

    /**
     * Should return no logs if limit is 0 in query (even if there are logs).
     */
    it('should return no logs if limit is 0 in query (with logs)', async () => {
      const logs = await storage.query({ sessionId, limit: 0 });
      expect(logs).toHaveLength(0);
    });

    /**
     * Should return no logs if limit is 0 in query (when there are no logs).
     */
    it('should return no logs if limit is 0 in query (no logs)', async () => {
      const emptyStorage = new MemoryLoggerStorage();
      const logs = await emptyStorage.query({ sessionId, limit: 0 });
      expect(logs).toHaveLength(0);
    });

    /**
     * Should limit the number of logs yielded by stream to the specified limit.
     */
    it('should limit logs yielded by stream', async () => {
      const streamedLogs: LogEntry[] = [];
      const stream = storage.stream({ sessionId, limit: 2 });
      for await (const log of stream) {
        streamedLogs.push(log);
        if (streamedLogs.length === 2) break;
      }
      expect(streamedLogs).toHaveLength(2);
      // Should be the first two logs after cursor (default cursor is 0, so index > 0)
      expect(streamedLogs[0].message).toBe('Log 1');
      expect(streamedLogs[1].message).toBe('Log 2');
    });

    /**
     * Should yield all logs if limit exceeds available logs in stream.
     */
    it('should yield all logs if limit exceeds available logs in stream', async () => {
      const streamedLogs: LogEntry[] = [];
      const stream = storage.stream({ sessionId, limit: 10 });
      for await (const log of stream) {
        streamedLogs.push(log);
        if (streamedLogs.length === 4) break;
      }
      expect(streamedLogs).toHaveLength(4);
    });

    /**
     * Should yield no logs if limit is 0 in stream (even if there are logs).
     */
    it('should yield no logs if limit is 0 in stream (with logs)', async () => {
      const streamedLogs: LogEntry[] = [];
      const stream = storage.stream({ sessionId, limit: 0 });
      for await (const log of stream) {
        streamedLogs.push(log);
      }
      expect(streamedLogs).toHaveLength(0);
    });

    /**
     * Should yield no logs if limit is 0 in stream (when there are no logs).
     */
    it('should yield no logs if limit is 0 in stream (no logs)', async () => {
      const emptyStorage = new MemoryLoggerStorage();
      const streamedLogs: LogEntry[] = [];
      const stream = emptyStorage.stream({ sessionId, limit: 0 });
      for await (const log of stream) {
        streamedLogs.push(log);
      }
      expect(streamedLogs).toHaveLength(0);
    });

    /**
     * Should combine cursor and limit in stream to yield correct logs.
     */
    it('should combine cursor and limit in stream', async () => {
      // Get all logs to find a cursor
      const allLogs = await storage.query({ sessionId });
      const cursor = allLogs[1].index!; // After Log 2
      const streamedLogs: LogEntry[] = [];
      const stream = storage.stream({ sessionId, cursor, limit: 1 });
      for await (const log of stream) {
        streamedLogs.push(log);
        if (streamedLogs.length === 1) break;
      }
      expect(streamedLogs).toHaveLength(1);
      expect(streamedLogs[0].message).toBe('Log 3');
    });
  });

  /**
   * Should write and query logs for different sessions, ensuring session isolation.
   */
  it('should isolate logs by session', async () => {
    const entry1: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Session 1 log',
      sessionId: 'session-1',
      source: 'test',
    };
    const entry2: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Session 2 log',
      sessionId: 'session-2',
      source: 'test',
    };
    await storage.write(entry1);
    await storage.write(entry2);
    const logs1 = await storage.query({ sessionId: 'session-1' });
    const logs2 = await storage.query({ sessionId: 'session-2' });
    expect(logs1).toHaveLength(1);
    expect(logs1[0].message).toBe('Session 1 log');
    expect(logs2).toHaveLength(1);
    expect(logs2[0].message).toBe('Session 2 log');
  });

  /**
   * Should enforce per-session memory cap and evict oldest logs.
   */
  it('should evict oldest logs when exceeding memory cap', async () => {
    const sessionId = 'evict-session';
    // Each log is about 1KB, so 6000 logs will exceed 5MB
    for (let i = 0; i < 6000; i++) {
      await storage.write({
        timestamp: new Date().toISOString(),
        level: 'info',
        message: `Log ${i}`,
        sessionId,
        source: 'test',
      });
    }
    const logs = await storage.query({ sessionId });
    // Should not exceed 6000, and should be less than or equal to the cap
    expect(logs.length).toBeLessThanOrEqual(6000);
    // The first log should not be 'Log 0' (evicted)
    expect(logs[0].message).not.toBe('Log 0');
  });

  /**
   * Should return an empty array when querying a non-existent session.
   */
  it('should return empty array for non-existent session', async () => {
    const logs = await storage.query({ sessionId: 'no-session' });
    expect(logs).toEqual([]);
  });

  /**
   * Should clear logs for a specific session.
   */
  it('should clear logs for a specific session', async () => {
    const sessionId = 'clear-session';
    await storage.write({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'To be cleared',
      sessionId,
      source: 'test',
    });
    await storage.clear(sessionId);
    const logs = await storage.query({ sessionId });
    expect(logs).toEqual([]);
  });

  /**
   * Should clear all sessions when no sessionId is provided.
   */
  it('should clear all sessions', async () => {
    await storage.write({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Session 1',
      sessionId: 's1',
      source: 'test',
    });
    await storage.write({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Session 2',
      sessionId: 's2',
      source: 'test',
    });
    await storage.clear();
    const logs1 = await storage.query({ sessionId: 's1' });
    const logs2 = await storage.query({ sessionId: 's2' });
    expect(logs1).toEqual([]);
    expect(logs2).toEqual([]);
  });

  /**
   * Should assign default sessionId if not provided.
   */
  it('should use default sessionId if not provided', async () => {
    await storage.write({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Default session',
      sessionId: undefined as any, // simulate missing sessionId
      source: 'test',
    });
    const logs = await storage.query({});
    expect(logs.length).toBe(1);
    expect(logs[0].message).toBe('Default session');
  });

  /**
   * Should filter logs by level, source, since, until, and limit.
   */
  it('should filter logs by level, source, since, until, and limit', async () => {
    const now = new Date();
    const logsData: LogEntry[] = [
      {
        timestamp: new Date(now.getTime() - 10000).toISOString(),
        level: 'info',
        message: 'Old info',
        sessionId: 'filter-session',
        source: 'src1',
      },
      {
        timestamp: new Date(now.getTime() - 5000).toISOString(),
        level: 'error',
        message: 'Recent error',
        sessionId: 'filter-session',
        source: 'src2',
      },
      {
        timestamp: now.toISOString(),
        level: 'info',
        message: 'Newest info',
        sessionId: 'filter-session',
        source: 'src1',
      },
    ];
    for (const entry of logsData) {
      await storage.write(entry);
    }
    // Filter by level
    let logs = await storage.query({ sessionId: 'filter-session', level: 'error' });
    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe('Recent error');
    // Filter by source
    logs = await storage.query({ sessionId: 'filter-session', source: 'src1' });
    expect(logs).toHaveLength(2);
    // Filter by since
    logs = await storage.query({ sessionId: 'filter-session', since: now.toISOString() });
    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe('Newest info');
    // Filter by until
    logs = await storage.query({ sessionId: 'filter-session', until: new Date(now.getTime() - 6000).toISOString() });
    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe('Old info');
    // Filter by limit
    logs = await storage.query({ sessionId: 'filter-session', limit: 2 });
    expect(logs).toHaveLength(2);
  });

  /**
   * Should not throw when closing an empty storage.
   */
  it('should not throw when closing empty storage', async () => {
    await expect(storage.close()).resolves.not.toThrow();
  });
}); 