import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const PORT = 3000; // must match RASP_PI.serverPort in shared consts

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "192.168.68.142", // raspberry pi's ip address
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
      },
    },
  },
});
