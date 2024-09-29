/// <reference types="vinxi/types/server" />
import {
  defineEventHandler,
  defineMiddleware,
  getQuery,
  getRequestHeader,
} from 'vinxi/http';
import fileRoutes from 'vinxi/routes';
import { addRoute, createRouter, findRoute } from 'rou3';
import { FsRouteMod, ServerFsRouteModule } from '../types/index.js';

type Middleware = ReturnType<typeof defineMiddleware>;

const router = createRouter<FsRouteMod>();

// Root middleware.
// Add useful utils to the event context.
const rootMiddleware = defineMiddleware({
  onRequest: event => {
    // Add default logger
    event.context.logger = console;

    // Add matched server fs route.
    event.context._matchedServerFsRoute = findRoute(
      router,
      event.method,
      event.path,
    );

    // if (event.context._matchedServerFsRoute) {
    //   event._path = withoutBase(event.path, import.meta.env.ROUTER_SERVER_BASE);
    //   return;
    // }

    // event._path = withoutBase(event.path, import.meta.env.ROUTER_SSR_BASE);

    // Add utils for ssr.
    event.context.template = {
      inject(tags) {
        event.context.template!._injectTags ||= [];
        event.context.template!._injectTags.push(
          ...(Array.isArray(tags) ? tags : [tags]),
        );
      },
    };

    event.context.html = {
      inject(tags) {
        event.context.template!._injectTags ||= [];
        event.context.template!._injectTags.push(
          ...(Array.isArray(tags) ? tags : [tags]),
        );
      },
      addTransformer(transformer) {
        event.context.html!._transformers ||= [];
        event.context.html!._transformers.push(transformer);
      },
    };

    event.context.ssr = true;

    if (
      getQuery(event)?.ssr_fallback === '1' ||
      getRequestHeader(event, 'x-ssr-fallback') === '1'
    ) {
      event.context.ssr = false;
    }
  },
});

const middlewares: Middleware[] = [rootMiddleware];

(fileRoutes as ServerFsRouteModule[]).forEach(route => {
  if (route.$$middleware) {
    const m = route.$$middleware.require?.()?.default;
    if (m) {
      middlewares.push(m);
    }
    return;
  }
  addRoute(router, route.method, route.routePath, route.$handler);
});

const mapMiddlewareHooks = <T extends keyof Middleware, K = Middleware[T]>(
  hook: T,
) => {
  return middlewares
    .flatMap(m => m[hook] || [])
    .filter(x => Boolean(x)) as K extends any[] ? K : never;
};

export default defineEventHandler({
  onRequest: mapMiddlewareHooks('onRequest'),
  onBeforeResponse: mapMiddlewareHooks('onBeforeResponse').reverse(),
  handler: async event => {
    const matchedRoute = event.context._matchedServerFsRoute;

    if (matchedRoute) {
      event.context.params = matchedRoute.params;
      const handler = (await matchedRoute.data.import?.())?.default;

      if (handler) {
        return handler(event);
      }
    }
  },
});
