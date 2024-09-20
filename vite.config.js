import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src', // Якщо index.html в src
  build: {
      outDir: '../dist', // Задайте вихідний каталог
      emptyOutDir: true,
  },
});