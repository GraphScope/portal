import { WebSocketServer } from 'ws';
import http from 'http';

/**
 * Creates a logger server that pushes logs to connected clients via WebSocket
 * @param {Object} options - Configuration options
 * @param {number} options.port - Port to listen on
 * @param {number} options.pingInterval - Interval for ping in ms (default: 30000)
 * @param {number} options.pingTimeout - How long to wait for pong in ms (default: 10000)
 * @returns {Object} - Logger instance with Winston-compatible methods
 */
export function createLoggerServer(options = {}) {
  const port = options.port || 3002;
  const pingInterval = options.pingInterval || 30000; // 30 seconds
  const pingTimeout = options.pingTimeout || 10000; // 10 seconds

  // Create HTTP server
  const server = http.createServer();
  
  // Create WebSocket server with ping/pong settings for keepalive
  const wss = new WebSocketServer({ 
    server,
    // Increasing the timeout helps with nginx deployments which may have longer proxy timeouts
    clientTracking: true,
    // Don't auto-close connections on inactive periods
    perMessageDeflate: true
  });
  
  // Store clients connections with their filters
  const clients = new Map();
  
  // Store logs for potential reconnection (recent logs per containerId)
  const recentLogs = new Map();
  const MAX_STORED_LOGS = 100; // Per containerId
  
  // Store connection info for reconnection
  const connectionHistory = new Map();
  
  // Implementation for periodic ping to all clients
  const pingAllClients = () => {
    console.log(`[Heartbeat] Pinging ${clients.size} clients`);
    clients.forEach((client, id) => {
      // Check if connection is still open
      if (client.ws.readyState === client.ws.OPEN) {
        // Mark as not alive until pong is received
        client.isAlive = false;
        
        // Send ping frame to keep connection alive
        try {
          client.ws.ping();
          client.lastPing = Date.now();
        } catch (err) {
          console.error(`[Heartbeat] Error pinging client ${id}:`, err);
          terminateConnection(id);
        }
        
        // Schedule termination if no pong is received
        setTimeout(() => {
          const currentClient = clients.get(id);
          if (currentClient && !currentClient.isAlive) {
            console.log(`[Heartbeat] Client ${id} did not respond to ping, terminating`);
            terminateConnection(id);
          }
        }, pingTimeout);
      } else if (client.ws.readyState !== client.ws.CONNECTING) {
        // Not OPEN or CONNECTING, clean up
        terminateConnection(id);
      }
    });
  };
  
  // Function to terminate connections cleanly
  const terminateConnection = (id) => {
    const client = clients.get(id);
    if (client) {
      try {
        client.ws.terminate();
      } catch (err) {
        console.error(`Error terminating client ${id}:`, err);
      }
      clients.delete(id);
      console.log(`Client ${id} connection terminated`);
    }
  };
  
  // Start heartbeat interval
  const heartbeatTimer = setInterval(pingAllClients, pingInterval);
  
  // Store log for potential reconnection
  const storeRecentLog = (logEntry, containerId) => {
    if (!containerId) return;
    
    if (!recentLogs.has(containerId)) {
      recentLogs.set(containerId, []);
    }
    
    const logs = recentLogs.get(containerId);
    logs.push(logEntry);
    
    // Limit the number of stored logs
    if (logs.length > MAX_STORED_LOGS) {
      logs.shift(); // Remove oldest log
    }
  };
  
  // WebSocket connection handler
  wss.on('connection', (ws, req) => {
    console.log('Client connected');
    
    const connectionId = Date.now().toString();
    
    // Initialize client with isAlive flag
    ws.isAlive = true;
    clients.set(connectionId, { 
      ws, 
      filters: null,
      isAlive: true,
      lastActivity: Date.now(),
      lastPing: Date.now()
    });
    
    // Setup pong handler to confirm connection is alive
    ws.on('pong', () => {
      const client = clients.get(connectionId);
      if (client) {
        client.isAlive = true;
        client.lastActivity = Date.now();
        // console.log(`Received pong from client ${connectionId}`);
      }
    });
    
    // Handle messages from clients
    ws.on('message', message => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'subscribe') {
          // Client is subscribing to specific containerId
          const containerId = data.containerId;
          clients.set(connectionId, { 
            ws, 
            filters: { containerId },
            isAlive: true,
            lastActivity: Date.now(),
            lastPing: Date.now()
          });
          
          // Store connection info for reconnection support
          connectionHistory.set(containerId, {
            lastConnectionId: connectionId,
            lastActivity: Date.now()
          });
          
          console.log(`Client ${connectionId} subscribed to containerId: ${containerId}`);
          
          // Send any stored logs for this containerId
          if (recentLogs.has(containerId)) {
            const logs = recentLogs.get(containerId);
            console.log(`Sending ${logs.length} stored logs to reconnected client for containerId: ${containerId}`);
            
            // Send each stored log
            logs.forEach(logEntry => {
              ws.send(JSON.stringify({
                ...logEntry,
                isStoredLog: true
              }));
            });
          }
        } else if (data.type === 'ping') {
          // Client-initiated ping/pong for keepalive
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          
          // Update activity timestamp
          const client = clients.get(connectionId);
          if (client) {
            client.lastActivity = Date.now();
            client.isAlive = true;
          }
        } else if (data.type === 'reconnect') {
          // Handle client reconnection
          const containerId = data.containerId;
          const sessionId = data.sessionId;
          
          if (connectionHistory.has(containerId)) {
            console.log(`Client ${connectionId} attempting to reconnect for containerId: ${containerId}`);
            
            // Send stored logs for this containerId
            if (recentLogs.has(containerId)) {
              const logs = recentLogs.get(containerId);
              console.log(`Sending ${logs.length} stored logs to reconnected client`);
              
              // Send each stored log
              logs.forEach(logEntry => {
                ws.send(JSON.stringify({
                  ...logEntry,
                  isStoredLog: true
                }));
              });
            }
          }
        }
      } catch (error) {
        console.error('Error parsing client message:', error);
      }
    });
    
    // Handle client disconnect
    ws.on('close', () => {
      console.log(`Client ${connectionId} disconnected`);
      
      // Get client info before removing
      const client = clients.get(connectionId);
      if (client && client.filters && client.filters.containerId) {
        // Update connection history for potential reconnection
        connectionHistory.set(client.filters.containerId, {
          lastConnectionId: connectionId,
          lastActivity: Date.now(),
          wasDisconnected: true
        });
      }
      
      clients.delete(connectionId);
    });
    
    // Handle errors
    ws.on('error', (error) => {
      console.error(`WebSocket error for client ${connectionId}:`, error);
      // Terminate the connection on error
      terminateConnection(connectionId);
    });
  });

  // Close all connections when server shuts down
  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      clearInterval(heartbeatTimer);
      
      console.log('Closing all WebSocket connections...');
      wss.clients.forEach(client => {
        client.terminate();
      });
      
      server.close(() => {
        console.log('HTTP server closed');
      });
    });
  });
  
  // Start server
  server.listen(port, () => {
    console.log(`Logger WebSocket server is running on port ${port}`);
  });

  /**
   * Broadcasts log message to connected clients
   * @param {string} level - Log level (info, warn, error, etc.)
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  const broadcast = (level, message, meta = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta
    };
    
    // If this log has a containerId, store it for potential reconnection
    if (meta.containerId) {
      storeRecentLog(logEntry, meta.containerId);
    }
    
    // Send to appropriate clients based on filters
    clients.forEach((client, id) => {
      if (client.ws.readyState === client.ws.OPEN) {
        // If client has a filter for containerId, only send matching logs
        if (client.filters && client.filters.containerId) {
          // Only send if the log has a matching containerId or no containerId
          if (!meta.containerId || meta.containerId === client.filters.containerId) {
            try {
              client.ws.send(JSON.stringify(logEntry));
            } catch (error) {
              console.error(`Error sending log to client ${id}:`, error);
              // If sending fails, consider terminating the connection
              terminateConnection(id);
            }
          }
        } else {
          // No filter, send all logs
          try {
            client.ws.send(JSON.stringify(logEntry));
          } catch (error) {
            console.error(`Error sending log to client ${id}:`, error);
            terminateConnection(id);
          }
        }
      }
    });
  };

  // Create Winston-compatible logger interface
  const logger = {
    info: (message, meta = {}) => {
      console.log(`[INFO] ${message}`, meta);
      broadcast('info', message, meta);
      return logger;
    },
    warn: (message, meta = {}) => {
      console.warn(`[WARN] ${message}`, meta);
      broadcast('warn', message, meta);
      return logger;
    },
    error: (message, meta = {}) => {
      console.error(`[ERROR] ${message}`, meta);
      broadcast('error', message, meta);
      return logger;
    },
    debug: (message, meta = {}) => {
      console.debug(`[DEBUG] ${message}`, meta);
      broadcast('debug', message, meta);
      return logger;
    },
    // Add other Winston-compatible methods as needed
  };

  return logger;
}
