import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // Load .env from project root instead of frontend/
  envDir: path.resolve(__dirname, '..'),
  server: {
    open: true,
  },
});
