import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all requests starting with /auth to the backend
      "/auth": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      // Proxy all requests starting with /posts to the backend
      "/posts": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      // If you have additional endpoints, add them here.
    },
    allowedHosts: ["https://blogify-blond.vercel.app"], // Whitelist your production host (or ngrok host) for dev access
  },
});
