import path from 'upath';
import { PluginOption } from 'vite';
import fg from 'fast-glob';
import {
  CLIENT_DIR,
  CLIENT_ENTRY_FILE,
  DIST_DIR,
  PKG_DIR,
} from './constants.js';
import { serviteHtml } from './html/plugin.js';
import { serviteJsx } from './jsx/plugin.js';
import { servitePages } from './pages/plugin.js';
import { serviteNitro } from './nitro/plugin.js';
import { resolveServiteConfig } from './config.js';
import { UserServiteConfig } from './types.js';

export function servite(userServiteConfig?: UserServiteConfig): PluginOption[] {
  const serviteConfig = resolveServiteConfig(userServiteConfig);

  const plugins: PluginOption[] = [
    {
      name: 'servite',
      enforce: 'pre',
      async config(config) {
        const root = path.resolve(config.root || '');

        return {
          resolve: {
            alias: {
              'virtual:servite-dist': DIST_DIR,
            },
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
          build: {
            commonjsOptions: {
              include: [
                /react/,
                /react-dom/,
                /scheduler/,
                /prop-types/,
                /shallowequal/,
                /invariant/,
                /nprogress/,
              ],
            },
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
      api: {
        getServiteConfig() {
          return serviteConfig;
        },
      } as any,
    },
    serviteHtml({ serviteConfig }),
    ...serviteJsx(),
    servitePages({ serviteConfig }),
    serviteNitro({ serviteConfig }),
  ];

  return plugins;
}

export default servite;
