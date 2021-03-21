import path from "path";
import { defineConfig } from "vite";

import svelte from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
      {
        find: "$assets",
        replacement: path.resolve(__dirname, "./src/assets"),
      },
      {
        find: "$lib",
        replacement: path.resolve(__dirname, "./src/lib"),
      },
    ],
  },
  plugins: [svelte()],
});
