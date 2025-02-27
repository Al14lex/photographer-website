// import { defineConfig } from 'vite';
// import { glob } from 'glob';
// import injectHTML from 'vite-plugin-html-inject';
// import FullReload from 'vite-plugin-full-reload';

// export default defineConfig(async ({ command }) => {
//   return {
//     define: {
//       global: {},
//       _global: {},
//     },
//     root: 'src',
//     publicDir: '../public', 
//     build: {
//       sourcemap: true,
//       rollupOptions: {
//         input: await glob('./src/**/*.html'),
//         output: {
//           manualChunks(id) {
//             if (id.includes('node_modules')) {
//               return 'vendor';
//             }
//           },
//           entryFileNames: 'commonHelpers.js',
//         },
//       },
//       outDir: '../dist',
//     },
//     server: {
//       fs: {
//         allow: ['..'],
//       },
//     },
//     plugins: [injectHTML(), FullReload(['./src/**/**.html'])],
//   };
// });
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
      outDir: '../dist', // 🔹 Можливо, треба змінити на просто 'dist'
      emptyOutDir: true, // ✅ Додаємо, щоб очищати `dist` перед збіркою
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
