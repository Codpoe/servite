import { createRoot, hydrateRoot } from 'react-dom/client';
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
  matchRoutes,
} from 'react-router-dom';
import { HelmetProvider } from './helmet.js';
import { routes } from './routes.js';
import { NProgress } from './components/NProgress.js';

async function bootstrap() {
  const container = document.getElementById('root');

  if (!container) {
    throw new Error('[servite] Cannot find an element with id "root"');
  }

  const serverRendered = container.dataset.serverRendered === 'true';

  if (serverRendered) {
    // Determine if any of the initial routes are lazy
    const lazyMatches = matchRoutes(routes, window.location)?.filter(
      m => m.route.lazy
    );

    // Load the lazy matches and update the routes before creating router
    // so we can hydrate the SSR-rendered content synchronously
    if (lazyMatches?.length) {
      await Promise.all(
        lazyMatches.map(async ({ route }) => {
          const m = await route.lazy!();
          Object.assign(route, {
            ...m,
            lazy: undefined,
          });
        })
      );
    }
  }

  const router = createBrowserRouter(routes);

  // for router hmr
  if (import.meta.hot) {
    const traverseRoutes = (
      routes: RouteObject[],
      visitor: (route: RouteObject) => RouteObject
    ): RouteObject[] => {
      return routes.map(route => {
        const { children } = route;
        route = visitor(route) ?? route;

        if (children?.length) {
          route.children = traverseRoutes(children, visitor);
        }

        return route;
      });
    };

    window.__SERVITE_mapRoutes__ = fn => {
      const newRoutes = traverseRoutes(router.routes, fn);
      router._internalSetRoutes(newRoutes);

      return new Promise<RouteObject[]>(resolve => {
        const unsubscribe = router.subscribe(state => {
          if (state.revalidation === 'idle') {
            unsubscribe();
            // Ensure RouterProvider setState has flushed before re-rendering
            resolve(newRoutes);
          }
        });
        router.revalidate();
      });
    };
  }

  const element = (
    <HelmetProvider>
      <RouterProvider router={router} fallbackElement={<NProgress />} />
    </HelmetProvider>
  );

  if (serverRendered) {
    // ssr hydrate
    hydrateRoot(container, element);
    return;
  }

  // csr
  createRoot(container).render(element);
}

bootstrap();
