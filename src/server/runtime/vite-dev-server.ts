import { createServer, ViteDevServer } from 'vite';
import config from '#servite/vite-dev-server-config';

export const getViteDevServer = (() => {
  let res: Promise<ViteDevServer> | null = null;

  return async () => {
    if (res === null) {
      res = createServer({
        ...config,
        appType: 'custom',
        server: {
          middlewareMode: true,
        },
        // logLevel: 'warn',
      }).catch(err => {
        res = null;
        throw err;
      });
    }

    return res;
  };
})();
