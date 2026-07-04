import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// Standalone build — the Base44 Vite plugin was removed since this app no
// longer runs inside the Base44 builder; its backend is the Netlify function.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // The "@" -> "src" alias used to be provided by the Base44 plugin.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Keep all third-party code in one stable "vendor" chunk so shipping an
        // app change doesn't invalidate it. (A finer react/radix split caused a
        // circular-chunk warning, so we keep vendor as a single unit.)
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor';
        }
      }
    }
  }
});
