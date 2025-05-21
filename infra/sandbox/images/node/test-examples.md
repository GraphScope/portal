# AI Spider Node.js Official Image Test Examples

This document provides examples of how to test the official AI Spider Node.js sandbox images using curl commands.

## Prerequisites

- Make sure the sandbox API server is running (default: http://localhost:3000)
- Docker must be installed and running on the host machine
- The AI Spider Node.js images must be built using the build script (`./build.sh`)

## 1. Create a Node.js Sandbox

Create a new sandbox container with the official AI Spider Node.js 18 image:

```bash
# Create a sandbox and store the container ID in an environment variable
CONTAINER_ID=$(curl -s -X POST http://localhost:3000/api/sandbox \
  -H "Content-Type: application/json" \
  -d '{
    "image": "ai-spider/node:18",
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
  "createdAt": "2025-05-13T10:00:00Z",
  "expiresAt": "2025-05-13T10:01:00Z"
}
```

## 2. Execute JavaScript Code in the Sandbox

Run a simple JavaScript program:

```bash
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "command": ["node", "-e", "console.log(\"Hello from AI Spider Node.js sandbox!\")"]
  }'
```

Expected response:

```json
{
  "id": "exec_7683de5a",
  "status": "success",
  "duration": 125,
  "stdout": "Hello from AI Spider Node.js sandbox!\n",
  "stderr": ""
}
```

## 3. Test Package Manager (pnpm)

The official image comes with pnpm pre-installed:

```bash
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "command": ["pnpm", "--version"]
  }'
```

Expected response:

```json
{
  "id": "exec_9876abc",
  "status": "success",
  "duration": 138,
  "stdout": "8.15.4\n",
  "stderr": ""
}
```

## 4. Test TypeScript Support

Run a TypeScript file with ts-node:

```bash
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "files": {
      "test.ts": "const greeting: string = \"Hello from TypeScript!\";\nconsole.log(greeting);"
    },
    "command": ["ts-node", "test.ts"]
  }'
```

Expected response:

```json
{
  "id": "exec_5432xyz",
  "status": "success",
  "duration": 450,
  "stdout": "Hello from TypeScript!\n",
  "stderr": ""
}
```

## 5. Test Git Functionality

The image comes with Git pre-installed:

```bash
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "command": ["git", "--version"]
  }'
```

Expected response:

```json
{
  "id": "exec_gitver",
  "status": "success",
  "duration": 110,
  "stdout": "git version 2.47.2\n",
  "stderr": ""
}
```

## 6. Initialize a Node.js Project

Create a small Node.js project using npm:

```bash
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "files": {
      "package.json": "{\"name\":\"test-project\",\"version\":\"1.0.0\",\"main\":\"index.js\"}",
      "index.js": "console.log(\"This is a test Node.js project\");"
    },
    "command": ["node", "index.js"]
  }'
```

Expected response:

```json
{
  "id": "exec_nodeproj",
  "status": "success",
  "duration": 105,
  "stdout": "This is a test Node.js project\n",
  "stderr": ""
}
```

## 7. Testing Python Integration

The image includes Python support:

```bash
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "command": ["python", "--version"]
  }'
```

Expected response:

```json
{
  "id": "exec_pyver",
  "status": "success",
  "duration": 98,
  "stdout": "Python 3.12.10\n",
  "stderr": ""
}
```

## 8. Test Node.js 20 Image

Create a container with the Node.js 20 image:

```bash
# Create a Node.js 20 container and store its ID
NODE20_CONTAINER_ID=$(curl -s -X POST http://localhost:3000/api/sandbox \
  -H "Content-Type: application/json" \
  -d '{
    "image": "ai-spider/node:20",
    "options": {
      "timeout": 60000
    }
  }' | jq -r '.containerId')

echo "Node.js 20 Container ID: $NODE20_CONTAINER_ID"
```

Then check the Node.js version:

```bash
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$NODE20_CONTAINER_ID"'",
    "command": ["node", "--version"]
  }'
```

Expected response:

```json
{
  "id": "exec_node20ver",
  "status": "success",
  "duration": 87,
  "stdout": "v20.12.0\n",
  "stderr": ""
}
```

## 9. Test Sandbox User Permissions

Test that the sandbox user is properly configured:

```bash
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "command": ["id"]
  }'
```

Expected response:

```json
{
  "id": "exec_userid",
  "status": "success",
  "duration": 75,
  "stdout": "uid=101(sandbox) gid=101(sandbox) groups=101(sandbox)\n",
  "stderr": ""
}
```

## 10. Working with Environment Variables

Test setting custom environment variables in the container:

```bash
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "env": {
      "TEST_VAR": "hello world",
      "NODE_ENV": "development"
    },
    "command": ["node", "-e", "console.log(`TEST_VAR=${process.env.TEST_VAR}, NODE_ENV=${process.env.NODE_ENV}`)"]
  }'
```

Expected response:

```json
{
  "id": "exec_envtest",
  "status": "success",
  "duration": 92,
  "stdout": "TEST_VAR=hello world, NODE_ENV=development\n",
  "stderr": ""
}
```

## 11. Tracking Changes with Git

When executing multiple scripts in the same container, changes are not automatically committed to git. To track changes with git history, you need to explicitly include git commands in your execution requests:

```bash
# First, create or modify a file
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "files": {
      "main.js": "console.log(\"Hello from file!\");"
    },
    "command": ["cat", "main.js"]
  }'

# Then, commit the changes to git
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "command": ["bash", "-c", "git add main.js && git commit -m \"Added main.js file\""]
  }'

# Make additional changes
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "files": {
      "main.js": "console.log(\"Updated content!\");"
    },
    "command": ["cat", "main.js"]
  }'

# Commit the updates
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "command": ["bash", "-c", "git add main.js && git commit -m \"Updated main.js file\""]
  }'

# View git history
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "command": ["git", "log", "--oneline"]
  }'
```

Expected response from git log:

```json
{
  "id": "exec_gitlog",
  "status": "success",
  "duration": 82,
  "stdout": "abcd123 Updated main.js file\n7890def Added main.js file\n1234567 Initial commit\n",
  "stderr": ""
}
```

### Adding Git Operations to the Shell Script

You can extend the shell script to include automated git operations:

```bash
#!/bin/bash
# Test script for AI Spider Node.js sandbox image with git tracking

# Create sandbox
echo "Creating sandbox container with ai-spider/node:18 image..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/sandbox \
  -H "Content-Type: application/json" \
  -d '{
    "image": "ai-spider/node:18",
    "options": {
      "timeout": 300000,
      "memoryLimit": "256m"
    }
  }')

echo $RESPONSE | jq .

# Extract container ID
CONTAINER_ID=$(echo $RESPONSE | jq -r .containerId)
echo "Container ID: $CONTAINER_ID"

# Create a JavaScript file
echo -e "\nCreating JavaScript file..."
curl -s -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d "{
    \"containerId\": \"$CONTAINER_ID\",
    \"files\": {
      \"app.js\": \"console.log('Hello from Node.js sandbox!');\nconsole.log('This file will be tracked in git.');\"
    },
    \"command\": [\"cat\", \"app.js\"]
  }" | jq .

# Commit the file to git
echo -e "\nCommitting to git..."
curl -s -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d "{
    \"containerId\": \"$CONTAINER_ID\",
    \"command\": [\"bash\", \"-c\", \"git add app.js && git commit -m 'Added app.js'\" ]
  }" | jq .

# Update the file
echo -e "\nUpdating JavaScript file..."
curl -s -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d "{
    \"containerId\": \"$CONTAINER_ID\",
    \"files\": {
      \"app.js\": \"console.log('Updated file content!');\nconsole.log('This change will be tracked in git.');\n// Added new features\"
    },
    \"command\": [\"cat\", \"app.js\"]
  }" | jq .

# Commit the updated file
echo -e "\nCommitting changes to git..."
curl -s -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d "{
    \"containerId\": \"$CONTAINER_ID\",
    \"command\": [\"bash\", \"-c\", \"git add app.js && git commit -m 'Updated app.js with new features'\" ]
  }" | jq .

# Check git history
echo -e "\nChecking git history..."
curl -s -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d "{
    \"containerId\": \"$CONTAINER_ID\",
    \"command\": [\"git\", \"log\", \"--oneline\"]
  }" | jq .

# Clean up
echo -e "\nDeleting container..."
curl -s -X DELETE http://localhost:3000/api/sandbox/$CONTAINER_ID | jq .

echo -e "\nTest completed"
```
