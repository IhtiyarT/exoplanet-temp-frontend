import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/exoplanet-temp-frontend',
  server: {
    proxy: {
      "/api": {
        target: "http://0.0.0.0:8082",
        changeOrigin: true,
        secure: false,
      },
      "/minio": {
        target: "http://0.0.0.0:9000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/minio/, ''),
      },
    },
    

    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    },
    
    host: true,
    port: 3000,
  },
});