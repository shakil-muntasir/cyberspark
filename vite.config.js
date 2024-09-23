/* eslint-disable no-console */
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    laravel({
      input: 'resources/js/app.tsx',
      refresh: true
    }),
    react(),
    {
      name: 'suppress-file-output',
      apply: 'build',
      buildEnd() {
        const log = console.log
        console.log = (...args) => {
          const msg = args[0]
          if (typeof msg === 'string' && (msg.includes('assets/') || msg.includes('manifest.json'))) return
          log(...args)
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@/': '/resources/js',
      '@/public': '/public'
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code === 'SOURCEMAP_ERROR') {
          return
        }

        defaultHandler(warning)
      }
    }
  }
})
