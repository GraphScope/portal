import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(
    "Portal MCP Server running on stdio",
    process.env.DEEPSEEK_API_KEY
  );
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
