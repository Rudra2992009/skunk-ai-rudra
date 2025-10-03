import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  server: {
    hmr: {
      overlay: false,
    },
  },
}));
