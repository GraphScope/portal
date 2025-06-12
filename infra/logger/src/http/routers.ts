import { Router } from 'express';
import { LogEntry, LoggerQueryParams } from '../types';
import { getSessionId, jwtAuthMiddleware } from './middlewares';
import { MemoryLoggerStorage } from './storage-memory';

const router: Router = Router();
const storage = new MemoryLoggerStorage();


/**
 * @openapi
 * /logs/health:
 *   get:
 *     summary: Health check endpoint
 *     tags:
 *       - Logs
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                 version:
 *                   type: string
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Apply JWT auth middleware to all routes
router.use(jwtAuthMiddleware);

/**
 * @openapi
 * /logs/log:
 *   post:
 *     summary: Ingest a log entry
 *     tags:
 *       - Logs
 *     parameters:
 *       - in: header
 *         name: x-container-id
 *         required: false
 *         schema:
 *           type: string
 *         description: Container ID for log session isolation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogEntry'
 *     responses:
 *       201:
 *         description: Log entry created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogEntry'
 *       400:
 *         description: Invalid log entry
 */
router.post('/log', async (req, res) => {
  const entry = req.body as LogEntry;
  if (!entry || !entry.level || !entry.message) {
    return res.status(400).json({ error: 'Invalid log entry' });
  }
  const sessionId = getSessionId(req);
  if (!sessionId) {
    return res.status(400).json({ error: 'Invalid or missing sessionId (userId or containerId missing)' });
  }
  entry.sessionId = sessionId;
  console.log('[HTTP Log Server] Ingesting log entry:', entry);
  await storage.write(entry);
  res.status(201).json(entry);
});

/**
 * @openapi
 * /logs/query:
 *   get:
 *     summary: Query logs with filters
 *     tags:
 *       - Logs
 *     parameters:
 *       - in: header
 *         name: x-container-id
 *         required: false
 *         schema:
 *           type: string
 *         description: Container ID for log session isolation
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *         description: Log level filter
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: Log source filter
 *       - in: query
 *         name: since
 *         schema:
 *           type: string
 *         description: Start time (ISO8601)
 *       - in: query
 *         name: until
 *         schema:
 *           type: string
 *         description: End time (ISO8601)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Max number of logs
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *         description: Session ID filter
 *     responses:
 *       200:
 *         description: List of log entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LogEntry'
 */
router.get('/query', async (req, res) => {
  const sessionId = getSessionId(req);
  if (!sessionId) {
    return res.status(400).json({ error: 'Invalid or missing sessionId (userId or containerId missing)' });
  }
  const params: LoggerQueryParams = {
    level: req.query.level as any,
    source: req.query.source as string,
    since: req.query.since as string,
    until: req.query.until as string,
    limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
    sessionId,
  };
  const logs = await storage.query(params);
  res.json(logs);
});

/**
 * @openapi
 * /logs/stream:
 *   get:
 *     summary: Stream logs as Server-Sent Events (SSE)
 *     tags:
 *       - Logs
 *     parameters:
 *       - in: header
 *         name: x-container-id
 *         required: false
 *         schema:
 *           type: string
 *         description: Container ID for log session isolation
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *         description: Log level filter
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: Log source filter
 *       - in: query
 *         name: since
 *         schema:
 *           type: string
 *         description: Start time (ISO8601)
 *       - in: query
 *         name: until
 *         schema:
 *           type: string
 *         description: End time (ISO8601)
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *         description: Session ID filter
 *     responses:
 *       200:
 *         description: SSE stream of log entries
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 */
router.get('/stream', async (req, res) => {
  const sessionId = getSessionId(req);
  if (!sessionId) {
    res.status(400).json({ error: 'Invalid or missing sessionId (userId or containerId missing)' });
    return;
  }
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const params: LoggerQueryParams = {
    level: req.query.level as any,
    source: req.query.source as string,
    since: req.query.since as string,
    until: req.query.until as string,
    sessionId,
  };

  let heartbeatCount = 0;
  const MAX_HEARTBEATS = 3;
  const HEARTBEAT_INTERVAL = 5000;

  const heartbeat = setInterval(() => {
    heartbeatCount++;
    if (heartbeatCount > MAX_HEARTBEATS) {
      clearInterval(heartbeat);
      res.end();
      return;
    }
    res.write(':heartbeat\n\n');
  }, HEARTBEAT_INTERVAL);

  try {
    if (storage.stream) {
      for await (const entry of storage.stream(params)) {
        heartbeatCount = 0;
        res.write(`data: ${JSON.stringify(entry)}\n\n`);
      }
    }
  } finally {
    clearInterval(heartbeat);
  }

  req.on('close', () => clearInterval(heartbeat));
});

/**
 * @openapi
 * /logs/clear:
 *   post:
 *     summary: Clear logs for current session
 *     tags:
 *       - Logs
 *     parameters:
 *       - in: header
 *         name: x-container-id
 *         required: false
 *         schema:
 *           type: string
 *         description: Container ID for log session isolation
 *     responses:
 *       200:
 *         description: Logs cleared for current session
 *       400:
 *         description: Invalid or missing sessionId
 *       501:
 *         description: Clear not implemented
 */
router.post('/clear', async (req, res) => {
  const sessionId = getSessionId(req);
  if (!sessionId) {
    return res.status(400).json({ error: 'Invalid or missing sessionId (userId or containerId missing)' });
  }
  if (typeof storage.clear === 'function') {
    await storage.clear(sessionId);
    res.status(200).end();
  } else {
    res.status(501).json({ error: 'Clear not implemented' });
  }
});

export { router as loggerRouter };
