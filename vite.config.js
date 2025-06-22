import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: ".",
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "index.html", // точка входа
      external: [],         // сюда можно добавлять внешние зависимости, если нужно
    },
    // Эта опция помогает убедиться, что файлы из electron не попадут
    commonjsOptions: {
      exclude: [path.resolve(__dirname, "src/electron/**")],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  json: {
    namedExports: true,
    stringify: false,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});

