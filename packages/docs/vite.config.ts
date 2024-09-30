import { defineConfig } from 'servite/config';

export default defineConfig({
  server: {
    baseURL: process.env.GH_PAGES ? '/servite' : '/',
    prerender: {
      routes: ['**/*'],
      failOnError: true,
    },
  },
});
