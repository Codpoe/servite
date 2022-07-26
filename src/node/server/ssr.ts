import path from 'upath';
import fs from 'fs-extra';
import type { ViteDevServer } from 'vite';
import type { FilledContext } from 'react-helmet-async';
import type { Entry } from 'virtual:conventional-entries';
import type { PageData } from 'virtual:conventional-pages-data';

const isProd = process.env.NODE_ENV === 'production';

type EntryRender = (
  pathname: string,
  helmetContext: Record<string, unknown>
) => Promise<string>;

interface ServerEntryExports {
  render: EntryRender;
  entries: Entry[];
  pagesData: Record<string, PageData>;
}

export interface SSROptions {
  pathname: string;
  originalUrl?: string;
  viteDevServer?: ViteDevServer;
  resolve: (...paths: string[]) => string;
}

export async function ssr(config: SSROptions): Promise<string | undefined> {
  const { resolve, viteDevServer, pathname } = config;

  if (!isProd && !viteDevServer) {
    throw new Error('[servite] must provide viteDevServer in development');
  }

  const serverEntry = isProd
    ? resolve('server/entry.server.js')
    : resolve('client/app/entry.server.js');

  // server module should be fresh in every request
  // to avoid rendering out-of-date content that fails to hydrate
  if (!isProd && viteDevServer) {
    invalidateServerEntryModules(viteDevServer, serverEntry);
  }

  const { render, entries } = (
    isProd
      ? await import(serverEntry)
      : await viteDevServer!.ssrLoadModule(serverEntry, { fixStacktrace: true })
  ) as ServerEntryExports;

  const sortedEntries = entries
    .slice()
    .sort((a, b) => b.routePath.length - a.routePath.length);

  const entry = sortedEntries.find(x => pathname.startsWith(x.routePath));

  if (!entry) {
    return;
  }

  const [template, { appHtml, helmetContext }] = await Promise.all([
    loadTemplate(config, entry),
    renderAppHtml(config, render),
  ]);

  return renderFullHtml(template, appHtml, helmetContext);
}

function invalidateServerEntryModules(
  viteDevServer: ViteDevServer,
  serverEntry: string
) {
  const mods = viteDevServer.moduleGraph.getModulesByFile(serverEntry);

  if (mods) {
    mods.forEach(mod => {
      viteDevServer?.moduleGraph.invalidateModule(mod);

      if (mod.importedModules) {
        mod.importedModules.forEach(mod => {
          viteDevServer?.moduleGraph.invalidateModule(mod);
        });
      }
    });
  }
}

async function loadTemplate(config: SSROptions, entry: Entry) {
  const { resolve, viteDevServer, originalUrl } = config;
  let template = '';

  if (isProd) {
    // prod
    const htmlEndpoint = resolve(
      'client',
      entry.htmlPath.replace(/.*\.conventional-entries\/(.*)/, '$1')
    );

    if (fs.existsSync(htmlEndpoint)) {
      template = await fs.readFile(htmlEndpoint, 'utf-8');
    }
  } else {
    // dev
    template = await fs.readFile(entry.htmlPath, 'utf-8');

    if (viteDevServer) {
      const htmlRequestUrl = path.join(
        '/',
        path.relative(viteDevServer.config.root, entry.htmlPath)
      );

      template = await viteDevServer.transformIndexHtml(
        htmlRequestUrl,
        template,
        originalUrl
      );
    }
  }

  return template;
}

async function renderAppHtml(config: SSROptions, render: EntryRender) {
  const { pathname } = config;
  const helmetContext: Partial<FilledContext> = {};

  // disable console while rendering in production
  const recoverConsole = isProd ? trapConsole() : undefined;
  const appHtml = await render(pathname, helmetContext);
  recoverConsole?.();

  return {
    appHtml,
    helmetContext,
  };
}

function renderFullHtml(
  template: string,
  appHtml: string,
  helmetContext: Partial<FilledContext>
) {
  const {
    htmlAttributes,
    bodyAttributes,
    title,
    priority,
    meta,
    link,
    script,
    style,
  } = helmetContext.helmet || {};

  let htmlAttrs = htmlAttributes?.toString() || '';

  if (!isProd) {
    htmlAttrs += ' hidden';
  }

  if (htmlAttrs) {
    template = template.replace('<html', `<html ${htmlAttrs}`);
  }

  const bodyAttrs = bodyAttributes?.toString();

  if (bodyAttrs) {
    template = template.replace('<body', `<body ${bodyAttrs}`);
  }

  const headTags = [title, priority, meta, link, script, style]
    .map(x => x?.toString())
    .filter(Boolean)
    .join('\n    ');

  // TODO: inject preload links

  if (headTags) {
    template = template.replace('</head>', `  ${headTags}\n  </head>`);
  }

  const serverRendered = Boolean(appHtml);
  const ssrData = {
    context: {
      serverRendered,
    },
    prefetchData: {},
  };

  template = template.replace(
    '<div id="root"></div>',
    `<script>window.__SSR_DATA__ = ${JSON.stringify(ssrData)}</script>
    <div id="root" data-server-rendered="${serverRendered}">${appHtml}</div>`
  );

  return template;
}

/**
 * Disable console.log
 */
function trapConsole() {
  const consoleLog = global.console.log;
  global.console.log = (() => {
    // ...
  }) as any;

  return () => {
    global.console.log = consoleLog;
  };
}
