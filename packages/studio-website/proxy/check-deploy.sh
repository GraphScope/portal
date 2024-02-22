#!/bin/bash

# 检查 portal 是否存在
if npx pm2 show portal &> /dev/null; then
  # 如果存在，则重新启动 portal
  npx pm2 restart portal
else
  # 如果不存在，则启动 portal
  npx pm2 start index.js --name portal
fi