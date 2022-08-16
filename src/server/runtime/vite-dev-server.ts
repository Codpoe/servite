import { createServer, ViteDevServer } from 'vite';
import { useRuntimeConfig } from '#internal/nitro';

export const getViteDevServer = (() => {
  let res: Promise<ViteDevServer> | null = null;

  return async () => {
    if (res === null) {
      res = createServer({
        ...useRuntimeConfig()?.viteDevServerConfig,
        appType: 'custom',
        server: {
          middlewareMode: true,
        },
        logLevel: 'warn',
      }).catch(err => {
        res = null;
        throw err;
      });
    }

    return res;
  };
})();
