#!/bin/bash

# 测试沙箱环境依赖管理功能的脚本
# 此脚本会创建Node.js和Python容器，测试依赖安装功能，然后清理容器

# 检查是否安装了 jq
if ! command -v jq &> /dev/null
then
    echo "错误: jq 未安装，请先安装 jq 后再运行此脚本。"
    echo "可以使用以下命令安装 jq:"
    echo "  - MacOS: brew install jq"
    echo "  - Ubuntu/Debian: apt-get install jq"
    echo "  - CentOS/RHEL: yum install jq"
    exit 1
fi

# 默认API地址
API_URL="http://localhost:3000/api/sandbox"

# 检查API服务是否运行
echo "检查沙箱API服务..."
if ! curl -s "$API_URL/health" > /dev/null; then
    echo "错误: 沙箱API服务未运行或不可访问，请先启动服务。"
    exit 1
fi

# 打印分隔线
function print_separator() {
    echo -e "\n====================================="
    echo $1
    echo "====================================="
}

# 创建Node.js沙箱
print_separator "1. 创建Node.js沙箱容器"

NODE_RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "ai-spider/node:18",
    "options": {
      "timeout": 180000,
      "memoryLimit": "512m"
    }
  }')

echo "创建Node.js容器响应:"
echo "$NODE_RESPONSE" | jq .

NODE_CONTAINER_ID=$(echo "$NODE_RESPONSE" | jq -r .containerId)
if [ "$NODE_CONTAINER_ID" == "null" ] || [ -z "$NODE_CONTAINER_ID" ]; then
    echo "错误: Node.js容器创建失败"
    exit 1
fi

echo "Node.js容器ID: $NODE_CONTAINER_ID"

# 测试Node.js简单依赖 (chalk)
print_separator "2. 测试Node.js简单依赖 (chalk)"

NODE_EXEC_RESPONSE=$(curl -s -X POST "$API_URL/exec" \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$NODE_CONTAINER_ID"'",
    "files": {
      "package.json": "{\"name\":\"sandbox-test\",\"version\":\"1.0.0\",\"dependencies\":{\"chalk\":\"^4.1.2\"}}",
      "index.js": "const chalk = require(\"chalk\"); console.log(chalk.blue(\"Hello\"), chalk.red(\"dependency\"), chalk.green(\"world!\"));"
    },
    "command": ["node", "index.js"],
    "gitTracking": true
  }')

echo "Node.js执行结果:"
echo "$NODE_EXEC_RESPONSE" | jq .

# 测试Node.js多依赖 (express + moment)
print_separator "3. 测试Node.js多依赖 (express + moment)"

NODE_EXPRESS_RESPONSE=$(curl -s -X POST "$API_URL/exec" \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$NODE_CONTAINER_ID"'",
    "files": {
      "package.json": "{\"name\":\"express-test\",\"version\":\"1.0.0\",\"dependencies\":{\"express\":\"^4.18.2\",\"moment\":\"^2.29.4\"}}",
      "server.js": "const express = require(\"express\");\nconst moment = require(\"moment\");\n\nconst app = express();\n\nconsole.log(`Express loaded successfully!`);\nconsole.log(`Current time: ${moment().format(\"YYYY-MM-DD HH:mm:ss\")}`);"
    },
    "command": ["node", "server.js"],
    "gitTracking": true
  }')

echo "Node.js多依赖执行结果:"
echo "$NODE_EXPRESS_RESPONSE" | jq .

# 创建Python沙箱
print_separator "4. 创建Python沙箱容器"

PYTHON_RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "ai-spider/python:3.11",
    "options": {
      "timeout": 180000,
      "memoryLimit": "512m"
    }
  }')

echo "创建Python容器响应:"
echo "$PYTHON_RESPONSE" | jq .

PYTHON_CONTAINER_ID=$(echo "$PYTHON_RESPONSE" | jq -r .containerId)
if [ "$PYTHON_CONTAINER_ID" == "null" ] || [ -z "$PYTHON_CONTAINER_ID" ]; then
    echo "错误: Python容器创建失败"
    exit 1
fi

echo "Python容器ID: $PYTHON_CONTAINER_ID"

# 测试Python依赖 (requests + numpy)
print_separator "5. 测试Python依赖 (requests + numpy)"

PYTHON_EXEC_RESPONSE=$(curl -s -X POST "$API_URL/exec" \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$PYTHON_CONTAINER_ID"'",
    "files": {
      "requirements.txt": "requests\nnumpy",
      "script.py": "import requests\nimport numpy as np\n\nprint(\"Requests version:\", requests.__version__)\nprint(\"NumPy version:\", np.__version__)\nprint(\"NumPy array:\", np.array([1, 2, 3, 4, 5]))\n\ntry:\n    response = requests.get(\"https://httpbin.org/get\")\n    data = response.json()\n    print(\"\\nData from API:\", data[\"url\"])\nexcept Exception as e:\n    print(\"API request failed:\", e)"
    },
    "command": ["python", "script.py"],
    "gitTracking": true
  }')

echo "Python依赖执行结果:"
echo "$PYTHON_EXEC_RESPONSE" | jq .

# 测试无效的依赖安装
print_separator "6. 测试无效的依赖安装"

INVALID_DEP_RESPONSE=$(curl -s -X POST "$API_URL/exec" \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "'"$NODE_CONTAINER_ID"'",
    "files": {
      "package.json": "{\"name\":\"invalid-dep-test\",\"version\":\"1.0.0\",\"dependencies\":{\"non-existent-package-12345\":\"^1.0.0\"}}",
      "index.js": "console.log(\"This will not execute if dependency installation fails\");"
    },
    "command": ["node", "index.js"]
  }')

echo "无效依赖测试结果:"
echo "$INVALID_DEP_RESPONSE" | jq .

# 清理容器
print_separator "7. 清理容器"

echo "删除Node.js容器 ($NODE_CONTAINER_ID):"
NODE_DELETE=$(curl -s -X DELETE "$API_URL/$NODE_CONTAINER_ID")
echo "$NODE_DELETE" | jq .

echo "删除Python容器 ($PYTHON_CONTAINER_ID):"
PYTHON_DELETE=$(curl -s -X DELETE "$API_URL/$PYTHON_CONTAINER_ID")
echo "$PYTHON_DELETE" | jq .

print_separator "测试完成"
echo "所有测试已完成，容器已清理。"