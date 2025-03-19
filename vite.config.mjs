import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import { glob } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(async ({ command }) => {
  return {
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
        input: await glob(path.resolve(__dirname, 'src/**/*.html')),
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          entryFileNames: 'commonHelpers.js',
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
    plugins: [injectHTML(), FullReload(['./src/**/**.html'])],
  };
});
