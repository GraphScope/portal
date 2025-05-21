/**
 * Simplified Example with Integrated Log Server
 *
 * This example demonstrates how to use the integrated log server functionality.
 */

import express from "express";
import { createLoggerWithServer } from "../src";
import path from "path";

// Create both the logger and log server with one call
const { logger, logServer } = createLoggerWithServer(
  path.join(__dirname, "logs/simple-app.log"),
  3001,
  true // Debug mode enabled
);

// Create Express app
const app = express();

// Basic route with logging
app.get("/", (req, res) => {
  logger.info("Home route accessed", {
    ip: req.ip,
    method: req.method,
    path: req.path
  });
  res.send("Hello! Check the server console for logs.");
});

// API endpoint that generates different log levels
app.get("/log/:level", (req, res) => {
  const level = req.params.level;
  const message = req.query.message || `This is a ${level} message`;

  if (level === "error") {
    logger.error(`API ${level} log: ${message}`);
  } else if (level === "warn") {
    logger.warn(`API ${level} log: ${message}`);
  } else {
    logger.info(`API ${level} log: ${message}`);
  }

  res.json({ status: "success", level, message });
});

// Start server
const port = 3000;
app.listen(port, () => {
  logger.info(
    `Simple server with integrated log server is running on port ${port}`
  );
  logger.info(`Log server is running on ${logServer.url}`);
});
