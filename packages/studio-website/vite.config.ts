import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import dotenv from 'dotenv';

const { parsed } = dotenv.configDotenv();

const { COORDINATOR_URL } = parsed || {};

export default defineConfig({
  root: './',
  server: {
    host: '0.0.0.0',
    // port: 8000,
    open: '/',
    proxy: {
      '/api/': {
        target: COORDINATOR_URL,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: './dist',

    rollupOptions: {
      external: ['node:os', 'fsevents'], // 要排除的模块
    },
  },
  plugins: [react()],
});
