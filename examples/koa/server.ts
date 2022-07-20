import Koa, { Middleware } from 'koa';
import Router from '@koa/router';
import httpDevServer from 'servite/http-dev-server';
import viteDevServer from 'servite/vite-dev-server';

const app = new Koa();
const router = new Router();

// This is an optional optimization to load routes lazily so that
// when reloadOn option is set to "static-deps-change",
// changes to the route handlers will not trigger a reload.
// Feel free to remove this and import routes directly.
function lazy(importer: () => Promise<{ default: Middleware }>): Middleware {
  return async (ctx, next) => {
    try {
      const routeHandler = (await importer()).default;
      return routeHandler(ctx, next);
    } catch (err) {
      if (err instanceof Error) viteDevServer?.ssrFixStacktrace(err);
      throw err;
    }
  };
}

router.get(
  '/user',
  lazy(() => import('./routes/user'))
);

app.use(router.routes());

if (httpDevServer) {
  httpDevServer.on('request', app.callback());
} else {
  // eslint-disable-next-line no-console
  console.log('Starting prod server');
  app.listen(3000);
}
