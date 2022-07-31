import path from 'upath';
import { Plugin, ResolvedConfig, ViteDevServer, Connect } from 'vite';
import history from 'connect-history-api-fallback';
import { routes } from './routes/index.js';
import { createServerApp } from './server/index.js';
import { resolveServiteConfig } from './config.js';
import { cleanUrl } from './utils.js';
import {
  APP_HTML_FILE,
  CLIENT_ENTRY_FILE,
  DIST_DIR,
  FS_PREFIX_APP_HTML,
  FS_PREFIX_CLIENT_ENTRY,
} from './constants.js';
import { UserServiteConfig } from './types.js';

export function servite(userServiteConfig?: UserServiteConfig): Plugin[] {
  const serviteConfig = resolveServiteConfig(userServiteConfig);
  const { pagesDir, ssr, hashRouter } = serviteConfig;

  let viteConfig: ResolvedConfig;
  let viteDevServer: ViteDevServer;

  const plugins: Plugin[] = [
    {
      name: 'servite',
      enforce: 'pre',
      config(config) {
        const root = path.normalize(path.resolve(config.root || ''));

        return {
          define: {
            __HASH_ROUTER__: hashRouter,
          },
          optimizeDeps: {
            entries: [path.relative(root, CLIENT_ENTRY_FILE)],
            include: [
              'react',
              'react/jsx-runtime',
              'react/jsx-dev-runtime',
              'react-dom/client',
              'nprogress',
            ],
          },
          build: {
            rollupOptions: {
              input: APP_HTML_FILE,
            },
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
          base: viteConfig.base,
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

          const historyMiddleware = history({
            htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
            index: FS_PREFIX_APP_HTML,
          }) as Connect.NextHandleFunction;

          server.middlewares.use((req, res, next) => {
            // The path of virtual module usually starts with @, we shouldn't rewrite it
            if (!req.url || req.url.startsWith('/@')) {
              return next();
            }

            const ext = path.extname(cleanUrl(req.url));

            // Do not rewrite paths with non-html ext
            if (ext && ext !== '.html') {
              return next();
            }

            return historyMiddleware(req, res, next);
          });
        };
      },
      transformIndexHtml: {
        enforce: 'pre',
        transform() {
          // inject client entry
          return [
            {
              tag: 'script',
              attrs: {
                type: 'module',
                src: FS_PREFIX_CLIENT_ENTRY,
              },
              injectTo: 'body',
            },
          ];
        },
      },
      api: {
        getServiteConfig() {
          return serviteConfig;
        },
      } as any,
    },
    routes({ pagesDir }),
  ];

  return plugins;
}

export default servite;
