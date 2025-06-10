import { Request, Response } from "express";
import http, { RequestOptions, Agent as HttpAgent } from "http";
import logger from "../utils/logger";
import { ApiError } from "../middleware/error-handler";
import containerService from "./container-service";

// Browser action types matching the Python API
export interface BrowserActionRequest {
  // Navigation actions
  url?: string;
  query?: string;
  
  // Element interaction
  index?: number;
  text?: string;
  x?: number;
  y?: number;
  
  // Tab management
  page_id?: number;
  
  // Scroll actions
  amount?: number;
  
  // Other actions
  keys?: string;
  seconds?: number;
  goal?: string;
  option_text?: string;
}

export interface BrowserActionResult {
  success: boolean;
  message: string;
  error?: string;
  url?: string;
  title?: string;
  elements?: string;
  screenshot_base64?: string;
  pixels_above?: number;
  pixels_below?: number;
  content?: string;
  element_count?: number;
  interactive_elements?: Array<{
    index: number;
    tag_name: string;
    text: string;
    is_in_viewport: boolean;
    [key: string]: any;
  }>;
  viewport_width?: number;
  viewport_height?: number;
}

class BrowserService {
  private agent: HttpAgent;

  constructor() {
    // Keep-alive agent for socket reuse
    this.agent = new http.Agent({ keepAlive: true, maxSockets: 100 });
    logger.info("BrowserService initialized");
  }

  /**
   * Forward a browser request from Express to the container's browser service
   */
  public async forwardRequest(
    containerId: string,
    req: Request,
    res: Response,
    targetPath: string
  ): Promise<void> {
    try {
      // Use the targetPath as the action name directly
      const action = targetPath;
      
      // Pass the request body and method to the browser service
      const data = req.body || {};
      const method = req.method;

      logger.info('Forwarding browser request', {
        containerId,
        action,
        method: method,
        hasBody: Object.keys(data).length > 0
      });

      // Make the request to the browser service
      const result = await this.makeBrowserRequest(containerId, action, data, method);
      
      // Return the result
      res.status(200).json(result);

    } catch (error) {
      logger.error('Browser request forwarding failed:', error);
      
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          error: {
            code: error.code,
            message: error.message,
            ...(error.details && { details: error.details })
          }
        });
      } else {
        res.status(500).json({
          error: {
            code: 'BROWSER_FORWARD_ERROR',
            message: error instanceof Error ? error.message : String(error)
          }
        });
      }
    }
  }

/**
   * Make a browser action request to the container
   */
private async makeBrowserRequest(
    containerId: string,
    action: string,
    data?: BrowserActionRequest,
    method: string = 'POST'
  ): Promise<BrowserActionResult> {
    const requestId = Math.random().toString(36).slice(2, 10);
    const start = Date.now();
    
    try {
      // Get container info and browser port
      const containerInfo = await containerService.getContainer(containerId);
      const port = containerInfo.browserPort;
      
      if (!port) {
        throw new ApiError(
          "BROWSER_PORT_NOT_FOUND",
          `No browser port mapping for container ${containerId}`,
          502
        );
      }

      logger.info(`[${requestId}] → ${method} /api/browser/${action} to port ${port}`, {
        containerId,
        action,
        data,
        method
      });

      // Prepare request body based on method
      let body = '';
      const headers: Record<string, string> = {
        'Host': `127.0.0.1:${port}`
      };

      // For methods that typically have a body (POST, PUT, PATCH)
      if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
        body = data ? JSON.stringify(data) : '{}';
        headers['Content-Type'] = 'application/json';
        headers['Content-Length'] = Buffer.byteLength(body).toString();
      } else if (['GET', 'DELETE'].includes(method.toUpperCase())) {
        // For GET/DELETE, don't send a body but still set content-length to 0
        headers['Content-Length'] = '0';
      }

      const options: RequestOptions = {
        host: '127.0.0.1',
        port,
        path: `/api/browser/${action}`,
        method: method.toUpperCase(),
        headers,
        agent: this.agent,
        timeout: 30000 // 30 second timeout
      };

      return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
          const chunks: Buffer[] = [];
          
          res.on('data', (chunk) => {
            chunks.push(chunk);
          });
          
          res.on('end', () => {
            const responseBody = Buffer.concat(chunks).toString();
            const duration = Date.now() - start;
            
            logger.info(`[${requestId}] ← ${res.statusCode} ${duration}ms`);
            
            try {
              if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                const result: BrowserActionResult = JSON.parse(responseBody);
                resolve(result);
              } else {
                const errorInfo = responseBody ? JSON.parse(responseBody) : { message: 'Unknown error' };
                reject(new ApiError(
                  'BROWSER_ACTION_FAILED',
                  errorInfo.message || `Browser action failed with status ${res.statusCode}`,
                  res.statusCode || 500,
                  errorInfo
                ));
              }
            } catch (parseError) {
              reject(new ApiError(
                'INVALID_RESPONSE',
                'Failed to parse browser service response',
                502,
                { responseBody, parseError: parseError instanceof Error ? parseError.message : String(parseError) }
              ));
            }
          });
        });

        req.on('error', (error) => {
          logger.error(`[${requestId}] Request error:`, error);
          reject(new ApiError(
            'BROWSER_REQUEST_FAILED',
            `Failed to connect to browser service: ${error.message}`,
            503,
            { cause: error.message }
          ));
        });

        req.on('timeout', () => {
          logger.error(`[${requestId}] Request timeout`);
          req.destroy();
          reject(new ApiError(
            'BROWSER_REQUEST_TIMEOUT',
            'Browser service request timed out',
            504
          ));
        });

        // Send the request body
        req.write(body);
        req.end();
      });

    } catch (error) {
      logger.error(`[${requestId}] Browser request error:`, error);
      throw error;
    }
  }
}

export default new BrowserService();
