import { defineConfig } from 'tsup';

export default defineConfig({
  treeshake: true,
  splitting: true,
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['chrome'],
});
