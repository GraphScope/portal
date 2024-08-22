import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  if (mode === 'production') {
    return {
      build: {
        lib: {
          entry: path.resolve(__dirname, 'src/index.tsx'),
          name: '@graphscope/studio-graph-editor',
          fileName: format => `studio-graph-editor.${format}.js`,
        },
        outDir: './dist',
      },
      plugins: [react()],
    };
  } else {
    return {
      root: './public',
      server: {
        port: 8000,
        open: '/',
      },
      build: {
        outDir: './dist',
      },
      plugins: [react()],
    };
  }
});
