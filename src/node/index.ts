import path from 'upath';
import fs from 'fs-extra';
import { PluginOption } from 'vite';
import fg from 'fast-glob';
import {
  APP_HTML_FILE,
  CLIENT_DIR,
  CLIENT_ENTRY_FILE,
  DIST_DIR,
  PKG_DIR,
} from './constants.js';
import { serviteJsx } from './jsx/plugin.js';
import { servitePages } from './pages/plugin.js';
import { serviteNitro } from './nitro/plugin.js';
import { resolveServiteConfig } from './config.js';
import { UserServiteConfig } from './types.js';

export function servite(userServiteConfig?: UserServiteConfig): PluginOption[] {
  const serviteConfig = resolveServiteConfig(userServiteConfig);
  const { hashRouter } = serviteConfig;

  const plugins: PluginOption[] = [
    {
      name: 'servite',
      enforce: 'pre',
      async config(config) {
        const root = path.resolve(config.root || '');

        // Generate html for ssr load template
        await fs.copy(
          APP_HTML_FILE,
          path.resolve(root, 'node_modules/.servite/index.html')
        );

        return {
          resolve: {
            alias: {
              'virtual:servite-dist': DIST_DIR,
            },
          },
          define: {
            __HASH_ROUTER__: hashRouter,
          },
          optimizeDeps: {
            entries: [path.relative(root, CLIENT_ENTRY_FILE)],
            include: [
              'react',
              'react/jsx-runtime',
              'react/jsx-dev-runtime',
              'react-dom',
              'react-dom/client',
              'nprogress',
              'ufo',
            ],
          },
        };
      },
      async configureServer(server) {
        // for local dev
        if (path.normalize(server.config.root).startsWith(PKG_DIR)) {
          const files = await fg('**/*', {
            cwd: DIST_DIR,
            ignore: [`${CLIENT_DIR}/**/*`],
            absolute: true,
          });
          server.config.configFileDependencies.push(...files);
          server.watcher.add(files);
        }
      },
      transformIndexHtml: {
        enforce: 'pre',
        transform(html) {
          // inject div#root
          if (!/<div.*?id=('|")root(\1)/.test(html)) {
            return [
              {
                tag: 'div',
                attrs: {
                  id: 'root',
                },
                injectTo: 'body',
              },
            ];
          }
        },
      },
      api: {
        getServiteConfig() {
          return serviteConfig;
        },
      } as any,
    },
    ...serviteJsx(),
    servitePages({ serviteConfig }),
    serviteNitro({ serviteConfig }),
  ];

  return plugins;
}

export default servite;
