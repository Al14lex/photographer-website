// @ts-check
/**
 * @type {import('vite').UserConfig}
 */
import { defineConfig } from 'vite';
import { glob } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';

export default defineConfig(async ({ command }) => {
  return {
    define: {
      global: {},
      _global: {},
    },
    root: 'src',
    publicDir: '../public', 
    build: {
      sourcemap: true,
      outDir: '../dist', 
      emptyOutDir: true,
      rollupOptions: {
        input: await glob('./src/**/*.html'),
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
  };
});