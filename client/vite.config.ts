import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const PORT = 3000;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "192.168.68.142", // raspberry pi's ip address
    proxy: {
      "/api": {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
      },
      "/socket.io": {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
