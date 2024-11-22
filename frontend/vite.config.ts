import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Listen on all interfaces
    port: 5173, // or your specific port
    strictPort: true, // Optional: fail if the port is already in use
    watch: {
      usePolling: true, // Use polling for watching files
    },
  },
  plugins: [react()],
})
