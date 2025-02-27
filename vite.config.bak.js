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
      outDir: '../dist',
    },
    server: {
      fs: {
        allow: ['..'],
      },
    },
    plugins: [injectHTML(), FullReload(['./src/**/**.html'])],
  };
});
