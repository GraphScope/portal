const express = require('express');
const path = require('path');

const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// 获取传递的参数
const args = process.argv.slice(2);

// 解析参数
const params = {};
args.forEach(arg => {
  const [key, value] = arg.split('=');
  params[key.slice(2)] = value;
});

const WORKSPACE = path.dirname(__dirname);

const {
  port = 8888,
  coordinator = 'http://127.0.0.1:8080',
  cypher_endpoint = 'neo4j://127.0.0.1:7687',
  gremlin_endpoint = 'ws://127.0.0.1:8182',
} = params;

// static
app.use(express.static(WORKSPACE + '/dist'));

app.use(
  '/api',
  createProxyMiddleware({
    target: coordinator,
    changeOrigin: true,
  }),
);

app.get('/query_endpoint', (req, res) => {
  res.send({
    success: true,
    data: { cypher_endpoint, gremlin_endpoint },
  });
});

// 对于其他路由，返回 React 应用的入口文件
app.get('*', (req, res) => {
  res.sendFile(path.join(WORKSPACE, '/dist', 'index.html'));
});

app.listen(port);

console.log('Service listen on', `http://127.0.0.1:${port}`);
