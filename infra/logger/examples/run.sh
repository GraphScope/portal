#!/bin/bash

# 定义颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}     Winston Multi-Channel Logger      ${NC}"
echo -e "${BLUE}=======================================${NC}"
echo

# 确保日志目录存在
mkdir -p examples/logs

echo -e "${GREEN}启动所有服务...${NC}"

# 进入示例目录
cd "$(dirname "$0")" || exit

# 在后台启动服务端
echo -e "${YELLOW}启动服务端...${NC}"
cd server && npx ts-node index.ts &
SERVER_PID=$!
cd ..

# 等待服务端启动
sleep 2

# 在后台启动客户端
echo -e "${YELLOW}启动客户端...${NC}"
cd client && npm run dev &
CLIENT_PID=$!
cd ..

# 等待客户端启动
sleep 3

echo -e "${GREEN}所有服务启动完成!${NC}"
echo -e "${BLUE}--------------------------------------${NC}"
echo -e "${YELLOW}API 服务器运行在: ${NC}http://localhost:3000"
echo -e "${YELLOW}日志 WebSocket 服务器运行在: ${NC}ws://localhost:3001"
echo -e "${YELLOW}客户端运行在: ${NC}http://localhost:5173 (或者类似端口)"
echo -e "${BLUE}--------------------------------------${NC}"
echo

echo -e "${GREEN}现在你可以:${NC}"
echo -e "1. 访问客户端页面查看实时日志"
echo -e "2. 使用 curl-test.sh 脚本进行测试"
echo -e "3. 按 Ctrl+C 停止所有服务"
echo

# 等待用户终止
trap 'echo -e "${YELLOW}正在关闭所有服务...${NC}"; kill $SERVER_PID $CLIENT_PID 2>/dev/null; echo -e "${GREEN}已关闭所有服务${NC}"; exit' INT
wait
