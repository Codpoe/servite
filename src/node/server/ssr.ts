import path from 'upath';
import fs from 'fs-extra';
import type { ViteDevServer } from 'vite';
import type { FilledContext } from 'react-helmet-async';
import { matchPath } from 'react-router-dom';
import { Page, ServerEntryExports, ServerEntryRender } from '../types.js';
import { APP_HTML_FILE, FS_PREFIX_APP_HTML } from '../constants.js';

const isProd = process.env.NODE_ENV === 'production';

export interface SSRConfig {
  pathname: string;
  originalUrl?: string;
  viteDevServer?: ViteDevServer;
  resolve: (...paths: string[]) => string;
}

export async function ssr(config: SSRConfig): Promise<string | undefined> {
  const { resolve, viteDevServer } = config;

  if (!isProd && !viteDevServer) {
    throw new Error('[servite] must provide viteDevServer in development');
  }

  // TODO: exist ssg html, return directly

  const serverEntry = isProd
    ? resolve('server/entry.server.js')
    : resolve('client/app/entry.server.js');

  // server module should be fresh in every request
  // to avoid rendering out-of-date content that fails to hydrate
  if (!isProd && viteDevServer) {
    invalidateServerEntryModules(viteDevServer, serverEntry);
  }

  const { render, pages } = (
    isProd
      ? await import(serverEntry)
      : await viteDevServer!.ssrLoadModule(serverEntry, { fixStacktrace: true })
  ) as ServerEntryExports;

  const [template, { appHtml, helmetContext }, preloadLinks] =
    await Promise.all([
      loadTemplate(config),
      renderAppHtml(config, render),
      renderPreloadLinks(config, pages),
    ]);

  return renderFullHtml(template, appHtml, helmetContext, preloadLinks);
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

async function loadTemplate(config: SSRConfig) {
  const { resolve, viteDevServer, originalUrl } = config;
  let template = '';

  if (isProd) {
    // prod
    const htmlPath = resolve('index.html');
    // TODO: cache
    template = await fs.readFile(htmlPath, 'utf-8');
  } else {
    // dev
    template = await fs.readFile(APP_HTML_FILE, 'utf-8');

    if (viteDevServer) {
      template = await viteDevServer.transformIndexHtml(
        FS_PREFIX_APP_HTML,
        template,
        originalUrl
      );
    }
  }

  return template;
}

async function renderAppHtml(config: SSRConfig, render: ServerEntryRender) {
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

async function renderPreloadLinks(
  config: SSRConfig,
  pages: Page[]
): Promise<string> {
  if (!isProd) {
    return '';
  }

  const { pathname, resolve } = config;
  const page = pages.find(p => matchPath(p.routePath, pathname));

  if (!page) {
    return '';
  }

  // TODO: cache
  const ssrManifest: Record<string, string[]> = JSON.parse(
    await fs.readFile(resolve('ssr-manifest.json'), 'utf-8')
  );

  return (ssrManifest[page.filePath] || [])
    .map(renderPreloadLink)
    .filter(Boolean)
    .join('\n    ');
}

function renderFullHtml(
  template: string,
  appHtml: string,
  helmetContext: Partial<FilledContext>,
  preloadLinks: string
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

  const headTags =
    [title, priority, meta, link, script, style]
      .map(x => x?.toString())
      .filter(Boolean)
      .join('\n    ') +
    '\n    ' +
    preloadLinks;

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

function renderPreloadLink(link: string): string {
  switch (path.extname(link)) {
    case '.js':
      return `<link rel="modulepreload" crossorigin href="${link}">`;
    case '.css':
      return `<link rel="stylesheet" href="${link}">`;
    case '.jpg':
    case '.jpeg':
      return ` <link rel="preload" href="${link}" as="image" type="image/jpeg">`;
    case '.png':
      return ` <link rel="preload" href="${link}" as="image" type="image/png">`;
    case '.gif':
      return ` <link rel="preload" href="${link}" as="image" type="image/gif">`;
    case '.woff':
      return ` <link rel="preload" href="${link}" as="font" type="font/woff" crossorigin>`;
    case '.woff2':
      return ` <link rel="preload" href="${link}" as="font" type="font/woff2" crossorigin>`;
    default:
      return '';
  }
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
