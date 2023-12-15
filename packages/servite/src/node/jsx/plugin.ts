import type { PluginOption } from 'vite';
import viteReact from '@vitejs/plugin-react';
import LZString from 'lz-string';
import {
  ISLANDS_MODULE_ID_PREFIX,
  ISLAND_SPLITTER,
  JSX_DIR,
} from '../constants.js';
import type { ServiteConfig } from '../types.js';
import { babelJsxIsland } from './babel.js';

export interface ServiteJsxPluginConfig {
  serviteConfig: ServiteConfig;
}

export function serviteJsx({
  serviteConfig,
}: ServiteJsxPluginConfig): PluginOption[] {
  const babel = serviteConfig.react?.babel;
  const islands = new Set<string>();

  return [
    // {
    //   name: 'servite:jsx',
    // },
    {
      name: 'servite:islands',
      // If the module name is too long,
      // vite core plugin `vite:resolve` will throw resolve error,
      // so we should set enforce: 'pre' here
      // to resolve 'virtual:servite/islands/xxx' before vite:resolve
      enforce: 'pre',
      async resolveId(source) {
        if (source.startsWith(ISLANDS_MODULE_ID_PREFIX)) {
          return source;
        }

        if (source.includes(ISLAND_SPLITTER)) {
          // eg. ./Comp.tsx__ISLAND__/Users/foo/projects/bar
          const [importee, importer] = source.split(ISLAND_SPLITTER);
          const resolved = await this.resolve(importee, importer, {
            skipSelf: true,
          });

          if (resolved?.id) {
            islands.add(resolved.id);
          }
          return resolved;
        }
      },
      async load(id) {
        if (id.startsWith(ISLANDS_MODULE_ID_PREFIX)) {
          const code =
            LZString.decompressFromEncodedURIComponent(
              id.slice(ISLANDS_MODULE_ID_PREFIX.length)
            ) || '';

          return code;
        }
      },
    },
    // {
    //   name: 'servite:islands-hmr',
    //   enforce: 'post',
    //   handleHotUpdate(ctx) {
    //     debugger;
    //     if (islands.size && !islands.has(ctx.file)) {
    //       ctx.server.ws.send({
    //         type: 'full-reload',
    //       });
    //       return [];
    //     }
    //   },
    // },
    ...viteReact({
      ...serviteConfig.react,
      include: /\.([tj]s|md)x?$/,
      jsxRuntime: 'automatic',
      jsxImportSource: JSX_DIR,
      babel(id, opts) {
        const babelOptions =
          typeof babel === 'function' ? babel(id, opts) : babel || {};

        return opts.ssr
          ? {
              ...babelOptions,
              plugins: [babelJsxIsland, ...(babelOptions?.plugins || [])],
            }
          : babelOptions;
      },
    }),
  ];
}
