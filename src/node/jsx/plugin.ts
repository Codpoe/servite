import { PluginOption } from 'vite';
import viteReact from '@vitejs/plugin-react';
import LZString from 'lz-string';
import { ISLANDS_MODULE_ID_PREFIX, ISLAND_SPLITTER } from '../constants.js';
import { babelJsxIsland } from './babel.js';

export function serviteJsx(): PluginOption[] {
  return [
    {
      name: 'servite:jsx',
      transform(code, id, opts) {
        // @vitejs/plugin-react do not compile files in node_modules,
        // so we should compile them here.
        if (
          opts?.ssr &&
          id.includes('/node_modules/') &&
          id.includes('/servite/') &&
          /\.tsx?$/.test(id)
        ) {
          // TODO
        }
      },
    },
    {
      name: 'servite:islands',
      // If the module name is too long,
      // vite core plugin `vite:resolve` will throw resolve error,
      // so we should set enforce: 'pre' here
      // to resolve 'virtual:servite/islands/xxx' before vite:resolve
      enforce: 'pre',
      resolveId(source) {
        if (source.startsWith(ISLANDS_MODULE_ID_PREFIX)) {
          return source;
        }

        if (source.includes(ISLAND_SPLITTER)) {
          // eg. ./Comp.tsx__ISLAND__/Users/foo/projects/bar
          const [importee, importer] = source.split(ISLAND_SPLITTER);
          return this.resolve(importee, importer, { skipSelf: true });
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
    ...viteReact({
      jsxRuntime: 'automatic',
      jsxImportSource: 'virtual:servite-dist/jsx', // virtual:servite-dist/jsx/jsx-runtime
      babel(_id, opts) {
        return opts.ssr ? { plugins: [babelJsxIsland] } : {};
      },
    }),
  ];
}
