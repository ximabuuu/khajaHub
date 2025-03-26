import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],  // Add extensions you want Vite to resolve automatically
  },
})
