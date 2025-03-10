// /**
//  * @type {import('vite').UserConfig}
//  */
// import { defineConfig } from 'vite';
// import injectHTML from 'vite-plugin-html-inject';
// import FullReload from 'vite-plugin-full-reload';

// export default defineConfig({
//   define: {
//     global: {},
//     _global: {},
//   },
//   root: 'src',
//   // publicDir: 'public',
//   build: {
//     sourcemap: true,
//     outDir: '../dist',
//     emptyOutDir: true,
//     rollupOptions: {
//      input: './src/index.html',
//       output: {
//         manualChunks(id) {
//           if (id.includes('node_modules')) {
//             return 'vendor';
//           }
//         },
//         entryFileNames: 'commonHelpers.js',
//       },
//     },
//   },
//   server: {
//     fs: {
//       allow: ['..'],
//     },
//   },
//   plugins: [injectHTML(), FullReload(['./src/**/**.html'])],
// });
import { defineConfig } from "vite";
import htmlInject from "vite-plugin-html-inject";
import fullReload from "vite-plugin-full-reload";
import path from "path";

export default defineConfig({
  root: "src", // Коренева директорія фронтенду
  publicDir: "../public", // Доступ до статичних файлів
  build: {
    outDir: "../public", // Деплойна директорія
    emptyOutDir: true, // Очищення перед білдом
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "src/index.html"),
        price: path.resolve(__dirname, "src/price-page.html"),
        contact: path.resolve(__dirname, "src/contact-page.html"),
        individual: path.resolve(__dirname, "src/individual-page.html"),
        family: path.resolve(__dirname, "src/family-page.html"),
        children: path.resolve(__dirname, "src/children-page.html"),
        newborn: path.resolve(__dirname, "src/newborn-page.html"),
        admin: path.resolve(__dirname, "src/admin_review_page.html"),
        client: path.resolve(__dirname, "src/client-gallery.html"),
        policy: path.resolve(__dirname, "src/privacy-policy.html"),
        terms: path.resolve(__dirname, "src/terms-of-use.html"),
      },
    },
  },
  server: {
    host: true, // Дозволяє доступ з локальної мережі
    port: 5173, // Стандартний порт для Vite
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    htmlInject(),
    fullReload(["server/**/*.js", "server/**/*.mjs", "server/**/*.json"]),
  ],
});
