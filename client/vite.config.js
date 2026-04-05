import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'FitAI Health Planner',
        short_name: 'FitAI',
        description: 'Smart Health & Meal Planner',
        theme_color: '#121212',
        background_color: '#121212'
      }
    })
  ],
})
