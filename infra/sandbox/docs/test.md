# Sandbox API Test Examples

This document provides examples of how to test the sandbox API using curl commands.

## Prerequisites

- Make sure the sandbox API server is running (default: http://localhost:3000)
- Docker must be installed and running on the host machine
- The following examples assume you have a Docker image available to use (e.g., `node:18-alpine`)

## 1. Create a Sandbox

Create a new sandbox container:

```bash
# Create a sandbox and store the container ID in an environment variable
CONTAINER_ID=$(curl -s -X POST http://localhost:3000/api/sandbox \
  -H "Content-Type: application/json" \
  -d '{
    "image": "node:18-alpine",
    "options": {
      "timeout": 60000,
      "memoryLimit": "512m",
      "cpuLimit": "0.5"
    }
  }' | jq -r '.containerId')

# Print the container ID for reference
echo "Container ID: $CONTAINER_ID"
```

Expected response (now captured in the $CONTAINER_ID variable):

```json
{
  "containerId": "container_abc123",
  "status": "running",
  "createdAt": "2025-05-12T10:00:00Z",
  "expiresAt": "2025-05-12T10:01:00Z"
}
```

## 2. Execute JavaScript Code in the Sandbox

Run a simple JavaScript program:

```bash
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "command": ["node", "-e", "console.log(\"Hello from sandbox!\")"]
  }'
```

Expected response:

```json
{
  "id": "exec_7683de5a",
  "status": "success",
  "duration": 125,
  "stdout": "Hello from sandbox!\n",
  "stderr": ""
}
```

## 3. Execute Code from a File in the Sandbox

Create and run a JavaScript file:

```bash
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "files": {
      "main.js": "console.log(\"Hello from file!\"); console.log(\"Current time:\", new Date().toISOString());"
    },
    "command": ["node", "main.js"]
  }'
```

Expected response:

```json
{
  "id": "exec_9876abc",
  "status": "success",
  "duration": 138,
  "stdout": "Hello from file!\nCurrent time: 2025-05-12T10:00:30.123Z\n",
  "stderr": ""
}
```

## 4. Execute Code with Multiple Files

Create and run a more complex example with multiple files:

```bash
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "files": {
      "index.js": "const utils = require(\"./utils\"); console.log(utils.greeting);",
      "utils.js": "module.exports = { greeting: \"Hello from a module!\" };"
    },
    "command": ["node", "index.js"]
  }'
```

Expected response:

```json
{
  "id": "exec_5432xyz",
  "status": "success",
  "duration": 145,
  "stdout": "Hello from a module!\n",
  "stderr": ""
}
```

## 5. Execute Python Code (Requires Python Image)

If you're using a Python image (`python:3.9-alpine`):

```bash
# Create a Python container and store its ID
PYTHON_CONTAINER_ID=$(curl -s -X POST http://localhost:3000/api/sandbox \
  -H "Content-Type: application/json" \
  -d '{
    "image": "python:3.9-alpine",
    "options": {
      "timeout": 60000
    }
  }' | jq -r '.containerId')

echo "Python Container ID: $PYTHON_CONTAINER_ID"
```

Then execute Python code:

```bash
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$PYTHON_CONTAINER_ID"'",
    "files": {
      "script.py": "import sys\nprint(f\"Python version: {sys.version}\")\nprint(\"Hello from Python!\")"
    },
    "command": ["python", "script.py"]
  }'
```

## 6. Check Sandbox Status

Get the status of a sandbox container:

```bash
curl -X GET http://localhost:3000/api/sandbox/$CONTAINER_ID
```

Expected response:

```json
{
  "containerId": "container_abc123",
  "status": "running",
  "createdAt": "2025-05-12T10:00:00Z",
  "expiresAt": "2025-05-12T10:01:00Z",
  "resourceUsage": {
    "cpuUsage": "0.05",
    "memoryUsage": "12.4MB"
  }
}
```

## 7. Delete a Sandbox

Remove a sandbox container:

```bash
curl -X DELETE http://localhost:3000/api/sandbox/$CONTAINER_ID
```

Expected response:

```json
{
  "status": "deleted",
  "containerId": "container_abc123"
}
```

## 8. Execute Code with Error

This example demonstrates how errors are reported:

```bash
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "files": {
      "error.js": "throw new Error(\"This is a deliberate error\");"
    },
    "command": ["node", "error.js"]
  }'
```

Expected response:

```json
{
  "id": "exec_1234err",
  "status": "error",
  "duration": 112,
  "stdout": "",
  "stderr": "/error.js:1\nthrow new Error(\"This is a deliberate error\");\n^\n\nError: This is a deliberate error\n    at Object.<anonymous> (/error.js:1:7)\n    at Module._compile (internal/modules/cjs/loader.js:1072:14)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1101:10)\n    at Module.load (internal/modules/cjs/loader.js:937:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:778:12)\n    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:76:12)\n    at internal/main/run_main_module.js:17:47\n",
  "error": "Process exited with code 1"
}
```

## 9. Sandbox with Invalid Image Name

This example shows the error when using a non-existent image:

```bash
curl -X POST http://localhost:3000/api/sandbox \
  -H "Content-Type: application/json" \
  -d '{
    "image": "non-existent-image:123"
  }'
```

Expected response:

```json
{
  "error": {
    "code": "IMAGE_PULL_FAILED",
    "message": "Failed to pull image: non-existent-image:123",
    "details": {
      "cause": "Error: pull access denied for non-existent-image, repository does not exist or may require 'docker login'"
    }
  }
}
```

## 10. Check Non-Existent Container

Try to get status of a non-existent container:

```bash
curl -X GET http://localhost:3000/api/sandbox/non-existent-container-id
```

Expected response:

```json
{
  "error": {
    "code": "CONTAINER_NOT_FOUND",
    "message": "Container with ID non-existent-container-id not found",
    "details": null
  }
}
```

## 11. Automatic Git Version Control (Proposed Enhancement)

The sandbox system should ideally track file changes automatically using Git when the same container is reused. This section describes the proposed behavior:

```bash
# First execution - creates initial files
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "files": {
      "app.js": "console.log(\"Initial version\");"
    },
    "command": ["node", "app.js"],
    "gitTracking": true
  }'
```

Expected response and behavior:

- File is created
- Automatic git initialization if needed
- `git add app.js` is executed
- `git commit -m "Initial creation of app.js"` is executed

```bash
# Second execution with the same container - modifies existing file
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "files": {
      "app.js": "console.log(\"Updated version\");"
    },
    "command": ["node", "app.js"],
    "gitTracking": true
  }'
```

Expected response and behavior:

- File is updated
- `git add app.js` is executed
- `git commit -m "Updated app.js at $(date)"` is executed

To view the git history:

```bash
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "command": ["git", "log", "--oneline"]
  }'
```

Expected response:

```json
{
  "id": "exec_gitlog",
  "status": "success",
  "duration": 82,
  "stdout": "a1b2c3d Updated app.js at Tue May 13 10:15:30 UTC 2025\n7e8f9g0 Initial creation of app.js\n",
  "stderr": ""
}
```

### Implementation Considerations

To implement this feature, the sandbox API should:

1. Accept a new parameter `gitTracking: boolean` in the exec API call
2. Track which files were modified by comparing the previous state
3. Generate appropriate commit messages based on the changes
4. Run git commands automatically after file modifications
5. Provide a way to access the git history through the API

This enhancement would make the sandbox more useful for:

- Tracking the evolution of code in a sandbox session
- Reviewing changes made during a development workflow
- Supporting educational scenarios where step-by-step progress matters
- Enabling rollback to previous versions if needed

## 12. Manual Git Operations (Current Approach)

Until the automatic Git tracking is implemented, you can manually track changes using explicit Git commands:

```bash
# First, create a file
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "files": {
      "main.js": "console.log(\"Hello from file!\");"
    },
    "command": ["cat", "main.js"]
  }'

# Then, commit the file with explicit Git commands
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "command": ["bash", "-c", "git add main.js && git commit -m \"Added main.js file\""]
  }'

# Make changes to the file
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "files": {
      "main.js": "console.log(\"Updated content!\");"
    },
    "command": ["cat", "main.js"]
  }'

# Commit the changes manually
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "command": ["bash", "-c", "git add main.js && git commit -m \"Updated main.js file\""]
  }'
```

## Shell Script for Full Test Flow

Here's a shell script that tests the complete flow:

```bash
#!/bin/bash
# Test script for sandbox API

# Create sandbox
echo "Creating sandbox container..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/sandbox \
  -H "Content-Type: application/json" \
  -d '{
    "image": "node:18-alpine",
    "options": {
      "timeout": 300000,
      "memoryLimit": "256m"
    }
  }')

echo $RESPONSE | jq .

# Extract container ID
CONTAINER_ID=$(echo $RESPONSE | jq -r .containerId)
echo "Container ID: $CONTAINER_ID"

# Execute simple code
echo -e "\nExecuting simple command..."
curl -s -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d "{
    \"containerId\": \"$CONTAINER_ID\",
    \"command\": [\"node\", \"-e\", \"console.log('Hello from sandbox!')\"]
  }" | jq .

# Execute code from file
echo -e "\nExecuting code from file..."
curl -s -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d "{
    \"containerId\": \"$CONTAINER_ID\",
    \"files\": {
      \"script.js\": \"console.log('File execution test'); console.log('Current time:', new Date().toISOString());\"
    },
    \"command\": [\"node\", \"script.js\"]
  }" | jq .

# Get container status
echo -e "\nGetting container status..."
curl -s -X GET http://localhost:3000/api/sandbox/$CONTAINER_ID | jq .

# Clean up
echo -e "\nDeleting container..."
curl -s -X DELETE http://localhost:3000/api/sandbox/$CONTAINER_ID | jq .

echo -e "\nTest completed"
```

Save this script to a file (e.g., `test-sandbox.sh`), make it executable with `chmod +x test-sandbox.sh`, and run it with `./test-sandbox.sh`. The script requires `jq` to be installed for JSON processing.
