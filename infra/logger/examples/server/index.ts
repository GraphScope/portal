/**
 * Demo API Server
 *
 * This server demonstrates the Winston Multi-Channel Logger by:
 * 1. Providing API endpoints that generate different levels of logs
 * 2. Using the logger to output to console, file, and WebSocket simultaneously
 * 3. Using the integrated log server for streaming logs
 */

import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
import { createLoggerWithServer } from "../../src";

// Set up logger with integrated log server
const WS_PORT = Number(process.env.WS_PORT || 3001);
const logFilePath = path.join(__dirname, "../logs/app.log");

// Create both the logger and log server with one call
const { logger, logServer } = createLoggerWithServer(
  logFilePath,
  WS_PORT,
  true
);

// Create Express app
const app = express();
const server = http.createServer(app);

// Configure CORS for Express
app.use(cors());

// API endpoints
app.get("/", (req, res) => {
  logger.info("Home route accessed");
  res.json({ message: "Logger demo server is running!" });
});

app.get("/info", (req, res) => {
  const message = req.query.message || "Default info message";
  logger.info(`Info endpoint called: ${message}`, {
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  res.json({ status: "success", level: "info", message });
});

app.get("/warn", (req, res) => {
  const message = req.query.message || "Default warning message";
  logger.warn(`Warning endpoint called: ${message}`, {
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  res.json({ status: "success", level: "warn", message });
});

app.get("/error", (req, res) => {
  const message = req.query.message || "Default error message";
  logger.error(`Error endpoint called: ${message}`, {
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  res.json({ status: "success", level: "error", message });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`Server is running on http://127.0.0.1:${PORT}`);
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
