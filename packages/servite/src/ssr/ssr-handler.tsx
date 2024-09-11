/// <reference types="vinxi/types/server" />
import {
  defineEventHandler,
  getRequestHeader,
  getWebRequest,
  setResponseHeaders,
  setResponseStatus,
} from 'vinxi/http';
import { getManifest } from 'vinxi/manifest';
import { renderAsset } from '@vinxi/react';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server';
import reactDomServer, {
  PipeableStream,
  renderToPipeableStream,
} from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { isbot } from 'isbot';
import { RouterName } from '../types/index.js';
import { createErrorResponse } from '../utils/index.js';
import { routes } from './routes.js';
import { RouterHydration } from './RouterHydration.js';
import {
  transformHtmlForReadableStream,
  transformHtmlForPipeableStream,
} from './transform-html.js';

type HelmetContext = NonNullable<
  React.ComponentProps<typeof HelmetProvider>['context']
>;

export default defineEventHandler(async event => {
  if (!routes.length) {
    return createErrorResponse(404, 'Not Found');
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
  const helmetContext: HelmetContext = {};

  const assets = (await clientManifest.inputs[
    clientManifest.handler
  ].assets()) as any as {
    tag: string;
    attrs: Record<string, string>;
    children: any;
  }[];

  const bootstrapScriptContent = `window.__servite__ = ${JSON.stringify({ ssr: true })};
window.manifest = ${JSON.stringify(clientManifest.json())};`;
  const bootstrapModules = [
    clientManifest.inputs[clientManifest.handler].output.path,
  ];

  const isBot = isbot(getRequestHeader(event, 'User-Agent'));

  const app = (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <template id="__HEAD_TAGS__"></template>
        {assets.map(asset => renderAsset(asset))}
      </head>
      <body>
        <RouterHydration context={handlerContext} />
        <div id="root">
          <HelmetProvider context={helmetContext}>
            <StaticRouterProvider
              router={router}
              context={handlerContext}
              hydrate={false}
            />
          </HelmetProvider>
        </div>
      </body>
    </html>
  );

  try {
    let didError = false;
    const onError = (error: any) => {
      didError = true;
      // eslint-disable-next-line no-console
      console.error(error);
      // TODO: report error
    };

    // For environments with Web Streams, like Deno and modern edge runtimes
    if (typeof reactDomServer.renderToReadableStream === 'function') {
      const stream = await reactDomServer.renderToReadableStream(app, {
        bootstrapScriptContent,
        bootstrapModules,
        onError,
      });

      if (isBot) {
        await stream.allReady;
      }

      if (didError) {
        setResponseStatus(event, 500);
      }

      setResponseHeaders(event, {
        'Content-Type': 'text/html',
      });

      return stream.pipeThrough(
        transformHtmlForReadableStream({ helmetContext }),
      );
    }

    // For Node.js
    if (typeof reactDomServer.renderToPipeableStream === 'function') {
      const stream = await new Promise<PipeableStream>((resolve, reject) => {
        const stream = renderToPipeableStream(app, {
          bootstrapScriptContent,
          bootstrapModules,
          onShellReady() {
            if (!isBot) {
              resolve(stream);
            }
          },
          onAllReady() {
            resolve(stream);
          },
          onShellError(error) {
            reject(error);
          },
          onError(error) {
            onError(error);
            reject(error);
          },
        });
      });

      if (didError) {
        setResponseStatus(event, 500);
      }

      setResponseHeaders(event, {
        'Content-Type': 'text/html',
      });

      return stream.pipe(transformHtmlForPipeableStream({ helmetContext }));
    }
  } catch (error: any) {
    // TODO: fallback to CSR
    return createErrorResponse(
      500,
      'Internal Server Error',
      error || new Error('Something went wrong'),
    );
  }

  throw new Error(
    'No renderToReadableStream or renderToPipeableStream found in react-dom/server. Ensure you are using a version of react-dom that supports streaming.',
  );
});
