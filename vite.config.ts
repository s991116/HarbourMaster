import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    /** Fail instead of silently using 5174, 5175, … when another dev server is still running. */
    strictPort: true,
  },
})
