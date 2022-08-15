import { parse } from 'url';
import path from 'path';
import type { EventHandler } from 'h3';
import { matchPath } from 'react-router-dom';
import type { SSREntry, SSREntryRenderContext } from '../types.js';
import { getViteDevServer } from './vite-dev-server.js';
import { defineRenderHandler, useStorage } from '#internal/nitro';

const isDev = process.env.NODE_ENV === 'development';

// eslint-disable-next-line react-hooks/rules-of-hooks
const storage = useStorage();

export default <EventHandler>defineRenderHandler(async event => {
  const url = event.req.originalUrl || event.req.url!;
  const pathname = parse(url).pathname!;

  const ssrEntry = await loadSSREntry();

  const [template, { appHtml, context }, preloadLinks] = await Promise.all([
    loadTemplate(url),
    renderAppHtml(ssrEntry, pathname),
    renderPreloadLinks(ssrEntry, pathname),
  ]);

  const fullHtml = renderFullHtml(template, appHtml, context, preloadLinks);

  return {
    body: fullHtml,
    statusCode: event.res.statusCode,
    statusMessage: event.res.statusMessage,
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'X-Powered-By': 'servite',
    },
  };
});

async function loadSSREntry() {
  if (isDev) {
    const viteDevServer = await getViteDevServer();
    const resolved = await viteDevServer.pluginContainer.resolveId(
      'servite/dev-ssr-entry',
      undefined,
      {
        ssr: true,
      }
    );

    if (!resolved) {
      throw new Error(
        '[servite] Failed to resolve module: servite/dev-ssr-entry'
      );
    }

    // Ensure refresh module for hydrate correctly
    viteDevServer.moduleGraph.invalidateAll();

    return (await viteDevServer.ssrLoadModule(resolved.id)) as SSREntry;
  }

  // TODO: load prod ssr entry
  return {
    render: () => '',
    pages: [],
  } as any as SSREntry;
}

let _prodAppHtml: string | undefined;

async function loadTemplate(url: string) {
  let template = '';

  if (isDev) {
    const viteDevServer = await getViteDevServer();
    template = await storage.getItem('servite-dist/client/app/index.html');

    if (viteDevServer) {
      template = await viteDevServer.transformIndexHtml(
        '/node_modules/servite/dist/client/app/index.html',
        template,
        url
      );
    }
  } else {
    if (!_prodAppHtml) {
      _prodAppHtml = await storage.getItem('build/index.html');
    }
    template = _prodAppHtml!;
  }

  return template;
}

async function renderAppHtml(ssrEntry: SSREntry, pathname: string) {
  const context: SSREntryRenderContext = {
    helmetContext: {},
  };

  // Disable console while rendering in production
  const recoverConsole = isDev ? undefined : trapConsole();
  const appHtml = await ssrEntry.render(pathname, context);
  recoverConsole?.();

  return {
    appHtml,
    context,
  };
}

let _ssrManifestJson: Record<string, string[]> | undefined;

async function renderPreloadLinks(
  ssrEntry: SSREntry,
  pathname: string
): Promise<string> {
  if (isDev) {
    return '';
  }

  const page = ssrEntry.pages.find(p => matchPath(p.routePath, pathname));

  if (!page) {
    return '';
  }

  if (!_ssrManifestJson) {
    _ssrManifestJson = JSON.parse(
      await storage.getItem('build/ssr-manifest.json')
    );
  }

  return (_ssrManifestJson![page.filePath] || [])
    .map(renderPreloadLink)
    .filter(Boolean)
    .join('\n    ');
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

function renderFullHtml(
  template: string,
  appHtml: string,
  context: SSREntryRenderContext,
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
  } = context.helmetContext.helmet || {};

  let htmlAttrs = htmlAttributes?.toString() || '';

  // Add hidden attribute to wait for style ready while dev
  if (isDev) {
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
    loaderData: context.loaderData,
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
