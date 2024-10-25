import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  root: "./",
  server: {
    host: "0.0.0.0",

    open: "/",
  },
  build: {
    outDir: "./dist",
  },
  plugins: [react()],
});
