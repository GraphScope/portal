import Docker from "dockerode";
import { Request, Response } from "express";
import http, { RequestOptions, Agent as HttpAgent } from "http";
import logger from "../utils/logger";
import { ApiError } from "../middleware/error-handler";
import dockerConfig from "./docker-config";
import containerService from "./container-service";

class BrowserService {
  private docker: Docker;
  private agent: HttpAgent;

  constructor() {
    this.docker = dockerConfig.getDockerInstance();
    // keep‑alive agent for socket reuse
    this.agent = new http.Agent({ keepAlive: true, maxSockets: 100 });
    logger.info("BrowserService initialized");
  }

  /** Entry point for any /api/.../:containerId/mcp request */
  public async forwardRequest(
    containerId: string,
    req: Request,
    res: Response,
    targetPath: string
  ): Promise<void> {
    const requestId = Math.random().toString(36).slice(2, 10);
    const start = Date.now();
    logger.info(`[${requestId}] → ${req.method} ${req.originalUrl}`);

    // 30s global timeout fallback
    const TIMEOUT = 30_000;
    const to = setTimeout(() => {
      if (!res.headersSent) {
        logger.error(`[${requestId}] ✕ Timeout after ${TIMEOUT}ms`);
        res.status(504).json({
          error: { code: "REQUEST_TIMEOUT", message: `No response in ${TIMEOUT}ms` }
        });
      }
    }, TIMEOUT);

    try {
      // Ensure container exists and fetch its port
      await containerService.getContainer(containerId);
      const port = containerService.getBrowserPort(containerId);
      if (!port) throw new ApiError(
        "CONTAINER_PORT_NOT_FOUND",
        `No port for container ${containerId}`,
        502
      );

      if (targetPath !== "mcp") {
        clearTimeout(to);
        throw new ApiError("NOT_FOUND", `Unknown path: ${targetPath}`, 404);
      }

      logger.info(req.method);

      // Dispatch to POST or GET handler
      if (req.method === "GET") {
        await this.handleMcpGet(port, req, res, requestId, to, start);
      } else {
        await this.handleMcpPost(port, req, res, requestId, to, start);
      }
    } catch (err: any) {
      clearTimeout(to);
      logger.error(`[${requestId}] ✕`, err);
      if (!res.headersSent) {
        if (err instanceof ApiError) {
          res.status(err.statusCode).json({
            error: {
              code: err.code,
              message: err.message,
              ...(err.details && { details: err.details }),
            }
          });
        } else {
          res.status(502).json({
            error: { code: "PROXY_ERROR", message: err.message }
          });
        }
      }
    }
  }

  /** Handle HTTP GET → /mcp (open SSE stream for server‑initiated messages) */
  private handleMcpGet(
    port: number,
    req: Request,
    res: Response,
    requestId: string,
    to: NodeJS.Timeout,
    start: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Build headers, forwarding the client’s Mcp-Session-Id if present
      const headers: Record<string,string> = {
        Accept: "text/event-stream",
        Host: `127.0.0.1:${port}`,
      };
      if (req.headers["mcp-session-id"]) {
        headers["Mcp-Session-Id"] = String(req.headers["mcp-session-id"]);
      }

      const opts: RequestOptions = {
        host: "127.0.0.1",
        port,
        path: "/mcp",
        method: "GET",
        headers,
        agent: this.agent,
        timeout: 0,  // no socket timeout for SSE
      };

      const upstream = http.request(opts, upstreamRes => {
        clearTimeout(to);
        // Mirror status (should be 200 or 405)
        res.statusCode = upstreamRes.statusCode || 200;

        // Copy all non‑hop‑by‑hop headers (including new Mcp-Session-Id)
        for (const [k,v] of Object.entries(upstreamRes.headers)) {
          if (!["connection","keep-alive","transfer-encoding","upgrade"]
            .includes(k.toLowerCase())) {
            res.setHeader(k, v as string);
          }
        }

        // SSE handshake
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();

        // Pipe the stream
        upstreamRes.pipe(res);
        upstreamRes.on("end", () => {
          const took = Date.now() - start;
          logger.info(`[${requestId}] ← SSE closed after ${took}ms`);
          resolve();
        });
        upstreamRes.on("error", reject);
      });

      upstream.on("error", err => {
        clearTimeout(to);
        reject(err);
      });

      // Abort upstream if client disconnects
      req.on("aborted", () => upstream.abort());
      upstream.end();
    });
  }

  /** Handle HTTP POST → /mcp (JSON‑RPC requests, notifications, or DELETE to close session) */
  private handleMcpPost(
    port: number,
    req: Request,
    res: Response,
    requestId: string,
    to: NodeJS.Timeout,
    start: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Buffer the entire JSON‑RPC payload
      const bufs: Buffer[] = [];

        const bodyBuffer: Buffer = Buffer.from(JSON.stringify(req.body), 'utf-8');


        // Build headers with both JSON & SSE accepts
        const headers: Record<string, any> = {
          Accept: "application/json, text/event-stream",
          "Content-Type": "application/json",
          "Content-Length": bodyBuffer.length,
          Host: `127.0.0.1:${port}`,
        };
        if (req.headers["mcp-session-id"]) {
          headers["Mcp-Session-Id"] = String(req.headers["mcp-session-id"]);
        }

        const opts: RequestOptions = {
          host: "127.0.0.1",
          port,
          path: "/mcp",
          method: "POST",
          headers,
          agent: this.agent,
          timeout: 0,
        };

        logger.info(`[${requestId}] → POST ${opts.path} ${opts.port} ${bodyBuffer.length}`);

        const upstream = http.request(opts, upstreamRes => {
          clearTimeout(to);
          // Mirror status (200, 202, or error)
          res.statusCode = upstreamRes.statusCode || 200;

          logger.info(`[${requestId}] ← POST ${upstreamRes.statusCode} ${upstreamRes.statusMessage}`);

          // Copy all non‑hop‑by‑hop headers (session, retry‑ids, etc.)
          for (const [k,v] of Object.entries(upstreamRes.headers)) {
            if (!["connection","keep-alive","transfer-encoding","upgrade"]
              .includes(k.toLowerCase())) {
              res.setHeader(k, v as string);
            }
          }

          // 202 Accepted → no body expected
          if (upstreamRes.statusCode === 202) {
            res.end();
            return resolve();
          }

          const ct = upstreamRes.headers["content-type"] || "";
          if ((ct as string).includes("text/event-stream")) {
            // SSE response to a POST: stream JSON‑RPC responses + notifications
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");
            res.flushHeaders();
            upstreamRes.pipe(res);
            upstreamRes.on("end", () => {
              const took = Date.now() - start;
              logger.info(`[${requestId}] ← SSE POST closed after ${took}ms`);
              resolve();
            });
          } else {
            // Regular JSON response (single RPC result or batch)
            const respBufs: Buffer[] = [];
            upstreamRes.on("data", c => respBufs.push(c));
            upstreamRes.on("end", () => {
              const resp = Buffer.concat(respBufs);
              res.setHeader("Content-Type", "application/json");
              res.setHeader("Content-Length", resp.length);
              res.end(resp);
              const took = Date.now() - start;
              logger.info(`[${requestId}] ← JSON POST ${upstreamRes.statusCode} ${took}ms`);
              resolve();
            });
          }
        });

        upstream.on("error", err => {
          clearTimeout(to);
          reject(err);
        });

        // Send buffered body once
        upstream.setHeader('Content-Length', bodyBuffer.length);
        upstream.write(bodyBuffer);
        upstream.end();


      req.on("error", err => reject(err));
    });
  }
}

export default new BrowserService();
