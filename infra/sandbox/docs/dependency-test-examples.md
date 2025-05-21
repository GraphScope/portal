# 沙箱依赖管理API测试示例

本文档提供了如何使用curl命令测试沙箱依赖管理功能的示例。

## 前提条件

- 确保沙箱API服务器正在运行（默认: http://localhost:3000）
- Docker必须已安装并运行
- 以下示例假设你有可用的Docker镜像（例如，`node:18-alpine`, `python:3.9-alpine`）

## 1. Node.js依赖管理测试

以下示例展示如何在Node.js环境中使用依赖管理功能：

```bash
# 创建一个Node.js沙箱容器
CONTAINER_ID=$(curl -s -X POST http://localhost:3000/api/sandbox \
  -H "Content-Type: application/json" \
  -d '{
    "image": "ai-spider/node:18",
    "options": {
      "memoryLimit": "512m"
    }
  }' | jq -r '.containerId')

echo "Node.js Container ID: $CONTAINER_ID"

# 执行带有package.json的代码
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "files": {
      "package.json": "{\"name\":\"sandbox-test\",\"version\":\"1.0.0\",\"dependencies\":{\"chalk\":\"^4.1.2\"}}",
      "index.js": "const chalk = require(\"chalk\"); console.log(chalk.blue(\"Hello\"), chalk.red(\"dependency\"), chalk.green(\"world22!\"));"
    },
    "command": ["node", "index.js"],
    "gitTracking": true
  }'
```

预期响应:

```json
{
  "id": "exec_7683de5a",
  "status": "success",
  "duration": 3523,
  "stdout": "Hello dependency world!\n",
  "stderr": ""
}
```

## 2. Python依赖管理测试

以下示例展示如何在Python环境中使用依赖管理功能：

```bash
# 创建一个Python沙箱容器
PYTHON_CONTAINER_ID=$(curl -s -X POST http://localhost:3000/api/sandbox \
  -H "Content-Type: application/json" \
  -d '{
    "image": "python:3.9-alpine",
    "options": {
      "timeout": 120000
    }
  }' | jq -r '.containerId')

echo "Python Container ID: $PYTHON_CONTAINER_ID"

# 执行带有requirements.txt的代码
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$PYTHON_CONTAINER_ID"'",
    "files": {
      "requirements.txt": "requests==2.28.1\nnumpy==1.23.5",
      "script.py": "import requests\nimport numpy as np\n\nresponse = requests.get(\"https://httpbin.org/get\")\ndata = response.json()\nprint(\"Data from API:\", data[\"url\"])\nprint(\"NumPy array:\", np.array([1, 2, 3, 4, 5]))"
    },
    "command": ["python", "script.py"]
  }'
```

预期响应:

```json
{
  "id": "exec_9876abc",
  "status": "success",
  "duration": 8765,
  "stdout": "Data from API: https://httpbin.org/get\nNumPy array: [1 2 3 4 5]\n",
  "stderr": ""
}
```

## 3. 复杂的Node.js项目

以下示例展示一个更复杂的Node.js项目，使用多个依赖：

```bash
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "files": {
      "package.json": "{\"name\":\"express-test\",\"version\":\"1.0.0\",\"dependencies\":{\"express\":\"^4.18.2\",\"moment\":\"^2.29.4\"}}",
      "server.js": "const express = require(\"express\");\nconst moment = require(\"moment\");\n\nconst app = express();\n\napp.get(\"/\", (req, res) => {\n  res.send(`Hello World! Current time: ${moment().format(\"YYYY-MM-DD HH:mm:ss\")}`);\n});\n\nconst port = 3000;\nconsole.log(`Server would start on port ${port}`);\nconsole.log(`Current time: ${moment().format(\"YYYY-MM-DD HH:mm:ss\")}`);"
    },
    "command": ["node", "server.js"]
  }'
