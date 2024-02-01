import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      // Setup proxy for API requests
      // Assuming your FastAPI backend is running on port 8000
      '/api': {
        target: 'http://localhost:8000', // Proxy requests to FastAPI backend
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, '') // Rewrite the API request URL (optional)
      },
    },
  },
});
