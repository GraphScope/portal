import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import dotenv from 'dotenv';
import wasm from 'vite-plugin-wasm';

// 获取传递的参数
const args = process.argv.slice(2);

// 解析参数
const params = {};
args.forEach(arg => {
  const [key, value] = arg.split('=');
  params[key.slice(2)] = value;
});
//@ts-ignore
const { mode } = params;
const isSingle = mode === 'single' && process.env.NODE_ENV === 'production';

console.log('params', params, args);

const plugins = isSingle ? [react(), viteSingleFile(), wasm()] : [react(), wasm()];

const { parsed } = dotenv.configDotenv();

const { COORDINATOR_URL } = parsed || {};

export default defineConfig({
  root: './',
  server: {
    // host: '0.0.0.0',
    // port: 8000,
    open: '/',
    proxy: {
      '/api/': {
        target: COORDINATOR_URL,
        changeOrigin: true,
      },
    },
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
    // minify: false,
    outDir: './dist',
    rollupOptions: {
      external: ['node:os', 'fsevents'], // 要排除的模块
    },
  },
  plugins,
  optimizeDeps: {
    exclude: ['@kuzu/kuzu-wasm'],
  },
});
