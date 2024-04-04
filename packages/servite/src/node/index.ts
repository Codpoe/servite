import path from 'upath';
import type { PluginOption } from 'vite';
import fg from 'fast-glob';
import { CLIENT_DIR, DIST_DIR, PKG_DIR } from './constants.js';
import { serviteHtml } from './html/plugin.js';
import { serviteJsx } from './jsx/plugin.js';
import { servitePages } from './pages/plugin.js';
import { serviteNitro } from './nitro/plugin.js';
import { resolveServiteConfig } from './config.js';
import type { UserServiteConfig } from './types.js';

export function servite(userServiteConfig?: UserServiteConfig): PluginOption[] {
  const serviteConfig = resolveServiteConfig(userServiteConfig);

  const plugins: PluginOption[] = [
    {
      name: 'servite',
      enforce: 'pre',
      async config() {
        return {
          appType: 'custom',
          experimental: {
            hmrPartialAccept: true,
          },
          resolve: {
            alias: {
              'virtual:servite-dist': DIST_DIR,
            },
          },
          optimizeDeps: {
            include: [
              'react',
              'react/jsx-runtime',
              'react/jsx-dev-runtime',
              'react-dom',
              'react-dom/client',
              'servite > nprogress',
              'servite > react-helmet-async > react-fast-compare',
              'servite > react-helmet-async > invariant',
              'servite > react-helmet-async > shallowequal',
            ],
            exclude: ['virtual:servite-dist'],
          },
          ssr: {
            noExternal: ['react-helmet-async'],
          },
          // optimizeDeps: {
          //   include: [
          //     'react',
          //     'react/jsx-runtime',
          //     'react/jsx-dev-runtime',
          //     'react-dom/client',
          //     'servite > react-router-dom',
          //     'servite > react-helmet-async',
          //     ...commonOptimizeDeps,
          //   ],
          //   exclude: [
          //     'servite/client',
          //     'virtual:servite-dist',
          //     'virtual:servite',
          //   ],
          // },
          // ssr: {
          //   optimizeDeps: {
          //     disabled: 'build',
          //     include: [
          //       'react',
          //       'react/jsx-runtime',
          //       'react/jsx-dev-runtime',
          //       'react-dom/server',
          //       'servite > react-router-dom',
          //       'servite > react-helmet-async',
          //       ...commonOptimizeDeps,
          //     ],
          //   },
          // },
          build: {
            commonjsOptions: {
              include: [
                /react/,
                /react-dom/,
                /scheduler/,
                /prop-types/,
                /shallowequal/,
                /invariant/,
                /object-assign/,
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
    ...serviteJsx({ serviteConfig }),
    ...servitePages({ serviteConfig }),
    ...serviteNitro({ serviteConfig }),
  ];

  return plugins;
}

export default servite;
