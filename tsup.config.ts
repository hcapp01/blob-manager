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
  target: 'es2015',
  splitting: false,
  minify: false,
  esbuildOptions(options) {
    options.resolveExtensions = ['.tsx', '.ts', '.jsx', '.js']
  }
})