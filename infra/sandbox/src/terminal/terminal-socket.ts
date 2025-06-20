import { Server, Socket } from "socket.io";
import containerService from "../services/container-service";
import Docker from "dockerode";
import logger from "../utils/logger";

/**
 * Register terminal socket events for remote container terminal access.
 * @param io Socket.IO server instance
 */
export function registerTerminalSocket(io: Server) {
  // Map: socketId -> { containerId, exec, stream }
  const sessions = new Map<
    string,
    { containerId: string; exec: Docker.Exec; stream: NodeJS.ReadableStream }
  >();

  io.on("connection", (socket: Socket) => {
    socket.on(
      "start-terminal",
      async ({ containerId }: { containerId: string }) => {
        logger.info(`start-terminal: ${containerId}`);
        try {
          const container = containerService
            .getDockerInstance()
            .getContainer(containerId);
          // 创建exec实例
          const exec = await container.exec({
            Cmd: ["bash"],
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true
          });
          exec.start({ hijack: true, stdin: true }, (err, stream) => {
            if (err || !stream) {
              socket.emit(
                "output",
                `Failed to start terminal: ${err?.message || "unknown error"}\r\n`
              );
              return;
            }
            sessions.set(socket.id, { containerId, exec, stream });
            // 数据转发
            stream.on("data", (data: Buffer) => {
              /* 混合流前8bytes是stdout或stderr的标记，我们直接丢弃 */
              socket.emit("output", data.toString("utf-8", 8));
            });
            stream.on("error", (e) => {
              socket.emit("output", `Terminal error: ${e.message}\r\n`);
            });
            stream.on("end", () => {
              socket.emit("output", "[Terminal session ended]\r\n");
            });
            // 处理输入
            socket.on("input", (data: string) => {
              stream.write(data);
            });
            // 处理resize（可选，部分容器镜像支持）
            socket.on(
              "resize",
              async ({ cols, rows }: { cols: number; rows: number }) => {
                try {
                  await exec.resize({ h: rows, w: cols });
                } catch {}
              }
            );
            // 断开清理
            socket.on("disconnect", () => {
              try {
                stream.end();
              } catch {}
              sessions.delete(socket.id);
            });
          });
        } catch (e: any) {
          socket.emit("output", `Terminal error: ${e.message}\r\n`);
        }
      }
    );
  });
}
