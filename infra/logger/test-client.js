// Simple test client to connect to the log server
const { io } = require("socket.io-client");

// Connect to the log server
const socket = io("http://localhost:3001");

console.log("Connecting to log server...");

// Handle connection events
socket.on("connect", () => {
  console.log("Connected to log server!");
});

// Handle incoming log messages
socket.on("log", (logEntry) => {
  console.log(`Received log: ${JSON.stringify(logEntry)}`);
});

// Handle errors
socket.on("connect_error", (error) => {
  console.error(`Connection error: ${error.message}`);
});

socket.on("disconnect", () => {
  console.log("Disconnected from log server");
});
