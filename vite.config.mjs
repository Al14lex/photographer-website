
/**
 * @type {import('vite').UserConfig}
 */
import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';

export default defineConfig({
  define: {
    global: {},
    _global: {},
  },
  root: 'src', 
  publicDir: false,
  build: {
    sourcemap: true,
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
     input: './src/index.html',
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
  plugins: [injectHTML(), FullReload(['./src/**/**.html'])],
});
