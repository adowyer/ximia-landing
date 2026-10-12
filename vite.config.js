import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// Four entries, one per URL. `main` is the live landing and is untouched; the three under
// /new are the proposed site (see src/new/DESIGN_FROM_VENDER.md). Each builds to its own
// directory, so the URLs work with no server and no host rewrite.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('index.html', import.meta.url)),
        newHome: fileURLToPath(new URL('new/index.html', import.meta.url)),
        newGrant: fileURLToPath(new URL('new/otorgar/index.html', import.meta.url)),
        newRaise: fileURLToPath(new URL('new/recaudar/index.html', import.meta.url)),
      },
    },
  },
})
