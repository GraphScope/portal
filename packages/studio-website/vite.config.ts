import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import dotenv from 'dotenv';
import wasm from 'vite-plugin-wasm';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import path from 'path';

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
const isLess = mode === 'less' && process.env.NODE_ENV === 'production';

const copyKuzuWasmWorkerJSFile = viteStaticCopy({
  targets: [
    {
      src: path.join(__dirname, '../studio-driver/node_modules/kuzu-wasm', 'kuzu_wasm_worker.js'),
      dest: 'assets', // 拷贝到 assets 目录下
    },
  ],
});

const plugins = isSingle
  ? [react(), viteSingleFile(), wasm(), copyKuzuWasmWorkerJSFile]
  : [react(), wasm(), copyKuzuWasmWorkerJSFile];
const rollupOptions = isLess
  ? {
      output: {
        globals: {}, // 如果有外部依赖，这里定义全局变量映射
        inlineDynamicImports: true, // 内联动态导入，防止拆分
        entryFileNames: `[name].portal.js`, // 不带hash的入口文件名
        chunkFileNames: `[name].portal.js`, // 不带hash的块文件名
        assetFileNames: `[name].portal.[ext]`, // 不带hash的资源文件名
      },
    }
  : {};
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

    // Tauri 工作于固定端口，如果端口不可用则报错
    strictPort: true,
    // 如果设置了 host，Tauri 则会使用
    host: false,
    port: 5173,
  },
  // 添加有关当前构建目标的额外前缀，使这些 CLI 设置的 Tauri 环境变量可以在客户端代码中访问
  envPrefix: ['VITE_', 'TAURI_ENV_*'],
  build: {
    // Tauri 在 Windows 上使用 Chromium，在 macOS 和 Linux 上使用 WebKit
    // target: process.env.TAURI_ENV_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
    // 在 debug 构建中不使用 minify
    // minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
    // 在 debug 构建中生成 sourcemap
    // sourcemap: !!process.env.TAURI_ENV_DEBUG,

    // minify: false,
    outDir: './dist',
    rollupOptions: {
      external: ['node:os', 'fsevents'], // 要排除的模块
      ...rollupOptions,
    },
  },
  plugins,
  optimizeDeps: {
    exclude: ['@kuzu/kuzu-wasm', 'kuzu-wasm'],
  },
  // 防止 Vite 清除 Rust 显示的错误
  clearScreen: false,
});
