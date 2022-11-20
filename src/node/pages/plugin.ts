import path from 'upath';
import fs from 'fs-extra';
import {
  HmrContext,
  ModuleNode,
  Plugin,
  ResolvedConfig,
  ViteDevServer,
} from 'vite';
import { Page } from '../../shared/types.js';
import {
  CUSTOM_SERVER_RENDER_MODULE_ID,
  PAGES_IGNORE_PATTERN,
  PAGES_MODULE_ID,
  PAGES_PATTERN,
  PAGES_ROUTES_MODULE_ID,
  RESOLVED_CUSTOM_SERVER_RENDER_MODULE_ID,
  RESOLVED_PAGES_MODULE_ID,
  RESOLVED_PAGES_ROUTES_MODULE_ID,
  SCRIPT_EXTS,
} from '../constants.js';
import { ServiteConfig } from '../types.js';
import { shallowCompare } from '../utils.js';
import { PagesManager, parsePageMeta } from './manager.js';

export interface ServitePagesPluginConfig {
  serviteConfig: ServiteConfig;
}

export function servitePages({
  serviteConfig,
}: ServitePagesPluginConfig): Plugin {
  let viteConfig: ResolvedConfig;
  let viteDevServer: ViteDevServer;
  let pagesManager: PagesManager;

  function getPagesAndRoutesModules() {
    return [
      ...(viteDevServer.moduleGraph.getModulesByFile(
        RESOLVED_PAGES_MODULE_ID
      ) || []),
      ...(viteDevServer.moduleGraph.getModulesByFile(
        RESOLVED_PAGES_ROUTES_MODULE_ID
      ) || []),
    ];
  }

  return {
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
    configResolved(config) {
      viteConfig = config;
      pagesManager = new PagesManager(config, serviteConfig);
    },
    configureServer(server) {
      viteDevServer = server;

      server.watcher.on('unlink', async filePath => {
        const { isPageFile } = await pagesManager.checkPageFile(filePath);

        if (isPageFile) {
          const seen = new Set<ModuleNode>();

          getPagesAndRoutesModules().forEach(mod => {
            viteDevServer.moduleGraph.invalidateModule(mod, seen);
          });
          pagesManager.reload();
        }
      });
    },
    resolveId(source) {
      if (source === PAGES_MODULE_ID) {
        return RESOLVED_PAGES_MODULE_ID;
      }
      if (source === PAGES_ROUTES_MODULE_ID) {
        return RESOLVED_PAGES_ROUTES_MODULE_ID;
      }
      if (source === CUSTOM_SERVER_RENDER_MODULE_ID) {
        return RESOLVED_CUSTOM_SERVER_RENDER_MODULE_ID;
      }
    },
    async load(id) {
      if (id === RESOLVED_PAGES_MODULE_ID) {
        return pagesManager.generatePagesCode();
      }
      if (id === RESOLVED_PAGES_ROUTES_MODULE_ID) {
        return pagesManager.generatePagesRoutesCode();
      }
      if (id === RESOLVED_CUSTOM_SERVER_RENDER_MODULE_ID) {
        const customServerRenderFile = findServerRender(
          viteConfig.root,
          serviteConfig.pagesDirs[0].dir
        );

        if (customServerRenderFile) {
          return `export { render } from '/@fs/${customServerRenderFile}';`;
        }
        return `export const render = undefined;`;
      }
    },
    async transform(code, id) {
      // export will affect @vitejs/plugin-react's judgment of react refresh boundary,
      // so we need to handle hmr for specific export.
      // https://github.com/vitejs/vite/blob/9baa70b788ec0b0fc419db30d627567242c6af7d/packages/plugin-react/src/fast-refresh.ts#L87
      const { isPageFile } = await pagesManager.checkPageFile(id);
      if (isPageFile) {
        return addHmrAccept(code, 'loader');
      }
    },
    async handleHotUpdate(ctx) {
      const { isPageFile, existingPage } = await pagesManager.checkPageFile(
        ctx.file
      );

      if (
        isPageFile &&
        (!existingPage || (await isPageMetaUpdated(existingPage, ctx)))
      ) {
        const modules = [...ctx.modules];
        modules.push(...getPagesAndRoutesModules());
        pagesManager.reload();

        return modules;
      }
    },
    api: {
      getPages: () => pagesManager.getPages(),
    } as any,
  };
}

function addHmrAccept(code: string, field: string) {
  if (
    !code.includes('import.meta.hot.accept()') &&
    (new RegExp(`export\\s+const\\s+${field}(\\s|=|:)`).test(code) ||
      new RegExp(`export\\s+(async\\s+)?function\\s+${field}(\\s|\\()`).test(
        code
      ))
  ) {
    return `${code}\n
if (import.meta.hot) {
  const prevField = import.meta.hot.data.${field} = import.meta.hot.data.${field} || ${field};

  import.meta.hot.accept(mod => {
    if (mod) {
      const field = mod.${field};
      if (field?.toString() !== prevField?.toString() || JSON.stringify(field) !== JSON.stringify(prevField)) {
        import.meta.hot.invalidate();
      }
    }
  });
}
`;
  }

  return code;
}

async function isPageMetaUpdated(page: Page, hmrCtx: HmrContext) {
  const newMeta = await parsePageMeta(hmrCtx.file, await hmrCtx.read());
  return !shallowCompare(page.meta, newMeta);
}

function findServerRender(root: string, dir: string) {
  for (const ext of SCRIPT_EXTS) {
    const serverRenderFile = path.resolve(root, dir, `server-render${ext}`);
    if (fs.existsSync(serverRenderFile)) {
      return serverRenderFile;
    }
  }
}
