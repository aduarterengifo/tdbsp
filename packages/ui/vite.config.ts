import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@a33/tdbsp']
  },
    server: {
    watch: {
      // Optional: If HMR for linked package is an issue, you might investigate
      // watching the build output of the linked package.
      ignored: ['!**/node_modules/a33/tdbsp/build/**'],
    },
  },
})
