import devtools from 'solid-devtools/vite'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
    plugins: [devtools({
        autoname: true,
    }),
    solidPlugin()],
    server: {
        port: 5174,
        proxy: {
            '/api': {
                target: 'http://localhost:3004',
                changeOrigin: true
            }
        }
    },
    build: {
        target: 'esnext',
    },
})
