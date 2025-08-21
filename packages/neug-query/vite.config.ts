import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
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

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const apiBaseUrl = process.env.VITE_API_BASE_URL || 'http://localhost:10001';
  
  return {
    plugins: [
      react({
        // 添加 React 插件配置以修复 preamble 检测问题
        include: '**/*.{jsx,tsx}',
        babel: {
          plugins: [],
        },
      }),
      ...(isSingle ? [viteSingleFile()] : []),
    ],
    base: './', // 保持相对路径
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      target: 'esnext', // 支持更新的 ES 特性，包括 BigInt
      rollupOptions: {
        output: isSingle
          ? {
              // Single file mode: inline everything
              inlineDynamicImports: true,
              entryFileNames: `[name].neug-query.js`,
              chunkFileNames: `[name].neug-query.js`,
              assetFileNames: `[name].neug-query.[ext]`,
            }
          : {
              // 手动分割代码块以减少单个 chunk 的大小
              manualChunks: {
                'react-vendor': ['react', 'react-dom'],
                router: ['react-router-dom'],
                antd: ['antd'],
              },
              entryFileNames: 'assets/[name].[hash].js',
              chunkFileNames: 'assets/[name].[hash].js',
              assetFileNames: 'assets/[name].[hash].[ext]',
            },
        // 增大 chunk 大小警告阈值
        onwarn(warning, warn) {
          if (warning.code === 'CIRCULAR_DEPENDENCY') return;
          if (warning.code === 'BUNDLE_SIZE_WARNING') return;
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
          warn(warning);
        },
      },
      // 压缩输出
      minify: 'terser', // 使用 terser 进行压缩优化
      terserOptions: {
        compress: {
          drop_console: true, // 移除 console
          drop_debugger: true, // 移除 debugger
          pure_funcs: ['console.log'], // 移除指定的纯函数调用
        },
        mangle: {
          safari10: true, // 兼容 Safari 10
        },
      },
      // 生成 source map - 开发环境启用，生产环境可选
      sourcemap: isDev ? true : 'hidden', // 开发环境完整 sourcemap，生产环境隐藏 sourcemap
      // 增大 chunk 大小限制
      chunkSizeWarningLimit: 2000,
      // 确保正确处理 CommonJS 模块
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
      },
    },
    server: {
      port: 3000,
      open: true,
      host: '0.0.0.0',
      // 启用热更新
      hmr: {
        overlay: true,
      },
      // 监听 workspace 依赖的文件变更
      watch: {
        // 监听 workspace 依赖目录
        ignored: ['!**/node_modules/@graphscope/**', '!../studio-components/**', '!../studio-query/**'],
      },
      // 配置代理来解决 CORS 问题
      proxy: {
        '/cypher': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false
        },
        '/cypherv2': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false
        },
        '/schema': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false
        },
      },
    },
    define: {
      // 为生产环境定义环境变量
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      // 确保全局变量正确定义
      global: 'globalThis',
    },
    // 优化依赖预构建
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      // 强制预构建依赖
      force: true,
    },
  };
});
