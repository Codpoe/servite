import path from 'upath';
import { PluginOption } from 'vite';
import fg from 'fast-glob';
import { CLIENT_DIR, DIST_DIR, PKG_DIR } from './constants.js';
import { serviteHtml } from './html/plugin.js';
import { serviteJsx } from './jsx/plugin.js';
import { servitePages } from './pages/plugin.js';
import { serviteNitro } from './nitro/plugin.js';
import { resolveServiteConfig } from './config.js';
import { UserServiteConfig } from './types.js';

const commonOptimizeDeps: string[] = [
  'servite > react-helmet-async > prop-types',
  'servite > react-helmet-async > react-fast-compare',
  'servite > react-helmet-async > invariant',
  'servite > react-helmet-async > shallowequal',
  'servite > nprogress',
];

export function servite(userServiteConfig?: UserServiteConfig): PluginOption[] {
  const serviteConfig = resolveServiteConfig(userServiteConfig);

  const plugins: PluginOption[] = [
    {
      name: 'servite',
      enforce: 'pre',
      async config() {
        return {
          resolve: {
            alias: {
              'virtual:servite-dist': DIST_DIR,
            },
            // Some packages (eg. invariant) will have abnormal situations in optimizeDeps,
            // so here we set browserField: false and manually declare mainFields instead
            mainFields: ['browser', 'module', 'jsnext:main', 'jsnext'],
            browserField: false,
          },
          optimizeDeps: {
            include: [
              'react',
              'react/jsx-runtime',
              'react/jsx-dev-runtime',
              'react-dom',
              'react-dom/client',
              'servite > react-router-dom',
              'servite > react-helmet-async',
              'servite > ofetch',
              ...commonOptimizeDeps,
            ],
            exclude: [
              'servite/client',
              'virtual:servite-dist',
              'virtual:servite',
            ],
          },
          ssr: {
            optimizeDeps: {
              disabled: 'build',
              include: commonOptimizeDeps,
            },
            noExternal: ['servite'],
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
    servitePages({ serviteConfig }),
    ...serviteNitro({ serviteConfig }),
  ];

  return plugins;
}

export default servite;
