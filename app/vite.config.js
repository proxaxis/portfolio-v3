import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  server: {
    proxy: {
      '/zenn': {
        target: 'https://zenn.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/zenn/, ''),
      },
      '/whatistoday': {
        target: 'https://api.whatistoday.cyou',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/whatistoday/, ''),
      },
      '/open-meteo': {
        target: 'https://api.open-meteo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/open-meteo/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
