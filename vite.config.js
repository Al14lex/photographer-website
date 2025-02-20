import { defineConfig } from 'vite';
import { globSync } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';

export default defineConfig(({ command }) => {
  return {
    define: {
  global: 'undefined' !== typeof global ? global : {},
  _global: 'undefined' !== typeof global ? global : {},
},
    root: 'src',
    publicDir: '../public', 
    build: {
      sourcemap: true,
      rollupOptions: {
        input: globSync('./src/**/*.html'),
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