import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: './',

  build: {
    outDir: './dist',
    rollupOptions: {},
  },

  optimizeDeps: {
    exclude: ['@kuzu/kuzu-wasm'],
  },

  plugins: [react()],
});
