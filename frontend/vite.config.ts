import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow external access
    port: 5173, // Standard Vite port
    strictPort: false,
    hmr: true,
    watch: {
      usePolling: true,
    },
  },
  preview: {
    host: '0.0.0.0', // Allow external access for preview
    port: 4174, // Changed port to avoid conflicts
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
