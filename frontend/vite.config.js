import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Redirige /api al backend en local (en producción lo hace Nginx)
const apiProxy = {
  '/api': process.env.VITE_API_TARGET || 'http://localhost:3000',
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy: apiProxy },
  preview: { proxy: apiProxy },
})
