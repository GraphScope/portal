import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

import tools from "./tools/index";
import resources from "./resource";

const server = new McpServer({
  name: "portal-mcp",
  version: "1.0.0",
});

/** register tools */
Object.values(tools).forEach((tool) => {
  //@ts-ignore
  server.tool(tool.name, tool.description, tool.parameters, tool.execute);
});

/** register resources */
Object.values(resources).forEach((r) => {
  server.resource(r.name, r.uri, r.execute);
});

const app = express();
let transport: SSEServerTransport;
app.get("/sse", async (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  await transport.handlePostMessage(req, res);
});

app.listen(3001, () => [console.log("Server listening on port 3001")]);
