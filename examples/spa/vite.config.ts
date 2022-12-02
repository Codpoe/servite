import { defineConfig } from 'vite';
import { servite } from 'servite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    servite({
      spa: true,
    }),
  ],
});