```

## 4. 依赖安装失败的情况

此示例展示当依赖安装失败时的响应：

```bash
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "files": {
      "package.json": "{\"name\":\"test-invalid\",\"version\":\"1.0.0\",\"dependencies\":{\"non-existent-package\":\"^1.0.0\"}}",
      "index.js": "console.log(\"This will not run if dependency install fails\");"
    },
    "command": ["node", "index.js"]
  }'
```

预期响应将包含依赖安装错误信息。

## 5. 不同工作目录中的依赖安装

此示例展示如何在子目录中安装和使用依赖：

```bash
curl -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$CONTAINER_ID"'",
    "files": {
      "project/package.json": "{\"name\":\"subdir-test\",\"version\":\"1.0.0\",\"dependencies\":{\"lodash\":\"^4.17.21\"}}",
      "project/app.js": "const _ = require(\"lodash\");\nconst arr = [1, 2, 3, 4, 5];\nconsole.log(\"Sum:\", _.sum(arr));\nconsole.log(\"First:\", _.first(arr));\nconsole.log(\"Last:\", _.last(arr));"
    },
    "command": ["sh", "-c", "cd /project && npm install && node app.js"]
  }'
```

## 完整测试脚本

以下是测试脚本，可用于验证依赖管理功能：

```bash
#!/bin/bash
# 依赖管理功能测试脚本

# 创建Node.js沙箱
echo "创建Node.js沙箱容器..."
NODE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/sandbox \
  -H "Content-Type: application/json" \
  -d '{
    "image": "node:18-alpine",
    "options": {
      "timeout": 180000,
      "memoryLimit": "512m"
    }
  }')

echo $NODE_RESPONSE | jq .

# 提取容器ID
NODE_CONTAINER_ID=$(echo $NODE_RESPONSE | jq -r .containerId)
echo "Node.js Container ID: $NODE_CONTAINER_ID"

# 测试Node.js依赖
echo -e "\n测试Node.js依赖..."
curl -s -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$NODE_CONTAINER_ID"'",
    "files": {
      "package.json": "{\"name\":\"sandbox-test\",\"version\":\"1.0.0\",\"dependencies\":{\"chalk\":\"^4.1.2\"}}",
      "index.js": "const chalk = require(\"chalk\"); console.log(chalk.blue(\"Hello\"), chalk.red(\"dependency\"), chalk.green(\"world!\"));"
    },
    "command": ["node", "index.js"]
  }' | jq .

# 创建Python沙箱
echo -e "\n创建Python沙箱容器..."
PYTHON_RESPONSE=$(curl -s -X POST http://localhost:3000/api/sandbox \
  -H "Content-Type: application/json" \
  -d '{
    "image": "ai-spider/python:3.11",
    "options": {
      "timeout": 180000
    }
  }')

echo $PYTHON_RESPONSE | jq .

# 提取容器ID
PYTHON_CONTAINER_ID=$(echo $PYTHON_RESPONSE | jq -r .containerId)
echo "Python Container ID: $PYTHON_CONTAINER_ID"

# 测试Python依赖
echo -e "\n测试Python依赖..."
curl -s -X POST http://localhost:3000/api/sandbox/exec \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$PYTHON_CONTAINER_ID"'",
    "files": {
      "requirements.txt": "requests\nnumpy",
      "script.py": "import requests\nimport numpy as np\n\nresponse = requests.get(\"https://httpbin.org/get\")\ndata = response.json()\nprint(\"Data from API:\", data[\"url\"])\nprint(\"NumPy array:\", np.array([1, 2, 3, 4, 5]))"
    },
    "command": ["python", "script.py"]
  }' | jq .

# 清理
echo -e "\n删除容器..."
curl -s -X DELETE http://localhost:3000/api/sandbox/$NODE_CONTAINER_ID | jq .
curl -s -X DELETE http://localhost:3000/api/sandbox/$PYTHON_CONTAINER_ID | jq .

echo -e "\n测试完成"
```

将此脚本保存为文件（例如，`test-dependencies.sh`），使用 `chmod +x test-dependencies.sh` 使其可执行，并使用 `./test-dependencies.sh` 运行它。该脚本需要已安装 `jq` 用于JSON处理。
