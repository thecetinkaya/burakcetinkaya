import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2020",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("leaflet") || id.includes("react-leaflet")) {
              return "vendor-leaflet";
            }
            if (id.includes("react-icons")) {
              return "vendor-icons";
            }
            if (id.includes("framer-motion")) {
              return "vendor-motion";
            }
            if (id.includes("@supabase")) {
              return "vendor-supabase";
            }
            if (id.includes("react-router-dom") || id.includes("react-dom") || id.includes("react")) {
              return "vendor-core";
            }
            return "vendor-deps";
          }
        }
      }
    }
  },
  server: {
    proxy: {
      '/tv-api': {
        target: 'https://scanner.tradingview.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tv-api/, '')
      },
      '/yh-api': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/yh-api/, '')
      }
    }
  }
});
