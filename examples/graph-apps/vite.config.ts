import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  server: {
    port: 8000,
    open: '/',
  },
  build: {
    outDir: './dist',
  },
  plugins: [react()],
});
