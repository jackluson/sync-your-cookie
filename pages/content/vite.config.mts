import { watchRebuildPlugin } from '@sync-your-cookie/hmr';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');

const isDev = process.env.__DEV__ === 'true';
const isProduction = !isDev;

export default defineConfig({
  resolve: {
    alias: {
      '@src': srcDir,
    },
  },
  base: '',
  plugins: [react(), isDev && watchRebuildPlugin({ refresh: true })],
  publicDir: resolve(rootDir, 'public'),
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['iife'],
      name: 'ContentScript',
      fileName: 'index',
    },
    sourcemap: isDev,
    minify: isProduction,
    reportCompressedSize: isProduction,
    rollupOptions: {
      external: ['chrome'],
    },
    outDir: resolve(rootDir, '..', '..', 'dist', 'content'),
  },
  define: {
    'process.env.NODE_ENV': isDev ? `"development"` : `"production"`,
  },
});
