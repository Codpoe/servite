import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { servite } from 'servite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), servite()],
});
