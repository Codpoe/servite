/// <reference types="vinxi/types/server" />
import {
  createError,
  defineEventHandler,
  getRequestHeader,
  getWebRequest,
  H3Event,
  sendError,
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
import micromatch from 'micromatch';
import { RouterName } from '../types/index.js';
import { getRoutes } from './routes.js';
import { RouterHydration } from './RouterHydration.js';
import {
  transformHtmlForReadableStream,
  transformHtmlForPipeableStream,
} from './transform-html.js';

type HelmetContext = NonNullable<
  React.ComponentProps<typeof HelmetProvider>['context']
>;

const csrConfig = import.meta.env.CSR;

async function getHtml(
  event: H3Event,
  ssr: boolean,
  helmetContext: HelmetContext,
) {
  const clientManifest = getManifest(RouterName.Client);
  const assets = (await clientManifest.inputs[
    clientManifest.handler
  ].assets()) as any as {
    tag: string;
    attrs: Record<string, string>;
    children: any;
  }[];

  const app = await getApp(event, ssr, helmetContext);

  if (app instanceof Response) {
    return app;
  }

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <template id="__HEAD_TAGS__"></template>
        {assets.map(asset => renderAsset(asset))}
      </head>
      <body>
        <noscript>
          We&apos;re sorry but react app doesn&apos;t work properly without
          JavaScript enabled. Please enable it to continue.
        </noscript>
        {app}
      </body>
    </html>
  );
}

async function getApp(
  event: H3Event,
  ssr: boolean,
  helmetContext: HelmetContext,
) {
  if (!ssr) {
    return <div id="root" />;
  }

  const routes = getRoutes();
  const staticHandler = createStaticHandler(routes, {
    basename: import.meta.env.ROUTER_SSR_BASE_URL,
  });
  // run router loader
  const handlerContext = await staticHandler.query(getWebRequest(event));

  if (handlerContext instanceof Response) {
    return handlerContext;
  }

  const router = createStaticRouter(routes, handlerContext);

  return (
    <>
      <RouterHydration context={handlerContext} />
      <div id="root">
        {ssr && (
          <HelmetProvider context={helmetContext}>
            <StaticRouterProvider
              router={router}
              context={handlerContext}
              hydrate={false}
            />
          </HelmetProvider>
        )}
      </div>
    </>
  );
}

async function render(event: H3Event, ssr: boolean) {
  const helmetContext: HelmetContext = {};
  const html = await getHtml(event, ssr, helmetContext);

  if (html instanceof Response) {
    return html;
  }

  const clientManifest = getManifest(RouterName.Client);
  const bootstrapScriptContent = `window.__servite__ = ${JSON.stringify({ ssr })};
window.manifest = ${JSON.stringify(await clientManifest.json())};`;
  const bootstrapModules = [
    clientManifest.inputs[clientManifest.handler].output.path,
  ];
  const isBot = isbot(getRequestHeader(event, 'User-Agent'));

  let didError = false;
  const onError = (error: any) => {
    didError = true;
    // eslint-disable-next-line no-console
    console.error(error);
    // TODO: report error
  };

  // For environments with Web Streams, like Deno and modern edge runtimes
  if (typeof reactDomServer.renderToReadableStream === 'function') {
    const stream = await reactDomServer.renderToReadableStream(html, {
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
      const stream = renderToPipeableStream(html, {
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

  throw new Error(
    'No renderToReadableStream or renderToPipeableStream found in react-dom/server. Ensure you are using a version of react-dom that supports streaming.',
  );
}

function sendRenderError(event: H3Event, error: any) {
  const h3Error = createError(error || 'Something went wrong');
  h3Error.statusCode = 500;
  h3Error.statusMessage = 'Internal Server Error';
  h3Error.data = error?.toString?.();
  return sendError(event, h3Error, import.meta.env.DEV);
}

export default defineEventHandler(async event => {
  const ssr =
    typeof csrConfig === 'boolean'
      ? !csrConfig
      : !micromatch.isMatch(event.path, csrConfig);

  try {
    return await render(event, ssr);
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('[servite] render error');
    // eslint-disable-next-line no-console
    console.error(error);

    if (import.meta.env.FALLBACK_TO_CSR) {
      try {
        // fallback to CSR
        return await await render(event, false);
      } catch (fallbackError: any) {
        // eslint-disable-next-line no-console
        console.log('[servite] fallback render error');
        // eslint-disable-next-line no-console
        console.error(error);
        return sendRenderError(event, fallbackError);
      }
    }

    return sendRenderError(event, error);
  }
});
