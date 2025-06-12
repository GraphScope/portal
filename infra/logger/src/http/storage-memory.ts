import { LoggerStorage, LogEntry, LoggerQueryParams } from '../types';

const MAX_SESSION_BYTES = 5 * 1024 * 1024; // 5MB per session
const MAX_SESSION_LOGS = 1000; // Maximum number of logs per session

interface SessionLogState {
  logs: LogEntry[];
  totalBytes: number;
  nextIndex: number;
}

/**
 * MemoryLoggerStorage is an in-memory implementation of LoggerStorage.
 * It stores logs in memory, grouped by session, and enforces both a per-session memory cap
 * and a maximum number of logs per session.
 * Useful for development, testing, or ephemeral log storage.
 */
export class MemoryLoggerStorage implements LoggerStorage {
  private sessions: Map<string, SessionLogState> = new Map();

  /**
   * Get or create the log state for a session.
   * @param sessionId - The session identifier (defaults to '__default__')
   * @returns The session's log state object
   */
  private getSessionState(sessionId: string = '__default__'): SessionLogState {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, { logs: [], totalBytes: 0, nextIndex: 1 });
    }
    return this.sessions.get(sessionId)!;
  }

  /**
   * Write a log entry to the appropriate session, assigning a log index and enforcing memory limits.
   * Evicts oldest logs when either the total bytes or number of logs exceeds the limit.
   * @param entry - The log entry to store
   */
  async write(entry: LogEntry): Promise<void> {
    const sessionId = entry.sessionId || '__default__';
    const state = this.getSessionState(sessionId);
    // Assign index
    entry.index = state.nextIndex++;
    // Estimate log size (rough, for memory cap)
    const logStr = JSON.stringify(entry);
    const logBytes = Buffer.byteLength(logStr, 'utf8');
    state.logs.push(entry);
    state.totalBytes += logBytes;

    // Enforce limits (evict oldest logs)
    while ((state.totalBytes > MAX_SESSION_BYTES || state.logs.length > MAX_SESSION_LOGS) && state.logs.length > 0) {
      const removed = state.logs.shift();
      if (removed) {
        state.totalBytes -= Buffer.byteLength(JSON.stringify(removed), 'utf8');
      }
    }
  }

  /**
   * Query logs for a session, supporting filtering by level, source, time, and limit.
   * If limit is 0, returns an empty array.
   * @param params - Query parameters
   * @returns Array of matching log entries
   */
  async query(params: LoggerQueryParams): Promise<LogEntry[]> {
    const sessionId = params.sessionId || '__default__';
    const state = this.sessions.get(sessionId);
    if (!state) return [];
    
    // Check if cursor is out of bounds
    if (typeof params.cursor === 'number' && params.cursor >= state.nextIndex) {
      return [];
    }

    let filtered = state.logs;
    if (typeof params.cursor === 'number') {
      filtered = filtered.filter(entry => (entry.index ?? 0) > params.cursor!);
    }
    if (params.level) filtered = filtered.filter(entry => entry.level === params.level);
    if (params.source) filtered = filtered.filter(entry => entry.source === params.source);
    if (params.since) filtered = filtered.filter(entry => entry.timestamp >= (params.since ?? ''));
    if (params.until) filtered = filtered.filter(entry => entry.timestamp <= (params.until ?? ''));
    if (typeof params.limit === 'number') {
      if (params.limit === 0) return [];
      // Return the last N logs after all filters (most recent N)
      filtered = filtered.slice(-params.limit);
    }
    return filtered;
  }

  /**
   * Stream logs for a session as an async iterable, supporting cursor-based pagination.
   * This allows for resuming log streaming from a specific point, useful for implementing
   * continuous log streaming with reconnection support.
   * If limit is 0, yields no logs.
   * 
   * @param params - Query parameters including optional cursor for resuming from a specific log index
   * @yields Log entries matching the query parameters
   */
  async *stream(params: LoggerQueryParams = {}): AsyncIterable<LogEntry> {
    const sessionId = params.sessionId || '__default__';
    const state = this.sessions.get(sessionId);
    if (!state) return;

    // Check if cursor is out of bounds
    if (typeof params.cursor === 'number' && params.cursor >= state.nextIndex) {
      return;
    }

    // If limit is 0, yield nothing
    if (typeof params.limit === 'number' && params.limit === 0) {
      return;
    }

    let currentIndex = typeof params.cursor === 'number' ? params.cursor : 0;
    const logs = state.logs;

    while (true) {
      // Find the next batch of logs starting from currentIndex
      const nextBatch = logs.filter(entry => {
        if ((entry.index ?? 0) <= currentIndex) return false;
        if (params.level && entry.level !== params.level) return false;
        if (params.source && entry.source !== params.source) return false;
        if (params.since && entry.timestamp < params.since) return false;
        if (params.until && entry.timestamp > params.until) return false;
        return true;
      });

      // Yield each log entry in the batch
      for (const entry of nextBatch) {
        yield entry;
        currentIndex = (entry.index ?? 0) + 1;
      }

      // If we have a limit, stop after reaching it
      if (typeof params.limit === 'number' && nextBatch.length >= params.limit) {
        break;
      }

      // Wait a bit before checking for new logs
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Close the storage, clearing all sessions.
   */
  async close() {
    await this.clear();
  }

  /**
   * Clear logs for a specific session or all sessions if sessionId is not provided.
   * @param sessionId - Optional session identifier
   */
  async clear(sessionId?: string): Promise<void> {
    if (sessionId) {
      this.sessions.delete(sessionId);
    } else {
      this.sessions.clear();
    }
  }
}