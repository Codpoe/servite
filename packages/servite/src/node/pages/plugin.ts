import { isMainThread } from 'worker_threads';
import { createRequire } from 'module';
import path from 'upath';
import fs from 'fs-extra';
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import { init as initEsModuleLexer } from 'es-module-lexer';
import {
  CUSTOM_SERVER_RENDER_MODULE_ID,
  PAGES_DATA_MODULE_ID,
  PAGES_IGNORE_PATTERN,
  PAGES_MODULE_ID,
  PAGES_PATTERN,
  PAGES_ROUTES_MODULE_ID,
  REACT_REFRESH_MODULE_ID,
  RESOLVED_CUSTOM_SERVER_RENDER_MODULE_ID,
  RESOLVED_PAGES_MODULE_ID,
  RESOLVED_PAGES_ROUTES_MODULE_ID,
  SCRIPT_EXTS,
} from '../constants.js';
import type { ServiteConfig } from '../types.js';
import { PagesManager } from './manager.js';

const _require = createRequire(import.meta.url);
const viteReactRequire = createRequire(
  _require.resolve('@vitejs/plugin-react')
);

const runtimePath = path.join(
  path.dirname(viteReactRequire.resolve('react-refresh')),
  'cjs/react-refresh-runtime.development.js'
);

const runtimeCode = `
const exports = {}
${fs.readFileSync(runtimePath, 'utf-8')}
${fs.readFileSync(_require.resolve('./refresh-utils.js'), 'utf-8')}
export default exports
`;

export interface ServitePagesPluginConfig {
  serviteConfig: ServiteConfig;
}

export function servitePages({
  serviteConfig,
}: ServitePagesPluginConfig): Plugin[] {
  let viteConfig: ResolvedConfig;
  let viteDevServer: ViteDevServer;
  let pagesManager: PagesManager;

  const plugins: Plugin[] = [
    {
      name: 'servite:pages',
      enforce: 'pre',
      config(config) {
        const root = path.resolve(config.root || '');

        const optimizeEntries = serviteConfig.pagesDirs.flatMap(
          ({ dir, ignore = [] }) => {
            const dirFromRoot = path.relative(root, path.resolve(root, dir));

            // ignore dir outside root
            if (dirFromRoot.startsWith('../')) {
              return [];
            }

            const positive = PAGES_PATTERN.map(p => `${dirFromRoot}/${p}`);
            // ignore pattern should prefix with '!'
            const negative = PAGES_IGNORE_PATTERN.concat(ignore).map(
              p => `!${dirFromRoot}/${p}`
            );

            return positive.concat(negative);
          }
        );

        return {
          optimizeDeps: {
            entries: optimizeEntries,
          },
        };
      },
      async configResolved(config) {
        viteConfig = config;
        await initEsModuleLexer;
      },
      configureServer(server) {
        viteDevServer = server;
      },
      buildStart() {
        pagesManager = new PagesManager(viteConfig, serviteConfig);
      },
      resolveId(source) {
        if (source === PAGES_MODULE_ID) {
          return RESOLVED_PAGES_MODULE_ID;
        }

        if (source === PAGES_ROUTES_MODULE_ID) {
          return RESOLVED_PAGES_ROUTES_MODULE_ID;
        }

        if (source === PAGES_DATA_MODULE_ID) {
          return PAGES_DATA_MODULE_ID;
        }

        if (source === CUSTOM_SERVER_RENDER_MODULE_ID) {
          return RESOLVED_CUSTOM_SERVER_RENDER_MODULE_ID;
        }
      },
      async load(id, opts) {
        if (id === RESOLVED_PAGES_MODULE_ID) {
          return pagesManager.generatePagesCode();
        }

        if (id === RESOLVED_PAGES_ROUTES_MODULE_ID) {
          return pagesManager.generatePagesRoutesCode();
        }

        if (id === PAGES_DATA_MODULE_ID) {
          // - ssr
          //   - server: bundle directly
          //   - client: use api
          // - csr：bundle directly
          return pagesManager.generatePagesDataCode(
            !serviteConfig.csr && !opts?.ssr
          );
        }

        if (id === RESOLVED_CUSTOM_SERVER_RENDER_MODULE_ID) {
          const customServerRenderFile = findServerRender(viteConfig.root);

          if (customServerRenderFile) {
            return `import render from '/@fs/${customServerRenderFile}';\nexport default render;`;
          }
          return `export default undefined;`;
        }
      },
      api: {
        /**
         * @deprecated use `api.getPagesManager` instead
         */
        getPages: () => pagesManager.getPages(),
        getPagesManager: () => pagesManager,
      } as any,
    },
  ];

  if (isMainThread) {
    plugins.push({
      name: 'servite:hmr',
      enforce: 'pre',
      configureServer(server) {
        // Trigger pages reload when a page file is removed
        server.watcher.on('unlink', async filePath => {
          if (pagesManager?.checkDataFile(filePath)) {
            const pagesDataModule =
              viteDevServer.moduleGraph.getModuleById(PAGES_DATA_MODULE_ID);

            if (pagesDataModule) {
              server.moduleGraph.invalidateModule(pagesDataModule);
            }

            pagesManager.reload();

            server.ws.send({
              type: 'full-reload',
            });
          }
        });
      },
      load: {
        order: 'pre',
        handler(id) {
          if (id === REACT_REFRESH_MODULE_ID) {
            return runtimeCode;
          }
        },
      },
      handleHotUpdate: {
        order: 'pre',
        handler(ctx) {
          if (pagesManager?.checkDataFile(ctx.file)) {
            const pagesDataModule =
              viteDevServer.moduleGraph.getModuleById(PAGES_DATA_MODULE_ID);

            if (pagesDataModule) {
              pagesManager.reload();

              ctx.server.ws.send({
                type: 'custom',
                event: 'servite:hmr',
                data: {
                  dataFilePath: path.relative(viteConfig.root, ctx.file),
                },
              });

              return ctx.modules.concat(pagesDataModule);
            }
          }
        },
      },
    });
  }

  return plugins;
}

function findServerRender(root: string) {
  for (const ext of SCRIPT_EXTS) {
    const serverRenderFile = path.resolve(root, `src/server-render${ext}`);
    if (fs.existsSync(serverRenderFile)) {
      return serverRenderFile;
    }
  }
}
