#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}===================================================${NC}"
echo -e "${BLUE}Winston Multi-Channel Logger - cURL Testing Script${NC}"
echo -e "${BLUE}===================================================${NC}"
echo

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null; then
  echo -e "${RED}Server is not running! Start the server with:${NC}"
  echo -e "${YELLOW}cd examples/server && npx ts-node index.ts${NC}"
  exit 1
fi

echo -e "${GREEN}Server is running at http://localhost:3000${NC}"
echo
echo -e "${BLUE}Testing different log levels:${NC}"
echo

# Test info endpoint
echo -e "${GREEN}• Testing INFO log level${NC}"
echo -e "${YELLOW}  curl -X GET 'http://localhost:3000/info?message=This%20is%20a%20test%20info%20message'${NC}"
curl -s -X GET 'http://localhost:3000/info?message=This%20is%20a%20test%20info%20message' | jq .
echo
echo

# Test warning endpoint
echo -e "${YELLOW}• Testing WARN log level${NC}"
echo -e "${YELLOW}  curl -X GET 'http://localhost:3000/warn?message=This%20is%20a%20test%20warning%20message'${NC}"
curl -s -X GET 'http://localhost:3000/warn?message=This%20is%20a%20test%20warning%20message' | jq .
echo
echo

# Test error endpoint
echo -e "${RED}• Testing ERROR log level${NC}"
echo -e "${YELLOW}  curl -X GET 'http://localhost:3000/error?message=This%20is%20a%20test%20error%20message'${NC}"
curl -s -X GET 'http://localhost:3000/error?message=This%20is%20a%20test%20error%20message' | jq .
echo
echo

echo -e "${BLUE}===================================================${NC}"
echo -e "${GREEN}All test requests sent successfully!${NC}"
echo -e "${BLUE}Check the server console and log file to see the logged messages.${NC}"
echo -e "${BLUE}===================================================${NC}"
