import { defineConfig } from 'servite/config';

export default defineConfig({
  server: {
    baseURL: '/base',
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
