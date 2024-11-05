import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['lib/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', '@vercel/blob'],
  treeshake: true,
  sourcemap: true,
  outDir: 'dist',
  esbuildOptions(options) {
    options.resolveExtensions = ['.tsx', '.ts', '.jsx', '.js']
  }
})