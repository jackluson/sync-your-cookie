import { defineConfig } from 'tsup';

export default defineConfig({
  treeshake: true,
  splitting: false,
  format: ['cjs', 'esm'],
  dts: true,
  external: ['chrome'],
});
