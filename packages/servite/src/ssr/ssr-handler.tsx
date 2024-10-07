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
import { RouterName } from '../types/index.js';
import { getRoutes, HANDLE_INIT_KEY } from './routes.js';
import { RouterHydration } from './RouterHydration.js';
import {
  transformHtmlForReadableStream,
  transformHtmlForPipeableStream,
} from './transform-html.js';
import { groupHtmlTags, renderTags } from './html-tags.js';

type HelmetContext = NonNullable<
  React.ComponentProps<typeof HelmetProvider>['context']
>;

async function getHtml(event: H3Event, helmetContext: HelmetContext) {
  const clientManifest = getManifest(RouterName.Client);
  const assets = (await clientManifest.inputs[
    clientManifest.handler
  ].assets()) as any as {
    tag: string;
    attrs: Record<string, string>;
    children: any;
  }[];

  const app = await getApp(event, helmetContext);

  if (app instanceof Response) {
    return app;
  }

  const { headTags, headPrependTags, bodyTags, bodyPrependTags } =
    groupHtmlTags(event.context.template?._injectTags);

  return (
    <html>
      <head>
        {renderTags(headPrependTags)}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <template id="__HEAD_TAGS__"></template>
        {assets.map(asset => renderAsset(asset))}
        {renderTags(headTags)}
      </head>
      <body>
        {renderTags(bodyPrependTags)}
        <noscript>
          We&apos;re sorry but react app doesn&apos;t work properly without
          JavaScript enabled. Please enable it to continue.
        </noscript>
        {app}
        {renderTags(bodyTags)}
      </body>
    </html>
  );
}

async function getApp(event: H3Event, helmetContext: HelmetContext) {
  if (!event.context.ssr) {
    return <div id="root" />;
  }

  const routes = getRoutes();
  const staticHandler = createStaticHandler(routes, {
    basename: import.meta.env.SERVER_BASE,
  });
  // run router loader
  const handlerContext = await staticHandler.query(getWebRequest(event));

  if (handlerContext instanceof Response) {
    return handlerContext;
  }

  // init routes handle
  await Promise.all(
    handlerContext.matches.map(m => m.route.handle?.[HANDLE_INIT_KEY]?.()),
  );

  const router = createStaticRouter(routes, handlerContext);

  return (
    <>
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
    </>
  );
}

async function render(event: H3Event) {
  const helmetContext: HelmetContext = {};
  const html = await getHtml(event, helmetContext);

  if (html instanceof Response) {
    return html;
  }

  const clientManifest = getManifest(RouterName.Client);
  const bootstrapScriptContent = `window.__servite__ = ${JSON.stringify({ ssr: event.context.ssr, ssrFallback: event.context.ssrFallback })};
window.manifest = ${JSON.stringify(await clientManifest.json())};`;
  const bootstrapModules = [
    clientManifest.inputs[clientManifest.handler].output.path,
  ];
  const isBot = isbot(getRequestHeader(event, 'User-Agent'));

  let didError = false;
  const onError = (error: any) => {
    didError = true;
    event.context.logger.error(error);
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
      transformHtmlForReadableStream({ event, helmetContext }),
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

    return stream.pipe(
      transformHtmlForPipeableStream({ event, helmetContext }),
    );
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
  try {
    return await render(event);
  } catch (error: any) {
    event.context.ssr = false;
    event.context.logger.error('[servite] render error');
    event.context.logger.error(error);

    try {
      // fallback to CSR
      event.context.ssrFallback = true;
      return await await render(event);
    } catch (fallbackError: any) {
      event.context.ssrFallback = false;
      event.context.logger.error('[servite] ssr fallback error');
      event.context.logger.error(error);
      return sendRenderError(event, fallbackError);
    }
  }
});
