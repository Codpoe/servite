import { defineConfig } from 'servite/config';

export default defineConfig({
  server: {
    baseURL: '/base',
    prerender: {
      failOnError: true,
      routes: ['/*', '/**/*'],
    },
  },
  routers: {
    server: {
      base: '/server',
    },
    ssr: {
      base: '/ssr',
    },
  },
});
