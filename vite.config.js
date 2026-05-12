import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStartVite } from "@tanstack/react-start/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tanstackStartVite(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
