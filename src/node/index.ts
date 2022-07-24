import path from 'upath';
import { Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import { conventionalEntries } from 'vite-plugin-conventional-entries';
import { conventionalRoutes } from 'vite-plugin-conventional-routes';
import { createServerApp } from './server/index.js';
import {
  APP_DIR,
  DEFAULT_PAGES_DIR,
  DIST_DIR,
  PAGES_PATTERN,
} from './constants.js';
import { ServiteConfig } from './types.js';

export function servite(serviteConfig: ServiteConfig = {}): Plugin[] {
  const {
    pagesDir = DEFAULT_PAGES_DIR,
    ssr = true,
    hashRouter = false,
  } = serviteConfig;

  let viteConfig: ResolvedConfig;
  let viteDevServer: ViteDevServer;

  const plugins: Plugin[] = [
    {
      name: 'servite',
      enforce: 'pre',
      config() {
        return {
          define: {
            __HASH_ROUTER__: hashRouter,
          },
        };
      },
      configResolved(config) {
        viteConfig = config;
      },
      configureServer(server) {
        viteDevServer = server;

        const serverApp = createServerApp({
          resolve(...paths) {
            return path.resolve(DIST_DIR, ...paths);
          },
          viteDevServer,
          ssr,
        });

        return () => {
          server.middlewares.use(async (req, res, next) => {
            const { url, originalUrl } = req;

            // set url for custom server
            if (originalUrl) {
              req.url = req.originalUrl;
            }

            try {
              await (serverApp as any)(req, res, () => {
                // if the response is not ended, continue to execute the next handler (spaFallback, htmlTransform)
                if (!res.writableEnded) {
                  // set url back for vite middleware
                  req.url = url;
                  next();
                }
              });
            } catch (err) {
              res.statusCode = 500;

              if (err instanceof Error) {
                server.ssrFixStacktrace(err);
                res.end(err.stack || err.message);
              } else {
                res.end('Unknown error');
              }
            }
          });
        };
      },
    },
    ...conventionalEntries({
      entries: APP_DIR,
    }),
    conventionalRoutes({
      pages: {
        dir: pagesDir,
        pattern: PAGES_PATTERN,
      },
    }),
  ];

  return plugins;
}

export default servite;
