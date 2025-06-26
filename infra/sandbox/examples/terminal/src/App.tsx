import { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { io, Socket } from "socket.io-client";
import "./App.less";

const SOCKET_URL = "http://localhost:3000"; // 根据实际后端端口调整

/**
 * App component for the remote container terminal demo.
 *
 * This component provides a POSIX-like terminal interface using xterm.js and Socket.IO.
 * - The terminal container is styled to mimic a standard terminal emulator (e.g., iTerm2, VSCode Terminal).
 * - The title bar includes macOS-style window controls and displays the current container ID.
 * - The xterm.js terminal is rendered in the main content area.
 * - Users can connect to a remote container by entering its ID and clicking Connect.
 * - xterm-addon-fit is used to automatically fit the terminal to its container.
 * - The terminal container is responsive and always takes up 50% of the viewport width and height.
 *
 * @returns {JSX.Element} The rendered terminal app.
 */
function App() {
  const xtermRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const hasEmittedInitialResize = useRef<boolean>(false);
  const [containerId, setContainerId] = useState("");
  const [connected, setConnected] = useState(false);

  /**
   * Sends the current terminal dimensions to the backend PTY.
   * This ensures that the PTY dimensions match the frontend terminal display.
   * 
   * @param socket - The Socket.IO socket instance
   * @param terminal - The xterm.js Terminal instance
   */
  const sendTerminalResize = (socket: Socket, terminal: Terminal) => {
    const cols = terminal.cols;
    const rows = terminal.rows;
    console.log(`Sending resize: ${cols}x${rows}`);
    socket.emit("resize", { cols, rows });
  };

  // 连接Socket并建立终端会话
  const connectTerminal = () => {
    if (!containerId) {
      alert("Please input containerId");
      return;
    }

    // Reset the resize emission flag for new connections
    hasEmittedInitialResize.current = false;

    // Initialize terminal
    if (!xtermRef.current) return;
    if (termRef.current) {
      termRef.current.dispose();
    }
    const term = new Terminal({
      fontSize: 14,
      cursorBlink: true,
      theme: { background: "#1e1e1e" }
    });
    // Initialize and load fit addon
    /**
     * FitAddon allows the xterm.js terminal to automatically fit its parent container.
     * This ensures the terminal always fills the available space, even after resizing.
     */
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddonRef.current = fitAddon;
    term.open(xtermRef.current);
    fitAddon.fit();
    termRef.current = term;

    // Initialize socket connection
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    const socket = io(SOCKET_URL);
    socketRef.current = socket;
    setConnected(true);

    // 连接后发起终端会话
    socket.on("connect", () => {
      socket.emit("start-terminal", { containerId });
    });

    // 监听终端会话建立成功后发送初始尺寸
    socket.on("terminal-ready", () => {
      // Send initial terminal dimensions after terminal session is established
      sendTerminalResize(socket, term);
      hasEmittedInitialResize.current = true;
    });

    // 输出到xterm
    socket.on("output", (data: string) => {
      termRef.current?.write(data);

      // Fallback: Send initial dimensions on first output if not sent yet
      // This ensures dimensions are synced even if terminal-ready event is missed
      if (!hasEmittedInitialResize.current) {
        sendTerminalResize(socket, term);
        hasEmittedInitialResize.current = true;
      }
    });
    // 输入转发
    termRef.current?.onData((data) => {
      socket.emit("input", data);
    });
    socket.on("disconnect", () => {
      setConnected(false);
      termRef.current?.writeln("\r\n[Disconnected]\r\n");
    });
  };

  // Fit terminal on window resize and sync dimensions with PTY
  useEffect(() => {
    const handleResize = () => {
      if (fitAddonRef.current && termRef.current && socketRef.current) {
        fitAddonRef.current.fit();

        // Sync the new dimensions with backend PTY after a short delay
        // The delay ensures the fit operation has completed
        setTimeout(() => {
          if (termRef.current && socketRef.current) {
            sendTerminalResize(socketRef.current, termRef.current);
          }
        }, 10);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      termRef.current?.dispose();
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Remote Container Terminal (xterm.js + Socket.IO)</h2>
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Enter containerId"
          value={containerId}
          onChange={(e) => setContainerId(e.target.value)}
          disabled={connected}
          style={{ width: 320, marginRight: 8 }}
        />
        <button onClick={connectTerminal} disabled={connected}>
          Connect Terminal
        </button>
      </div>
      <div
        className="posix-terminal-container"
      >
        <div className="posix-terminal-titlebar">
          <div className="posix-terminal-titlebar-buttons">
            <span className="posix-terminal-titlebar-btn posix-terminal-titlebar-btn-close" />
            <span className="posix-terminal-titlebar-btn posix-terminal-titlebar-btn-min" />
            <span className="posix-terminal-titlebar-btn posix-terminal-titlebar-btn-max" />
          </div>
          <div className="posix-terminal-titlebar-title">
            {containerId ? `Terminal - ${containerId}` : "Terminal"}
          </div>
        </div>
        <div className="posix-terminal-xterm-content" ref={xtermRef} />
      </div>
    </div>
  );
}

export default App;
