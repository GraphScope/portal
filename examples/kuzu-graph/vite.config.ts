import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

import { resolve } from 'path';

export default defineConfig({
  root: './',
  server: {
    port: 8888, // 开发服务器端口号
    open: true, // 启动时自动打开浏览器
    cors: {
      origin: '*', // 允许所有来源的请求
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的方法
      allowedHeaders: ['Content-Type', 'Authorization'], // 允许的头部
      credentials: false, // 是否支持 cookie 凭证
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  build: {
    outDir: './dist',
  },
  optimizeDeps: {
    exclude: ['@kuzu/kuzu-wasm'],
  },
  plugins: [react(), wasm(), topLevelAwait()],
});
