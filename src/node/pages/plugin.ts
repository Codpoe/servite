import path from 'upath';
import { ModuleNode, Plugin, ViteDevServer } from 'vite';
import {
  PAGES_IGNORE_PATTERN,
  PAGES_MODULE_ID,
  PAGES_PATTERN,
  PAGES_ROUTES_MODULE_ID,
  RESOLVED_PAGES_MODULE_ID,
  RESOLVED_PAGES_ROUTES_MODULE_ID,
} from '../constants.js';
import { ServiteConfig } from '../types.js';
import { PagesManager } from './manager.js';

export interface ServitePagesPluginConfig {
  serviteConfig: ServiteConfig;
}

export function servitePages({
  serviteConfig,
}: ServitePagesPluginConfig): Plugin {
  let viteDevServer: ViteDevServer;
  let pagesManager: PagesManager;

  function getPagesAndRoutesModules() {
    return [
      ...(viteDevServer.moduleGraph.getModulesByFile(PAGES_MODULE_ID) || []),
      ...(viteDevServer.moduleGraph.getModulesByFile(PAGES_ROUTES_MODULE_ID) ||
        []),
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
    },
    async load(id) {
      if (id === RESOLVED_PAGES_MODULE_ID) {
        return pagesManager.generatePagesCode();
      }
      if (id === RESOLVED_PAGES_ROUTES_MODULE_ID) {
        return pagesManager.generatePagesRoutesCode();
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
      const { isPageFile, isExisting } = await pagesManager.checkPageFile(
        ctx.file
      );

      if (isPageFile && !isExisting) {
        const modules = [...ctx.modules];
        modules.push(...getPagesAndRoutesModules());
        pagesManager.reload();

        return modules;
      }
    },
    api: {
      getPages: () => pagesManager.getPages(),
    },
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
