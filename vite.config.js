import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
  const config = {
    server: {
      open: true,
      watch: {
        usePolling: true
      }
    },
    plugins: [react()],
    root: ".",
    base: '/',
    build: {
      sourcemap: command === 'serve',
      minify: 'esbuild'
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom']
    }
  };
  
  return config;
});