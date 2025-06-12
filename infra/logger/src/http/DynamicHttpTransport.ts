import { transports } from "winston";

/**
 * Winston transport that sends logs via HTTP with dynamic headers per log entry, using fetch.
 */
export default class DynamicHttpTransport extends transports.Http {
  private getContext: () => { authorization?: string; xContainerId?: string };

  constructor(option: transports.HttpTransportOptions & { getContext: () => { authorization?: string; xContainerId?: string } }) {
    super(option);
    this.getContext = option.getContext;
  }

  async log(info: any, callback: () => void) {
    setImmediate(() => this.emit("logged", info));

    const { authorization, xContainerId } = this.getContext();

    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    if (authorization) headers["Authorization"] = authorization;
    if (xContainerId) headers["x-container-id"] = xContainerId;

    try {
      await fetch(`http://${this.host}:${this.port}${this.path}`, {
        method: "POST",
        headers,
        body: JSON.stringify(info)
      });
    } catch (e) {
      // ignore error
    }

    callback();
  }
} 