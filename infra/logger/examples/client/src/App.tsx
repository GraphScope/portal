import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  [key: string]: any;
}

function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [message, setMessage] = useState<string>("");
  const [connected, setConnected] = useState<{ logs: boolean }>({
    logs: false
  });

  const serverUrl = "http://127.0.0.1:3000"; // 只用于API请求
  const logsServerUrl = "http://127.0.0.1:3001"; // Socket.IO日志服务器连接

  useEffect(() => {
    // 只连接到日志服务器
    const logsSocket = io(logsServerUrl);

    // 日志服务器连接状态
    logsSocket.on("connect", () => {
      console.log("Connected to logs server");
      setConnected({ logs: true });
    });

    logsSocket.on("disconnect", () => {
      console.log("Disconnected from logs server");
      setConnected({ logs: false });
    });

    // 用于防止重复日志的辅助函数
    const addUniqueLog = (newLog: LogEntry) => {
      setLogs((prevLogs) => {
        // 检查是否已经有相同的日志
        const isDuplicate = prevLogs.some(
          (log) =>
            log.timestamp === newLog.timestamp &&
            log.level === newLog.level &&
            log.message === newLog.message
        );

        if (isDuplicate) {
          return prevLogs;
        }

        return [newLog, ...prevLogs].slice(0, 100); // Keep last 100 logs
      });
    };

    // 从日志服务器监听日志事件（由 Winston 的 Socket.IO transport 发出）
    logsSocket.on("log", (logEntry: LogEntry) => {
      console.log("收到日志:", logEntry);
      addUniqueLog(logEntry);
    });

    return () => {
      logsSocket.disconnect();
    };
  }, []);

  const sendRequest = async (endpoint: string) => {
    try {
      const url = `${serverUrl}/${endpoint}${message ? `?message=${encodeURIComponent(message)}` : ""}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(`Response from ${endpoint}:`, data);
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "#ff5050";
      case "warn":
        return "#ffcc00";
      case "info":
        return "#33ccff";
      default:
        return "#ffffff";
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Logger Demo Client</h1>
        <div className="connection-status">
          <div className="status-container">
            <span
              className={`status-indicator ${connected.logs ? "connected" : "disconnected"}`}
            ></span>
            <span>
              Logs Server: {connected.logs ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </header>

      <div className="controls">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter a message"
          className="message-input"
        />
        <div className="buttons">
          <button onClick={() => sendRequest("info")} className="info-button">
            Send INFO Log
          </button>
          <button onClick={() => sendRequest("warn")} className="warn-button">
            Send WARN Log
          </button>
          <button onClick={() => sendRequest("error")} className="error-button">
            Send ERROR Log
          </button>
        </div>
      </div>

      <div className="logs-container">
        <h2>Server Logs</h2>
        {logs.length === 0 ? (
          <div className="no-logs">
            No logs received yet. Try sending a request!
          </div>
        ) : (
          <div className="logs-list">
            {logs.map((log, index) => (
              <div
                key={index}
                className="log-entry"
                style={{ borderLeft: `4px solid ${getLevelColor(log.level)}` }}
              >
                <div className="log-header">
                  <span className="log-timestamp">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                  <span
                    className="log-level"
                    style={{ color: getLevelColor(log.level) }}
                  >
                    {log.level.toUpperCase()}
                  </span>
                </div>
                <div className="log-message">{log.message}</div>
                <div className="log-details">
                  {Object.entries(log)
                    .filter(
                      ([key]) =>
                        !["level", "message", "timestamp"].includes(key)
                    )
                    .map(([key, value]) => (
                      <div key={key} className="log-detail-item">
                        <span className="log-detail-key">{key}:</span>
                        <span className="log-detail-value">
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
