/// <reference types="vinxi/types/server" />
import { Transform, TransformCallback } from 'node:stream';
import {
  defineEventHandler,
  getWebRequest,
  sendError,
  setResponseHeaders,
  setResponseStatus,
} from 'vinxi/http';
import { getManifest } from 'vinxi/manifest';
import { createAssets } from '@vinxi/react';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server';
import { PipeableStream, renderToPipeableStream } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense } from 'react';
import { RouterName } from '../types/index.js';
import { createNotFoundResponse } from '../utils/index.js';
import { routes } from './routes.js';

type HelmetContext = NonNullable<
  React.ComponentProps<typeof HelmetProvider>['context']
>;

export default defineEventHandler(async event => {
  if (!routes.length) {
    return createNotFoundResponse();
  }

  const ssrManifest = getManifest(RouterName.SSR);
  const clientManifest = getManifest(RouterName.Client);

  const staticHandler = createStaticHandler(routes, {
    basename: ssrManifest.base,
  });
  // run router loader
  const handlerContext = await staticHandler.query(getWebRequest(event));

  if (handlerContext instanceof Response) {
    return handlerContext;
  }

  const router = createStaticRouter(routes, handlerContext);
  const Assets = createAssets(clientManifest.handler, clientManifest);
  const helmetContext: HelmetContext = {};
  let didError = false;

  const stream = await new Promise<PipeableStream | undefined>(resolve => {
    const stream = renderToPipeableStream(
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <template id="__HEAD_TAGS__"></template>
          <Suspense>
            <Assets />
          </Suspense>
        </head>
        <body>
          <div id="root">
            <HelmetProvider context={helmetContext}>
              <StaticRouterProvider
                router={router}
                context={handlerContext}
                // TODO: set hydrate to false when using react-router defer promise
                hydrate={true}
              />
            </HelmetProvider>
          </div>
        </body>
      </html>,
      {
        onShellReady() {
          resolve(stream);
        },
        onShellError(error: any) {
          // TODO: fallback to CSR
          sendError(
            event,
            error ?? new Error('Something went wrong'),
            import.meta.env.DEV,
          );
          resolve(undefined);
        },
        onError(error) {
          didError = true;
          // eslint-disable-next-line no-console
          console.error(error);
          // TODO: report error
        },
        bootstrapModules: [
          clientManifest.inputs[clientManifest.handler].output.path,
        ],
        bootstrapScriptContent: `window.__servite = ${JSON.stringify({ ssr: true })};
window.manifest = ${JSON.stringify(clientManifest.json())};`,
      },
    );
  });

  if (!stream) {
    return;
  }

  if (didError) {
    setResponseStatus(event, 500);
  }

  setResponseHeaders(event, {
    'Content-Type': 'text/html',
  });

  return stream.pipe(new HtmlTransformStream({ helmetContext }));
});

class HtmlTransformStream extends Transform {
  isFirstChunk = true;
  helmetContext: HelmetContext;

  constructor({ helmetContext }: { helmetContext: HelmetContext }) {
    super();
    this.helmetContext = helmetContext;
  }

  _transform(
    chunk: any,
    _encoding: BufferEncoding,
    callback: TransformCallback,
  ) {
    // inject helmet data
    if (this.isFirstChunk) {
      this.isFirstChunk = false;

      const {
        htmlAttributes,
        bodyAttributes,
        title,
        priority,
        meta,
        link,
        style,
        script,
      } = this.helmetContext.helmet || {};
      const htmlAttrs = htmlAttributes?.toString() || '';
      const bodyAttrs = bodyAttributes?.toString();
      let html: string = chunk.toString('utf-8');

      if (htmlAttrs) {
        html = html.replace('<html>', `<html ${htmlAttrs}>`);
      }

      if (bodyAttrs) {
        html = html.replace('<body>', `<body ${bodyAttrs}>`);
      }

      const headTags = [title, priority, meta, link, style, script]
        .map(x => x?.toString())
        .filter(Boolean)
        .join('\n  ');

      if (headTags) {
        html = html.replace(
          '<template id="__HEAD_TAGS__"></template>',
          headTags,
        );
      }

      chunk = Buffer.from(html, 'utf-8');
    }

    this.push(chunk);
    callback();
  }
}
