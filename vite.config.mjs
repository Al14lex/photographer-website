
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
  publicDir: 'public',
  build: {
    sourcemap: true,
    outDir: '/dist',
    emptyOutDir: true,
    rollupOptions: {
     input: {
        main: './src/index.html',
        home: './src/home-page.html',
        individual: './src/individual-page.html',
        family: './src/family-page.html',
        children: './src/children-page.html',
        newborn: './src/newborn-page.html',
        price: './src/price-page.html',
        admin: './src/admin_review_page.html',
        client:'./src/client-gallery.html'
      },
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
