import { defineConfig } from 'vite';
import { servite } from 'servite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: false,
  },
  plugins: [
    servite({
      ssg: ['/islands'],
      react: {
        babel: {
          plugins: ['styled-jsx/babel'],
        },
      },
    }),
  ],
});
