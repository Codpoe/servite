import { CompatibilityEvent, EventHandler, getHeader, getQuery } from 'h3';
import { joinURL } from 'ufo';
import { matchPath } from 'react-router-dom';
import type {
  SSRContext,
  SSRData,
  SSREntry,
  SSREntryRenderContext,
} from '../shared.js';
import { renderPreloadLink, trapConsole } from './utils.js';
import { getViteDevServer } from './vite-dev-server.js';
import {
  defineRenderHandler,
  useRuntimeConfig,
  useStorage,
} from '#internal/nitro';

const isDev = process.env.NODE_ENV === 'development';

// eslint-disable-next-line react-hooks/rules-of-hooks
const storage = useStorage();

export default <EventHandler>defineRenderHandler(async event => {
  const url = event.req.url!;
  const { pathname } = new URL(url);

  const ssrContext: SSRContext = {
    event,
    url,
    pathname,
    noSSR: isNoSSR(event, pathname),
  };

  const ssrEntry = await loadSSREntry();

  const [template, { appHtml, renderContext }, preloadLinks] =
    await Promise.all([
      loadTemplate(ssrContext),
      renderAppHtml(ssrContext, ssrEntry),
      renderPreloadLinks(ssrContext, ssrEntry),
    ]);

  const fullHtml = renderFullHtml(ssrContext, {
    template,
    appHtml,
    renderContext,
    preloadLinks,
  });

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

function isNoSSR(event: CompatibilityEvent, pathname: string): boolean {
  const noSSR = Boolean(
    getQuery(event)['servite-no-ssr'] ||
      getHeader(event, 'x-servite-no-ssr') ||
      process.env.SERVITE_NO_SSR
  );

  if (noSSR) {
    return noSSR;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const runtimeConfig = useRuntimeConfig();
  const baseURL: string = runtimeConfig.app.baseURL;
  const ssr: boolean | string[] = runtimeConfig.serviteConfig.ssr;

  // boolean
  if (typeof ssr === 'boolean') {
    return !ssr;
  }

  // path array
  return ssr.every(item => joinURL(baseURL, item) !== pathname);
}

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

  return import('#servite/prod-ssr-entry');
}

let _prodAppHtml: string | undefined;

async function loadTemplate(ssrContext: SSRContext) {
  let template = '';

  if (isDev) {
    const viteDevServer = await getViteDevServer();
    template = await storage.getItem('root/node_modules/.servite/index.html');

    if (viteDevServer) {
      template = await viteDevServer.transformIndexHtml(
        '/node_modules/.servite/index.html',
        template,
        ssrContext.url
      );
    }
  } else {
    if (!_prodAppHtml) {
      _prodAppHtml = await storage.getItem('/assets/servite/index.html');
    }
    template = _prodAppHtml!;
  }

  return template;
}

async function renderAppHtml(
  ssrContext: SSRContext,
  ssrEntry: SSREntry
): Promise<{
  appHtml: string;
  renderContext?: SSREntryRenderContext;
}> {
  if (ssrContext.noSSR) {
    return {
      appHtml: '',
    };
  }

  const renderContext: SSREntryRenderContext = {
    ssrContext,
    helmetContext: {},
  };

  // Disable console while rendering in production
  const recoverConsole = isDev ? undefined : trapConsole();
  const appHtml = await ssrEntry.render(renderContext);
  recoverConsole?.();

  return {
    appHtml,
    renderContext,
  };
}

let _ssrManifestJson: Record<string, string[]> | undefined;

async function renderPreloadLinks(
  ssrContext: SSRContext,
  ssrEntry: SSREntry
): Promise<string> {
  if (isDev) {
    return '';
  }

  const page = ssrEntry.pages.find(p =>
    matchPath(p.routePath, ssrContext.pathname)
  );

  if (!page) {
    return '';
  }

  if (!_ssrManifestJson) {
    _ssrManifestJson = await storage.getItem(
      '/assets/servite/ssr-manifest.json'
    );
  }

  return (_ssrManifestJson![page.filePath] || [])
    .map(renderPreloadLink)
    .filter(Boolean)
    .join('\n    ');
}

interface RenderFullHtmlOptions {
  template: string;
  appHtml: string;
  preloadLinks: string;
  renderContext?: SSREntryRenderContext;
}

function renderFullHtml(
  ssrContext: SSRContext,
  { template, appHtml, preloadLinks, renderContext }: RenderFullHtmlOptions
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
  } = renderContext?.helmetContext?.helmet || {};

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

  const headTags = [title, priority, meta, link, script, style, preloadLinks]
    .map(x => x?.toString())
    .filter(Boolean)
    .join('\n    ');

  if (headTags) {
    template = template.replace('</head>', `  ${headTags}\n  </head>`);
  }

  const ssrData: SSRData = {
    context: {
      url: ssrContext.url,
      pathname: ssrContext.pathname,
      noSSR: ssrContext.noSSR,
    },
    serverRendered: Boolean(appHtml),
    loaderData: renderContext?.loaderData,
  };

  template = template.replace(
    '<div id="root"></div>',
    `<script>window.__SSR_DATA__ = ${JSON.stringify(ssrData)}</script>
    <div id="root" data-server-rendered="${
      ssrData.serverRendered
    }">${appHtml}</div>`
  );

  return template;
}
