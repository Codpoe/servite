import { H3Event, EventHandler, getHeader, getQuery } from 'h3';
import { joinURL, parseURL } from 'ufo';
import { RouteMatch } from 'react-router-dom';
import LZString from 'lz-string';
import {
  Island,
  Route,
  SSRContext,
  SSRData,
  SSREntry,
  SSREntryRenderContext,
  SSREntryRenderResult,
} from '../../shared/types.js';
import { wrapViteId } from '../../shared/utils.js';
import { FS_PREFIX_CLIENT_ENTRY } from '../../shared/constants.js';
import islandsHydrateCode from '../../prebuild/islands-hydrate.prebuilt.js';
import ssrStylesCleanerCode from '../../prebuild/ssr-styles-cleaner.prebuilt.js';
import {
  renderIslandsCode,
  renderPreloadLink,
  renderScript,
  trapConsole,
} from './utils.js';
import { collectRoutesStyles, getViteDevServer } from './vite.js';
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
  const { pathname } = parseURL(url);

  const ssrContext: SSRContext = {
    event,
    url,
    pathname,
    noSSR: isNoSSR(event, pathname),
  };

  const ssrEntry = await loadSSREntry();

  const [template, { renderResult, renderContext }] = await Promise.all([
    loadTemplate(ssrContext),
    renderAppHtml(ssrContext, ssrEntry),
  ]);

  const fullHtml = await renderFullHtml(ssrContext, {
    template,
    renderResult,
    renderContext,
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

function isNoSSR(event: H3Event, pathname: string): boolean {
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
  renderResult: SSREntryRenderResult;
  renderContext?: SSREntryRenderContext;
}> {
  if (ssrContext.noSSR) {
    return {
      renderResult: { appHtml: '' },
    };
  }

  const renderContext: SSREntryRenderContext = {
    ssrContext,
    helmetContext: {},
  };

  // Disable console while rendering in production
  const recoverConsole = isDev ? undefined : trapConsole();
  const renderResult = await ssrEntry.render(renderContext);
  recoverConsole?.();

  return {
    renderResult,
    renderContext,
  };
}

let _ssrManifestJson: Record<string, string[]> | undefined;

async function renderAssets(
  ssrContext: SSRContext,
  routeMatches: RouteMatch[],
  hasIslandsScript: boolean
): Promise<string> {
  if (ssrContext.noSSR) {
    return '';
  }

  if (!routeMatches.length) {
    return '';
  }

  if (isDev) {
    const devAssets = hasIslandsScript
      ? []
      : [renderScript({ type: 'module', src: FS_PREFIX_CLIENT_ENTRY })]; // inject spa client entry

    // Collect routes styles to avoid FOUC
    const { styleCodeMap, styleUrls } = await collectRoutesStyles(routeMatches);

    styleCodeMap.forEach((code, url) => {
      // Vite handles HMR for styles injected as scripts
      devAssets.push(`<script type="module" src="${url}"></script>`);
      // - We still want to inject the styles to avoid FOUC.
      // - The `ssr` attribute will be used by ssr-styles-cleaner
      //   to determine whether a style element is injected in ssr
      devAssets.push(`<style ssr>\n${code}\n</style>`);
    });

    styleUrls.forEach(url => {
      devAssets.push(renderPreloadLink(url));
    });

    if (styleCodeMap.size || styleUrls.size) {
      devAssets.push(renderScript({ children: ssrStylesCleanerCode }));
    }

    return devAssets.filter(Boolean).join('\n    ');
  }

  if (!_ssrManifestJson) {
    _ssrManifestJson = await storage.getItem(
      '/assets/servite/ssr-manifest.json'
    );
  }

  return routeMatches
    .flatMap(m => {
      const route = m.route as Route;
      return (_ssrManifestJson?.[route.filePath] || []).map(link =>
        hasIslandsScript && link.endsWith('.js') ? '' : renderPreloadLink(link)
      );
    })
    .filter(Boolean)
    .join('\n    ');
}

function renderIslandsScript(islands?: Island[]) {
  if (!islands?.length) {
    return '';
  }

  const islandsCode = renderIslandsCode(islands);
  const compressed = LZString.compressToEncodedURIComponent(islandsCode);

  return `${renderScript({ children: islandsHydrateCode })}
${renderScript({
  type: 'module',
  src: wrapViteId(`virtual:servite/islands/${compressed}`),
})}`;
}

interface RenderFullHtmlOptions {
  template: string;
  renderResult: SSREntryRenderResult;
  renderContext?: SSREntryRenderContext;
}

async function renderFullHtml(
  ssrContext: SSRContext,
  { template, renderResult, renderContext }: RenderFullHtmlOptions
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

  const htmlAttrs = htmlAttributes?.toString() || '';

  if (htmlAttrs) {
    template = template.replace('<html', `<html ${htmlAttrs}`);
  }

  const bodyAttrs = bodyAttributes?.toString();

  if (bodyAttrs) {
    template = template.replace('<body', `<body ${bodyAttrs}`);
  }

  // Islands
  const islandsScript = renderIslandsScript(renderContext?.islands);

  // Assets
  const assets = await renderAssets(
    ssrContext,
    renderContext?.routeMatches || [],
    Boolean(islandsScript)
  );

  const headTags = [
    title,
    priority,
    meta,
    link,
    script,
    style,
    assets,
    islandsScript,
    renderResult.headTags,
  ]
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
    serverRendered: Boolean(renderResult.appHtml),
    loaderData: renderContext?.loaderData,
  };

  template = template.replace(
    '<div id="root"></div>',
    `<script>window.__SERVITE__ssrData = ${JSON.stringify(ssrData)}</script>
    <div id="root" data-server-rendered="${ssrData.serverRendered}">${
      renderResult.appHtml
    }</div>`
  );

  return template;
}
