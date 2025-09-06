import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        host: true
    },
    preview: {
        port: process.env.PORT || 5173,
        host: '0.0.0.0'
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore']
                }
            }
        }
    },
    define: {
        'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:4000')
    }
})
