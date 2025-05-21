# Winston Multi-Channel Logger

A Winston-based multi-channel logging tool that outputs logs simultaneously to:

1. **Standard Output (stdout)**: Console output
2. **Local File Storage**: File-based logs with rotation
3. **WebSocket Streaming**: Real-time log delivery to frontends

This tool preserves Winston's original API while extending it with WebSocket transport capabilities, enabling real-time log streaming to frontend applications or other subscribers.

## Installation

```bash
npm install @graphscope/logger
# or
yarn add @graphscope/logger
# or
pnpm add @graphscope/logger
```

## Basic Usage

```typescript
import { createMultiChannelLogger } from '@graphscope/logger';

// Create a default logger instance
const logger = createMultiChannelLogger();

// Log different levels
logger.info('This is an info log');
logger.warn('This is a warning log', { code: 'WARN001' });
logger.error('This is an error log', {
  error: new Error('Something went wrong'),
});
```

## Configuration Options

### Basic Configuration

You can pass all Winston-supported configuration options:

```typescript
import { createMultiChannelLogger } from '@graphscope/logger';
import { format, transports } from 'winston';

const logger = createMultiChannelLogger({
  level: 'debug',
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console(), new transports.File({ filename: '/tmp/logs/app.log' })],
});
```

### WebSocket Configuration

Add a WebSocket transport channel:

```typescript
import { createMultiChannelLogger } from '@graphscope/logger';

const logger = createMultiChannelLogger({
  socketIO: {
    url: 'http://localhost:3001', // Socket.IO URL (using http:// protocol)
    eventName: 'log', // Default event name
    level: 'info', // Log level for this transport
    reconnection: true, // Enable reconnection
    reconnectionAttempts: 10, // Max reconnection attempts
    reconnectionDelay: 2000, // Delay between attempts (ms)
  },
});
```

### Default Configuration Setup

A convenience function to configure all three outputs at once:

```typescript
import { createDefaultLogger } from '@graphscope/logger';

// Specify file path and WebSocket URL
const logger = createDefaultLogger('/tmp/logs/app.log', 'http://localhost:3001');

logger.info('This log will be output to console, file, and WebSocket');
```

## Integrated Log Server

The package includes an integrated log server that can be created and started directly:

```typescript
import { createLogServer } from '@graphscope/logger';

// Create and start a log server
const logServer = createLogServer({
  port: 3001,
  debug: true, // Enable debug output
});

// Use the log server's URL for your logger
const wsUrl = logServer.url; // http://127.0.0.1:3001
```

### All-in-One Logger Setup

For even simpler setup, create both a logger and log server at once:

```typescript
import { createLoggerWithServer } from '@graphscope/logger';

// Create both logger and server with one call
const { logger, logServer } = createLoggerWithServer(
  '/tmp/logs/app.log', // Log file path
  3001, // WebSocket server port
  false, // Debug mode (optional)
);

// Start using the logger
logger.info('Logging with integrated server');
```

## Architecture

The multi-channel logger uses a separated architecture to avoid circular connections:

1. **API Server**: Your application server that generates logs
2. **Log Socket Server**: Either a standalone server or the integrated log server
3. **Client Application**: Connects to the log socket server to display logs

```
Client Application <---- Socket.IO ----> Log Socket Server <---- Socket.IO ---- Logger
```

This separation ensures:

- No circular dependencies
- Better scalability
- Reduced load on application servers

## Demo Examples

The `examples` folder contains complete demonstration applications:

1. **Server Example**: An Express + Socket.IO server that generates logs at different levels
2. **Web Client Example**: A Vite + React frontend application that displays logs in real-time

### Running the Demos

```bash
# Enter examples directory
cd examples

# Install dependencies
pnpm setup

# Start both server and client
pnpm start

# Or test with curl
pnpm test:curl
```

See the [examples README](/examples/README.md) for more information.

## API Reference

### createMultiChannelLogger(options?)

Creates a multi-channel logger instance.

**Parameters**:

- `options`: Winston logger options, extended with `socketIO` property

**Returns**:

- Winston Logger instance with socket property

### createDefaultLogger(logFilePath?, socketUrl?)

Creates a multi-channel logger with default configuration.

**Parameters**:

- `logFilePath`: Log file path, defaults to '/tmp/logs/app.log'
- `socketUrl`: WebSocket server URL, if not provided WebSocket transport is disabled

**Returns**:

- Winston Logger instance with socket property

### SocketIOTransport

Custom Winston Transport for sending logs to a WebSocket server.

```typescript
import { SocketIOTransport } from '@graphscope/logger';
import { createLogger } from 'winston';

const logger = createLogger({
  transports: [
    new SocketIOTransport({
      url: 'http://localhost:3001',
      level: 'info',
    }),
  ],
});
```

## Socket.IO Client Reconnection

The Socket.IO transport automatically handles reconnection when connection is lost:

- Automatic reconnection with configurable attempts and delay
- Message queuing - logs are cached when connection is lost and sent once reconnected
- Graceful degradation - console and file outputs continue to work when WebSocket is unavailable

## License

MIT
