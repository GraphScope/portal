import express from 'express';
import { createLoggerServer } from './logger.js';

// Create Express server
const app = express();
const PORT = 3000;

// Create Logger server
const logger = createLoggerServer({ port: 3002 });

// Serve static files
app.use(express.static('public'));

// API endpoint
app.get('/api', (req, res) => {
  // Accept both containerId and contaierId (in case of typo in the URLs)
  const containerId = req.query.containerId || req.query.contaierId;

  logger.info('hello world');
  logger.info(`hello ${containerId}`, { containerId });
  logger.error(`xxx`, { containerId, ip: 'xxx' });
  logger.error(`aaa`, { containerId, ip: 'aaa' });

  res.json({
    status: 'success',
    message: `API request processed for container: ${containerId}`,
  });
});

// Start Express server
app.listen(PORT, () => {
  console.log(`HTTP API server running on port ${PORT}`);
  logger.info(`HTTP API server started on port ${PORT}`);
});
