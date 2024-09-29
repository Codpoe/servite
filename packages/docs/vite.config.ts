import { defineConfig } from 'servite/config';

export default defineConfig({
  server: {
    prerender: {
      routes: ['/*', '/**/*'],
      failOnError: true,
    },
  },
});
