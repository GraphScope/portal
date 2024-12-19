const express = require('express');
const path = require('path');
const { queryGraph } = require('@graphscope/studio-driver');

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
  gremlin_endpoint,
} = params;

// 设置全局响应头
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // 允许跨域访问
  res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

// static
app.use(express.static(WORKSPACE + '/dist'));

app.use(
  '/api',
  createProxyMiddleware({
    target: coordinator,
    changeOrigin: true,
  }),
);

/**
 * 如果在 Express 中使用 body-parser 或 express.json() 中间件来解析请求体
 * 可能会导致 http-proxy-middleware 无法正确代理请求。因为请求体已经被消费过，导致代理请求时无法再发送。
 */
app.use(express.json());

app.get('/graph/endpoint', (req, res) => {
  res.send({
    success: true,
    data: { cypher_endpoint, gremlin_endpoint },
  });
});

/** 图查询 */
app.post('/graph/query', async (req, res) => {
  const { script, language, endpoint, username, password } = req.body;
  const data = await queryGraph({ script, language, endpoint, username, password }, { debugger: false });
  res.send({
    success: true,
    data: data,
  });
});

// 对于其他路由，返回 React 应用的入口文件
app.get('*', (req, res) => {
  console.log('path>>>>>>', req.params);
  res.sendFile(path.join(WORKSPACE, '/dist', 'index.html'));
});

app.listen(port);

console.log({
  port,
  coordinator,
  cypher_endpoint,
  gremlin_endpoint,
});

console.log('Service listen on', `http://127.0.0.1:${port}`);
