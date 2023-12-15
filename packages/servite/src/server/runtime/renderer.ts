import {
  H3Event,
  type EventHandler,
  getHeader,
  getQuery,
  sendWebResponse,
} from 'h3';
import { parseURL } from 'ufo';
import { type RouteMatch } from 'react-router-dom';
import LZString from 'lz-string';
import colors from 'picocolors';
import type {
  Island,
  SSRContext,
  SSRData,
  SSREntry,
  SSREntryRenderContext,
  SSREntryRenderResult,
} from '../../shared/types.js';
import { wrapViteId } from '../../shared/utils.js';
import islandsHydrateCode from '../../prebuild/islands-hydrate.prebuilt.js';
import ssrStylesCleanerCode from '../../prebuild/ssr-styles-cleaner.prebuilt.js';
import {
  renderIslandsCode,
  renderPreloadLink,
  renderTag,
  trapConsole,
} from './utils.js';
import {
  collectRoutesStyles,
  loadSSREntry,
  loadTemplate,
  viteLog,
} from './vite.js';
import { queryRouteData } from './remix.js';
import {
  defineRenderHandler,
  useStorage,
  useRuntimeConfig,
} from '#internal/nitro';

const isDev = process.env.NODE_ENV === 'development';

// eslint-disable-next-line react-hooks/rules-of-hooks
const storage = useStorage();

export default <EventHandler>defineRenderHandler(async event => {
  const url = event.node.req.url!;
  const { pathname } = parseURL(url);

  const ssrContext: SSRContext = {
    event,
    url,
    pathname,
    noSSR: isNoSSR(event),
  };

  const ssrEntry = ssrContext.noSSR ? undefined : await loadSSREntry();

  if (ssrEntry && getQuery(event)._data) {
    sendWebResponse(event, await queryRouteData(event, ssrEntry));
    return {};
  }

  const { renderResult, renderContext } = await renderAppHtml(
    ssrContext,
    ssrEntry
  );

  // If react-router loader redirect or return Response,
  // `renderResult` here will be undefined,
  // we can skip the process
  if (!renderResult) {
    return {};
  }

  const fullHtml = await renderFullHtml(ssrContext, {
    renderResult,
    renderContext,
  });

  return {
    body: fullHtml,
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'X-Servite-Render': 'yes',
    },
  };
});

function isNoSSR(event: H3Event): boolean {
  const noSSR = Boolean(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useRuntimeConfig()?.serviteConfig?.csr ||
      getQuery(event)['servite-no-ssr'] ||
      getHeader(event, 'x-servite-no-ssr') ||
      process.env.SERVITE_NO_SSR
  );

  if (noSSR) {
    return noSSR;
  }

  return false;
}

interface RenderAppHtmlResult {
  renderResult?: SSREntryRenderResult;
  renderContext?: SSREntryRenderContext;
}

async function renderAppHtml(
  ssrContext: SSRContext,
  ssrEntry?: SSREntry
): Promise<RenderAppHtmlResult> {
  if (ssrContext.noSSR || !ssrEntry) {
    return {
      renderResult: { appHtml: '' },
    };
  }

  viteLog(colors.green('nitro ssr ') + colors.dim(ssrContext.url));

  const renderContext: SSREntryRenderContext = {
    ssrContext,
    helmetContext: {} as any,
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
  hasIslands: boolean
): Promise<string> {
  if (isDev) {
    const devAssets =
      // eslint-disable-next-line react-hooks/rules-of-hooks
      hasIslands || useRuntimeConfig()?.serviteConfig?.csr
        ? []
        : [
            // inject csr client entry
            renderTag({
              tag: 'script',
              attrs: {
                type: 'module',
                crossorigin: '',
                src: wrapViteId(
                  'virtual:servite-dist/client/app/entry.client.js'
                ),
              },
            }),
          ];

    if (!ssrContext.noSSR) {
      // Collect routes styles to avoid FOUC
      const collectedStyles = await collectRoutesStyles(routeMatches);

      if (collectedStyles.length) {
        collectedStyles.forEach(({ id, url, code }) => {
          if (code) {
            // Vite handles HMR for styles injected as scripts
            devAssets.push(
              renderTag({
                tag: 'script',
                attrs: {
                  type: 'module',
                  crossorigin: '',
                  src: url,
                },
              })
            );
            // - We still want to inject the styles to avoid FOUC.
            // - The `data-ssr-dev-id` attribute will be used by ssr-styles-cleaner
            //   to determine whether a style element is injected in ssr
            devAssets.push(
              renderTag({
                tag: 'style',
                attrs: {
                  'data-ssr-dev-id': id,
                },
                children: `\n${code}\n`,
              })
            );
          } else if (url) {
            // eg. css modules file
            devAssets.push(
              renderTag({
                tag: 'link',
                attrs: {
                  rel: 'stylesheet',
                  href: url,
                  'data-ssr-dev-id': id,
                },
              })
            );
          }
        });

        devAssets.push(
          renderTag({
            tag: 'script',
            children: ssrStylesCleanerCode,
          })
        );
      }
    }

    return devAssets.filter(Boolean).join('\n    ');
  }

  // We mounted server assets `servite` in src/node/nitro/init.ts,
  // so we can get files from `assets/servite` here.
  _ssrManifestJson ||= (await storage.getItem<Record<string, string[]>>(
    'assets/servite/ssr-manifest.json'
  ))!;

  return routeMatches
    .flatMap(m => {
      const route = m.route;
      return (_ssrManifestJson?.[(route.handle || route).filePath] || []).map(
        link =>
          hasIslands && link.endsWith('.js') ? '' : renderPreloadLink(link)
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

  return `${renderTag({
    tag: 'script',
    children: islandsHydrateCode,
  })}
${renderTag({
  tag: 'script',
  attrs: {
    type: 'module',
    crossorigin: '',
    src: wrapViteId(`virtual:servite/islands/${compressed}`),
  },
})}`;
}

async function renderFullHtml(
  ssrContext: SSRContext,
  { renderResult, renderContext }: RenderAppHtmlResult
) {
  const routerContext = renderContext?.routerContext;
  const routeMatches = routerContext?.matches || [];
  let template = await loadTemplate(ssrContext);

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
  const hasIslands = Boolean(renderContext?.islands?.length);

  // Assets
  const assets = await renderAssets(ssrContext, routeMatches, hasIslands);

  const headTags = [
    title,
    priority,
    meta,
    link,
    script,
    style,
    assets,
    islandsScript,
    renderResult?.headTags,
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
    serverRendered: Boolean(renderResult?.appHtml),
    hasIslands,
    routerContext: routerContext
      ? {
          location: routerContext.location,
          handles: routeMatches.map(m => m.route.handle),
        }
      : undefined,
  };

  template = template.replace(
    '<div id="root"></div>',
    `<script>window.__SERVITE__ssrData = ${JSON.stringify(ssrData)}</script>
    <div id="root" data-server-rendered="${ssrData.serverRendered}">${
      renderResult?.appHtml || ''
    }</div>`
  );

  return template;
}
