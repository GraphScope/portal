#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}     Winston Multi-Channel Logger      ${NC}"
echo -e "${BLUE}      Local DNS Fix and Starter        ${NC}"
echo -e "${BLUE}=======================================${NC}"
echo

# Add localhost entry temporarily for this session
echo -e "${YELLOW}Adding localhost mapping to /etc/hosts (may require sudo password)${NC}"
if ! grep -q "^127.0.0.1[[:space:]]\+localhost" /etc/hosts; then
  echo "127.0.0.1 localhost" | sudo tee -a /etc/hosts > /dev/null
  echo -e "${GREEN}Successfully added localhost entry${NC}"
else
  echo -e "${GREEN}Localhost entry already exists${NC}"
fi

echo -e "${GREEN}Starting the application...${NC}"

# Go to example directory
cd "$(dirname "$0")"

# Start servers
cd server
echo -e "${YELLOW}Starting server components...${NC}"
CURRENT_DIR=$(pwd)
npx ts-node index.ts &
SERVER_PID=$!
cd ..

# Wait for servers to start
sleep 2

# Start client
cd client
echo -e "${YELLOW}Starting client...${NC}"
npm run dev &
CLIENT_PID=$!
cd ..

# Wait for exit signal
echo -e "${GREEN}All services started!${NC}"
echo -e "${BLUE}--------------------------------------${NC}"
echo -e "${YELLOW}API Server: ${NC}http://127.0.0.1:3000"
echo -e "${YELLOW}Log Server: ${NC}http://127.0.0.1:3001"
echo -e "${YELLOW}Client App: ${NC}http://127.0.0.1:5173"
echo -e "${BLUE}--------------------------------------${NC}"
echo -e "Press Ctrl+C to stop all services"

# Cleanup function
cleanup() {
  echo -e "${YELLOW}Stopping all services...${NC}"
  kill $SERVER_PID $CLIENT_PID 2>/dev/null
  echo -e "${GREEN}All services stopped${NC}"
  exit 0
}

# Set trap for cleanup
trap cleanup INT

# Wait for processes
wait
