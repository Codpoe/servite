/// <reference types="vinxi/types/server" />
import { defineEventHandler } from 'vinxi/http';
import fileRoutes from 'vinxi/routes';
import { addRoute, createRouter, findRoute } from 'rou3';
import { FsRouteMod, ServerFsRouteModule } from '../types/index.js';

const router = createRouter<FsRouteMod>();
const middlewares: FsRouteMod[] = [];

(fileRoutes as ServerFsRouteModule[]).forEach(route => {
  if (route.$$middleware) {
    middlewares.push(route.$$middleware);
    return;
  }
  addRoute(router, route.method, route.routePath, route.$handler);
});

const mapMiddlewareHooks = (hook: 'onRequest' | 'onBeforeResponse') => {
  return middlewares.map(m => m.require?.()?.default?.[hook]).filter(Boolean);
};

export default defineEventHandler({
  onRequest: mapMiddlewareHooks('onRequest'),
  onBeforeResponse: mapMiddlewareHooks('onBeforeResponse').reverse(),
  handler: async event => {
    const matchedRoute = findRoute(router, event.method, event.path);

    if (matchedRoute) {
      event.context.params = matchedRoute.params;
      const handler = (await matchedRoute.data.import?.())?.default;

      if (handler) {
        return handler(event);
      }
    }
  },
});
