// [CO6: Build Systems / Bundlers] - Vite configuration defining port settings and React bundler extensions
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 3000, open: true }
})
