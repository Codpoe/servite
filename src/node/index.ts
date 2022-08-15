import path from 'upath';
import { Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import { build, createDevServer, prepare } from 'nitropack';
import { PagesManager } from './pages/manager.js';
import { servitePages } from './pages/plugin.js';
import { initNitro } from './nitro.js';
import { resolveServiteConfig } from './config.js';
import {
  APP_HTML_FILE,
  CLIENT_ENTRY_FILE,
  FS_PREFIX_CLIENT_ENTRY,
} from './constants.js';
import { UserServiteConfig } from './types.js';

export function servite(userServiteConfig?: UserServiteConfig): Plugin[] {
  const serviteConfig = resolveServiteConfig(userServiteConfig);
  const { hashRouter } = serviteConfig;

  const pagesManager = new PagesManager();
  let pagesManagerSetupPromise: Promise<void> | null = null;

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
          ssr: {
            noExternal: ['servite'],
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
        pagesManagerSetupPromise = pagesManager.setup(viteConfig);
      },
      async configureServer(server) {
        viteDevServer = server;

        const nitro = await initNitro({
          serviteConfig,
          viteConfig,
          viteDevServer,
          nitroConfig: { dev: true },
        });

        const nitroDevServer = createDevServer(nitro);
        await prepare(nitro);

        const buildPromise = build(nitro);

        return () => {
          server.middlewares.use(async (req, res, next) => {
            if (res.writableEnded) {
              return next();
            }

            // set url for custom server
            if (req.originalUrl) {
              req.url = req.originalUrl;
            }

            await pagesManagerSetupPromise;
            await buildPromise;

            try {
              await nitroDevServer.app.nodeHandler(req, res);
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
      },
    },
    servitePages({ pagesManager }),
  ];

  return plugins;
}

export default servite;
