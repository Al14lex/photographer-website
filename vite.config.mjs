import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import fg from 'fast-glob';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFiles = await fg('src/*.html', { absolute: true });

console.log("✅ Found input files for Rollup:", inputFiles);

if (inputFiles.length === 0) {
  throw new Error("❌ No HTML files found in src/");
}

export default defineConfig({
  define: {
    global: {},
    _global: {},
  },
  root: path.resolve(__dirname, 'src'),
  publicDir: path.resolve(__dirname, 'public'),
  build: {
    sourcemap: true,
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: inputFiles,
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        entryFileNames: '[name].js',
      },
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
  optimizeDeps: {
    include: ['browser-image-compression'],
  },
  plugins: [injectHTML(), FullReload(['./src/**/*.html'])],
});
