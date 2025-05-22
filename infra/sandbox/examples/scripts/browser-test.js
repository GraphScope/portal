async function createSandbox() {
  const API_URL = "http://localhost:3000/api/sandbox";
  const params = {
    image: "ai-spider/python:latest",
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
  
  const API_URL = `http://localhost:3000/api/sandbox/browser/${containerId}/mcp`;
  console.log(`Making browser test request to: ${API_URL}`);
  
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(10000) // 10 second timeout
  };

  try {
    console.log("Sending request...");
    const startTime = Date.now();
    
    const response = await fetch(API_URL, options);
    console.log(`Received response in ${Date.now() - startTime}ms with status: ${response.status}`);
    
    const data = await response.json();
    console.log("MCP endpoint test result:", data);
    return true;
  } catch (error) {
    if (error.name === 'TimeoutError') {
      console.error(`Request timed out after ${error.timeoutMs || 10000}ms`);
    } else {
      console.error("Error in MCP endpoint test:", error);
    }
    return false;
  }
}

async function main() {
  try {
    console.log("Starting test sequence...");
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
