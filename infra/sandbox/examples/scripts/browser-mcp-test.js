import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

async function createSandbox() {
  const API_URL = "http://localhost:3000/api/sandbox";
  const params = {
    image: "ai-spider/mix:latest",
    options: {
      timeout: 3000000, //300s,50min
      memoryLimit: "512m",
    }
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  };

  try {
    const response = await fetch(API_URL, options);
    const data = await response.json();
    console.log("Sandbox created:", data);
    return data.containerId;
  } catch (error) {
    console.error("Error creating sandbox:", error);
    throw error;
  }
}

async function testMcpEndpoint(containerId) {
  console.log(`Testing MCP endpoint for container ${containerId}...`);
  
  const MCP_HOST_URL = `http://localhost:3000/api/sandbox/browser/${containerId}/mcp`;
  console.log(`Making MCP test request to: ${MCP_HOST_URL}`);
  
  try {
    console.log("Initializing MCP client...");
    const startTime = Date.now();
    
    // Create transport and client
    const transport = new StreamableHTTPClientTransport(
      new URL(MCP_HOST_URL)
    );

    const client = new Client({
      name: "browser-mcp-test-client",
      version: "1.0.0"
    });

    // Connect to the MCP server
    await client.connect(transport);
    console.log(`MCP client connected in ${Date.now() - startTime}ms`);

    // List available tools
    const toolsResponse = await client.listTools();
    console.log("Available tools:", toolsResponse);

    const result = await client.callTool({
      name: "browser_navigate",
      arguments: {
        url: "https://www.baidu.com"
      }
    });
    console.log("Tool result:", result);

    // Clean up
    await transport.close();
    console.log("MCP client disconnected");
    
    return true;
  } catch (error) {
    console.error("Error in MCP endpoint test:", error);
    return false;
  }
}

async function main() {
  try {
    console.log("Starting MCP test sequence...");
    const containerId = await createSandbox();
    console.log(`Container created with ID: ${containerId}`);
    
    // Give the container a moment to fully initialize
    console.log("Waiting 2 seconds for container to initialize...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const testResult = await testMcpEndpoint(containerId);
    console.log(`Test completed with result: ${testResult ? "SUCCESS" : "FAILURE"}`);
  } catch (error) {
    console.error("Main process failed:", error);
  }
}

main();
