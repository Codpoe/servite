/// <reference types="vinxi/types/server" />
import {
  defineEventHandler,
  getQuery,
  getRequestHeader,
  H3Event,
  setResponseHeaders,
} from 'vinxi/http';
import fileRoutes from 'vinxi/routes';
import { addRoute, createRouter, findRoute } from 'rou3';
import {
  FsRouteMod,
  HtmlTag,
  HtmlTransformer,
  Middleware,
  ServerFsRouteModule,
} from '../types/index.js';
import { onBeforeResponse } from './on-before-response.js';

declare module 'vinxi/http' {
  export interface H3EventContext {
    /**
     * Internal used to restore the middlewares.
     */
    _resolveMiddlewaresRestore?: () => void;
    /**
     * Internal used
     */
    _resolveMiddlewaresDone?: () => void;
    /**
     * Internal used
     */
    _rejectMiddlewaresDone?: () => void;
    /**
     * Internal used to store the matched server fs route.
     */
    _matchedServerFsRoute?: ReturnType<typeof findRoute<FsRouteMod>>;
    /**
     * Internal used to store the tags for template injection.
     */
    _templateInjectedTags?: HtmlTag[];
    /**
     * Internal used to store the tags for html injection.
     */
    _htmlInjectedTags?: HtmlTag[];
    /**
     * Internal used to store the transformers for html.
     */
    _htmlTransformers?: HtmlTransformer[];
  }
}

const router = createRouter<FsRouteMod>();

// Root middleware.
// Add useful utils to the event context.
const rootMiddleware: Middleware = (event, next) => {
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
      event.context._templateInjectedTags ||= [];
      event.context._templateInjectedTags.push(
        ...(Array.isArray(tags) ? tags : [tags]),
      );
    },
  };

  event.context.html = {
    inject(tags) {
      event.context._htmlInjectedTags ||= [];
      event.context._htmlInjectedTags.push(
        ...(Array.isArray(tags) ? tags : [tags]),
      );
    },
    addTransformer(transformer) {
      event.context._htmlTransformers ||= [];
      event.context._htmlTransformers.push(transformer);
    },
  };

  event.context.ssr = true;

  if (
    getQuery(event)?.ssr_fallback === '1' ||
    getRequestHeader(event, 'x-ssr-fallback') === '1'
  ) {
    event.context.ssr = false;
  }

  setResponseHeaders(event, {
    'x-powered-by': 'Servite',
  });

  return next();
};

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

// const mapMiddlewareHooks = <T extends keyof Middleware, K = Middleware[T]>(
//   hook: T,
// ) => {
//   return middlewares
//     .flatMap(m => m[hook] || [])
//     .filter(x => Boolean(x)) as K extends any[] ? K : never;
// };

interface ComposeCallbacks {
  onSuspend: () => Promise<void>;
  onDone: () => void;
  onError: (err: any) => void;
}

const compose = (
  middlewares: Middleware[],
  { onSuspend, onDone, onError }: ComposeCallbacks,
) => {
  return (event: H3Event) => {
    let index = -1;

    const dispatch = async (i: number): Promise<void> => {
      if (i <= index) {
        throw new Error('next() called multiple times');
      }

      index = i;
      let m = middlewares[i];

      if (i === middlewares.length) {
        m = () => onSuspend();
      }

      await m(event, dispatch.bind(null, i + 1));
    };

    dispatch(0).then(onDone, onError);
  };
};

export default defineEventHandler({
  onRequest: async event => {
    await new Promise<void>((resolve, reject) => {
      compose(middlewares, {
        onSuspend() {
          resolve();
          return new Promise<void>(resolve => {
            event.context._resolveMiddlewaresRestore = resolve;
          });
        },
        onDone() {
          if (event.handled) {
            resolve();
          }
          event.context._resolveMiddlewaresDone?.();
        },
        onError(err) {
          reject(err);
          event.context._rejectMiddlewaresDone?.();
        },
      })(event);
    });
  },
  onBeforeResponse: (event, response) => {
    if (response?.body !== undefined) {
      return onBeforeResponse(event, response);
    }
  },
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
