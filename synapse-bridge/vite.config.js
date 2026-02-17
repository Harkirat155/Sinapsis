import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local dev convenience: proxy /api/* to the EC2 services.
// In production (Vercel), /api/* is handled by serverless functions in /api.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/core': {
        target: process.env.SYNAPSE_CORE_API_URL || 'http://13.233.255.95:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/core/, '')
      },
      '/api/intent': {
        target: process.env.SYNAPSE_INTENT_API_URL || 'http://13.233.255.95:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/intent/, '')
      },
      '/api/rapid': {
        target: process.env.SYNAPSE_RAPID_API_URL || 'http://13.233.255.95:8002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rapid/, '')
      },
      '/api/feedback': {
        target: process.env.SYNAPSE_FEEDBACK_API_URL || 'http://13.233.255.95:8003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/feedback/, '')
      }
    }
  }
})

