# Winston Multi-Channel Logger Demos

This directory contains demonstration applications for the Winston Multi-Channel Logger package.

## Overview

These demos showcase a complete logging ecosystem with:

1. **API Server** (`server/index.ts`) - An Express server that uses the logger and can be tested with curl
2. **Log Socket Server** (`server/log-socket-server.ts`) - A dedicated Socket.IO server for log streaming
3. **React Web Client** (`client/`) - A Vite + React application that displays logs in real-time

The architecture demonstrates how the Multi-Channel Logger simultaneously:

- Outputs logs to the console (stdout)
- Stores logs in local files
- Streams logs in real-time via WebSocket

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌───────────────┐
│                 │   HTTP  │                  │  Logs   │               │
│  React Client   │◄────────┤  API Server      │◄────────┤  Logger       │
│  (Port 5173)    │         │  (Port 3000)     │         │               │
└────────┬────────┘         └──────────────────┘         └───────┬───────┘
         │                                                        │
         │                                                        │
         │                   ┌──────────────────┐                 │
         │    Socket.IO      │                  │    Socket.IO    │
         └───────────────────┤  Log Socket      │◄────────────────┘
                             │  Server (3001)   │
                             └──────────────────┘
                                      ▲
                                      │
                                      │
                      ┌───────────────┴─────────────┐
                      │                             │
                      │      Log File               │
                      │  (examples/logs/app.log)    │
                      └─────────────────────────────┘
```

## Directory Structure

```
examples/
├── client/                   # React web client
│   ├── src/
│   │   ├── App.tsx           # Main client application
│   │   └── App.css           # Styling for log display
│   └── package.json
│
├── server/                   # Server components
│   ├── index.ts              # API server (port 3000)
│   └── log-socket-server.ts  # Log WebSocket server (port 3001)
│
├── logs/                     # Log files directory
├── curl-test.sh              # Script for curl-based testing
├── run.sh                    # Script to start all components
└── package.json              # Scripts and dependencies
```

## Running the Demos

### Prerequisites

- Node.js 16+
- pnpm (recommended) or npm/yarn

### Setup

Install dependencies for both client and server:

```bash
cd examples
pnpm setup
```

### Starting the Demo Applications

Run all components (API server, log socket server, and client):

```bash
cd examples
pnpm start
```

Or run components separately:

- API server + log socket server: `pnpm start:server`
- Client only: `pnpm start:client`

### Testing with curl

Use the included shell script to test the server with curl:

```bash
cd examples
pnpm test:curl
```

Or make requests directly:

```bash
# Test the info endpoint
curl -X GET 'http://localhost:3000/info?message=This%20is%20a%20test%20message'

# Test the warning endpoint
curl -X GET 'http://localhost:3000/warn?message=Warning%20message%20test'

# Test the error endpoint
curl -X GET 'http://localhost:3000/error?message=Error%20message%20test'
```

## Log Client Features

The React client demonstrates several important features:

1. **Real-time log display**: Logs appear instantly as they're generated
2. **Dual connection handling**: Connects to both API and Log servers
3. **Log deduplication**: Prevents duplicate logs from appearing
4. **Log filtering by level**: Visual distinction between different log levels
5. **Log metadata display**: Shows timestamp and additional log context

## What to Expect

When running the demos:

1. The server will log messages to:

   - Your terminal (stdout) with colored output
   - A log file at `examples/logs/app.log`
   - Through Socket.IO to the log server which broadcasts to clients

2. The React client will:
   - Connect to both the API server and log server
   - Display connection status for both servers
   - Show logs in real-time with proper formatting
   - Allow you to send test log messages of different levels

## Troubleshooting

- **Client not receiving logs**: Check if both API server and log server are running
- **Connection issues**: Verify ports 3000 and 3001 are available
- **Socket.IO errors**: Make sure you're using Socket.IO URL with http:// protocol, not ws://
