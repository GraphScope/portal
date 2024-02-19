const express = require('express');
const path = require('path');

const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// port
const args = process.argv.slice(2);
const port = args.length > 0 ? args[0] : 8888;

const WORKSPACE = path.dirname(__dirname);
console.log('WORKSPACE: ', WORKSPACE);

// static
app.use(express.static(WORKSPACE + '/dist'));

app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://47.242.172.5:8080',
    changeOrigin: true,
  }),
);

// 对于其他路由，返回 React 应用的入口文件
app.get('*', (req, res) => {
  res.sendFile(path.join(WORKSPACE, '/dist', 'index.html'));
});

app.listen(port);

console.log('Porxy Service listen on', `http://127.0.0.1:${port}`);
