import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
export default defineConfig({
  define: {
    global: 'window',
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    watch:{
  usePolling:true
    },
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      '/users': {
        target: 'http://ems-user:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/users/, '/api/v1'),
      },
      '/tasks': {
        target: 'http://ems-task:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/tasks/, '/api/v1'),
      },
      '/reports': {
        target: 'http://ems-report:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/reports/, '/api/v1'),
      },
      // Add this for websocket proxying:
        '/ws': {
    target: 'http://ems-report:8080',
    changeOrigin: true,
    ws: true, // for websocket upgrades
    secure: false,
  }
    },
  },
});
