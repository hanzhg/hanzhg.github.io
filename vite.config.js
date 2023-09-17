import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    server: {
        open: true,
        watch: {
            usePolling: true
          }
      },
    plugins: [react()],
    root: ".",
    base: './'
  };
});