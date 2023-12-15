import path from 'upath';
import { createServer, type ModuleNode } from 'vite';
import type { RouteMatch } from 'react-router-dom';
import type { SSRContext, SSREntry } from '../../shared/types.js';
import { lazyCachedFn } from './utils.js';
import { useRuntimeConfig, useStorage } from '#internal/nitro';

const isDev = process.env.NODE_ENV === 'development';
// eslint-disable-next-line react-hooks/rules-of-hooks
const storage = useStorage();

const crawlFileUrlRE = /\.(js|jsx|ts|tsx|md|mdx)($|\?)/;
const styleUrlRE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss)($|\?)/;

export const getViteDevServer = lazyCachedFn(async () => {
  const viteDevServer = await createServer({
    ...useRuntimeConfig()?.viteDevServerConfig,
    appType: 'custom',
    server: {
      middlewareMode: true,
    },
    // logLevel: 'warn',
    optimizeDeps: {
      disabled: true,
    },
    plugins: [
      {
        name: 'servite:no-hmr',
        configureServer(server) {
          // parent vite server is already sending HMR updates
          // do not send duplicate HMR updates from child server
          // which log confusing "page reloaded" messages that aren't true
          // Override ws.send
          server.ws.send = () => {};
        },
      },
    ],
  });

  return viteDevServer;
});

export async function viteLog(msg: string) {
  if (isDev) {
    (await getViteDevServer()).config.logger.info(msg, { timestamp: true });
  }
}

export async function loadSSREntry() {
  if (isDev) {
    const viteDevServer = await getViteDevServer();

    const resolved = await viteDevServer.pluginContainer.resolveId(
      'virtual:servite-dist/client/app/entry.server.js',
      undefined,
      {
        ssr: true,
      }
    );

    if (!resolved) {
      throw new Error(
        '[servite] Failed to resolve module: virtual:servite-dist/client/app/entry.server.js'
      );
    }

    // Ensure refresh module for hydrate correctly
    viteDevServer.moduleGraph.invalidateAll();
    return (await viteDevServer.ssrLoadModule(resolved.id)) as SSREntry;
  }

  return import('virtual:servite/prod-ssr-entry');
}

export async function loadTemplate(ssrContext: SSRContext) {
  let template = '';

  if (isDev) {
    const viteDevServer = await getViteDevServer();

    template = await viteDevServer.transformIndexHtml(
      '/node_modules/.servite/index.html',
      // Nitro will mount `root` fs storage in dev,
      // so we can get files from `root`
      (await storage.getItem<string>('root/node_modules/.servite/index.html'))!,
      ssrContext.url
    );
  } else {
    template ||= (await storage.getItem<string>('assets/servite/index.html'))!;
  }

  return template;
}

export interface CollectedStyle {
  id?: string;
  url: string;
  code?: string;
}

/**
 * Collect routes styles to avoid FOUC
 */
export async function collectRoutesStyles(routeMatches: RouteMatch[]) {
  const styles: CollectedStyle[] = [];
  const seen = new Set<string>();
  const viteDevServer = await getViteDevServer();

  function collect(mod: ModuleNode) {
    if (!mod?.url || seen.has(mod.url)) {
      return;
    }

    seen.add(mod.url);

    if (styleUrlRE.test(mod.url)) {
      const defaultExport = mod.ssrModule?.default;

      styles.push({
        id: mod.id || undefined,
        url: mod.url,
        code: typeof defaultExport === 'string' ? defaultExport : undefined,
      });

      return;
    }

    if (crawlFileUrlRE.test(mod.url)) {
      mod.importedModules.forEach(collect);
    }
  }

  for (const m of routeMatches) {
    const filePath = (m.route.handle || m.route).filePath;

    if (!filePath) {
      continue;
    }

    const pageFile = path.resolve(viteDevServer.config.root, filePath);

    // call `ssrLoadModule` here to ensure moduleGraph is complete
    await viteDevServer.ssrLoadModule(pageFile);
    const pageModule = await viteDevServer.moduleGraph.getModuleById(pageFile);

    if (pageModule) {
      collect(pageModule);
    }
  }

  return styles;
}
