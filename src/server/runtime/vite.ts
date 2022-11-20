import path from 'upath';
import { createServer, type ModuleNode } from 'vite';
import { RouteMatch } from 'react-router-dom';
import { Route } from '../../shared/types.js';
import { lazyCachedFn } from './utils.js';
import { useRuntimeConfig } from '#internal/nitro';

const crawlFileUrlRE = /\.(js|jsx|ts|tsx|md|mdx)($|\?)/;
const styleUrlRE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss)($|\?)/;

export const getViteDevServer = lazyCachedFn(() => {
  return createServer({
    ...useRuntimeConfig()?.viteDevServerConfig,
    appType: 'custom',
    server: {
      middlewareMode: true,
    },
    logLevel: 'warn',
    optimizeDeps: {
      disabled: true,
    },
  });
});

/**
 * Collect routes styles to avoid FOUC
 */
export async function collectRoutesStyles(routeMatches: RouteMatch[]) {
  const styleCodeMap = new Map<string, string>();
  const styleUrls = new Set<string>();
  const seen = new Set<string>();
  const viteDevServer = await getViteDevServer();

  function collect(mod: ModuleNode) {
    if (!mod?.url || seen.has(mod.url)) {
      return;
    }

    seen.add(mod.url);

    if (styleUrlRE.test(mod.url)) {
      if (typeof mod.ssrModule?.default === 'string') {
        styleCodeMap.set(mod.url, mod.ssrModule.default);
      } else {
        styleUrls.add(mod.url);
      }

      return;
    }

    if (crawlFileUrlRE.test(mod.url)) {
      mod.importedModules.forEach(collect);
    }
  }

  for (const m of routeMatches) {
    const route = m.route as Route;
    const pageFile = path.resolve(viteDevServer.config.root, route.filePath);

    // call `ssrLoadModule` here to ensure moduleGraph is complete
    await viteDevServer.ssrLoadModule(pageFile);
    const pageModule = await viteDevServer.moduleGraph.getModuleById(pageFile);

    if (pageModule) {
      collect(pageModule);
    }
  }

  return {
    styleCodeMap,
    styleUrls,
  };
}
