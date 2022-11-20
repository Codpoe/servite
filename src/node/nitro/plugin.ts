import { isMainThread } from 'worker_threads';
import { build, createDevServer, Nitro, prepare } from 'nitropack';
import { H3Event } from 'h3';
import { Plugin, ResolvedConfig } from 'vite';
import { ServiteConfig } from '../types.js';
import { initNitro } from './init.js';

export interface ServiteNitroPluginConfig {
  serviteConfig: ServiteConfig;
}

export function serviteNitro({
  serviteConfig,
}: ServiteNitroPluginConfig): Plugin {
  let viteConfig: ResolvedConfig;
  let nitro: Nitro;

  return {
    name: 'servite:nitro',
    enforce: 'post',
    // Only apply in main thread, not worker thread
    apply: () => isMainThread,
    configResolved(config) {
      viteConfig = config;
    },
    async configureServer(server) {
      nitro = await initNitro({
        serviteConfig,
        viteConfig,
        viteDevServer: server,
        nitroConfig: { dev: true },
      });

      const nitroDevServer = createDevServer(nitro);
      // Prepare directories
      await prepare(nitro);
      // Build dev server
      const buildPromise = build(nitro);

      return () => {
        server.middlewares.use(async (req, res, next) => {
          if (res.writableEnded) {
            return next();
          }

          // Set url for custom server
          if (req.originalUrl) {
            req.url = req.originalUrl;
          }

          await buildPromise;

          try {
            await nitroDevServer.app.handler(new H3Event(req, res));
          } catch (err) {
            res.statusCode = 500;

            if (err instanceof Error) {
              res.end(err.stack || err.message);
            } else {
              res.end('Unknown error');
            }
          }
        });

        // const historyMiddleware = history({
        //   htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
        //   index: FS_PREFIX_APP_HTML,
        // }) as Connect.NextHandleFunction;

        // server.middlewares.use((req, res, next) => {
        //   // The path of virtual module usually starts with @, we shouldn't rewrite it
        //   if (!req.url || req.url.startsWith('/@')) {
        //     return next();
        //   }

        //   const ext = path.extname(cleanUrl(req.url));

        //   // Do not rewrite paths with non-html ext
        //   if (ext && ext !== '.html') {
        //     return next();
        //   }

        //   return historyMiddleware(req, res, next);
        // });
      };
    },
    async closeBundle() {
      await nitro?.close();
    },
  };
}
