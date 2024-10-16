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
import {
  createStaticHandler,
  createStaticRouter,
  StaticHandlerContext,
  StaticRouterProvider,
} from 'react-router-dom/server';
import reactDomServer, {
  PipeableStream,
  renderToPipeableStream,
} from 'react-dom/server';
import { isbot } from 'isbot';
import { HelmetProvider } from '../libs/react-helmet-async/index.js';
import { RouterName } from '../types/index.js';
import { onBeforeResponse } from '../server/on-before-response.js';
import { getRoutes, HANDLE_INIT_KEY } from './routes.js';
import {
  getRouterHydrationScript,
  RouterHydration,
} from './RouterHydration.js';
import {
  transformHtmlForReadableStream,
  transformHtmlForPipeableStream,
  HelmetContext,
} from './transform-html.js';

async function getApp(
  event: H3Event,
  helmetContext: HelmetContext,
): Promise<{
  app?: React.ReactNode;
  handlerContext?: Response | StaticHandlerContext;
}> {
  if (!event.context.ssr) {
    return {};
  }

  const routes = getRoutes();
  const staticHandler = createStaticHandler(routes, {
    basename: import.meta.env.SERVER_BASE,
  });
  // run router loader
  const handlerContext = await staticHandler.query(getWebRequest(event), {
    requestContext: event.context,
  });

  if (handlerContext instanceof Response) {
    return { handlerContext };
  }

  // set response status
  // For example, if no route is matched, the statusCode here will be 404.
  setResponseStatus(event, handlerContext.statusCode);

  // init routes handle
  await Promise.all(
    handlerContext.matches.map(m => m.route.handle?.[HANDLE_INIT_KEY]?.()),
  );

  const router = createStaticRouter(routes, handlerContext);

  const app = (
    <>
      <HelmetProvider context={helmetContext}>
        <StaticRouterProvider
          router={router}
          context={handlerContext}
          hydrate={false}
        />
      </HelmetProvider>
      <RouterHydration context={handlerContext} />
    </>
  );

  return {
    app,
    handlerContext,
  };
}

async function render(event: H3Event) {
  const helmetContext: HelmetContext = {};
  const { app, handlerContext } = await getApp(event, helmetContext);

  if (handlerContext instanceof Response) {
    return handlerContext;
  }

  const clientManifest = getManifest(RouterName.Client);
  const bootstrapScriptContent = `window.__servite__ = ${JSON.stringify({ ssr: event.context.ssr, ssrFallback: event.context.ssrFallback })};
window.manifest = ${JSON.stringify(await clientManifest.json())};
${getRouterHydrationScript(handlerContext)}`;
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
      transformHtmlForReadableStream({ event, helmetContext }),
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

export default defineEventHandler({
  onBeforeResponse: (event, response) => {
    setResponseHeaders(event, {
      'x-servite-ssr': Number(Boolean(event.context.ssr)),
      'x-servite-ssr-fallback': Number(Boolean(event.context.ssrFallback)),
    });
    return onBeforeResponse(event, response);
  },
  handler: async event => {
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
  },
});
