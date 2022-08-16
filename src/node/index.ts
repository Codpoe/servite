import path from 'upath';
import fs from 'fs-extra';
import { Plugin } from 'vite';
import { servitePages } from './pages/plugin.js';
import { serviteNitro } from './nitro/plugin.js';
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

  const plugins: Plugin[] = [
    {
      name: 'servite',
      enforce: 'pre',
      async config(config) {
        const root = path.resolve(config.root || '');
        const input = path.resolve(root, 'node_modules/.servite/index.html');

        await fs.copy(APP_HTML_FILE, input);

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
              input,
            },
          },
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
    {
      name: 'servite:html-filename',
      enforce: 'post',
      async generateBundle(_options, bundle) {
        Object.values(bundle).forEach(chunk => {
          if (
            chunk.type === 'asset' &&
            chunk.fileName === 'node_modules/.servite/index.html'
          ) {
            chunk.fileName = 'index.html';
          }
        });
      },
    },
    servitePages(),
    serviteNitro({ serviteConfig }),
  ];

  return plugins;
}

export default servite;
