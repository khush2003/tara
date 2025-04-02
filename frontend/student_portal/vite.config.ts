import path from "path"
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    port: 8080,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://backend:3000",
        changeOrigin: true,
    }
  },
},
  server: {
    host: "0.0.0.0",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://backend:3000",
        changeOrigin: true, 
      },
    },
  },
})
