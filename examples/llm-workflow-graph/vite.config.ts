import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: './',
  server: {
    port: 8000,
    open: '/',
  },
  build: { outDir: '../' },
  plugins: [react()],
});
