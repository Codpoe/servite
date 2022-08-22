import { createServer } from 'vite';
import { lazyCachedFn } from './utils.js';
import { useRuntimeConfig } from '#internal/nitro';

export const getViteDevServer = lazyCachedFn(() => {
  return createServer({
    ...useRuntimeConfig()?.viteDevServerConfig,
    appType: 'custom',
    server: {
      middlewareMode: true,
    },
    logLevel: 'warn',
    optimizeDeps: {
      disabled: true,
    },
  });
});
